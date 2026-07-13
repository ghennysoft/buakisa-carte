import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { Profile, Role } from '../generated/prisma/client';

const secretKey = process.env.JWT_SECRET || 'your-secret-key-at-least-32-characters-long';
const key = new TextEncoder().encode(secretKey);

export interface SessionData {
  userId: string;
  email: string;
  fullName: string;
  role: Role;
}

export async function signToken(payload: SessionData): Promise<string> {
  return new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key);
}

export async function verifyToken(token: string): Promise<SessionData | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    });
    return payload as unknown as SessionData;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createSession(userId: string, email: string, fullName: string, role: Role): Promise<void> {
  const token = await signToken({ userId, email, fullName, role });
  const cookieStore = await cookies();
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

export async function getCurrentUser(): Promise<Profile | null> {
  const session = await getSession();
  if (!session) return null;

  const user = await prisma.profile.findUnique({
    where: { id: session.userId },
  });

  return user;
}

export async function authenticate(email: string, password: string): Promise<{ success: boolean; error?: string; user?: Profile }> {
  const user = await prisma.profile.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    return { success: false, error: 'Email ou mot de passe incorrect' };
  }

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    return { success: false, error: 'Email ou mot de passe incorrect' };
  }

  await createSession(user.id, user.email, user.fullName, user.role);
  return { success: true, user };
}

export async function register(
  email: string,
  password: string,
  fullName: string,
  role: Role = 'AGENT',
  createdById?: string
): Promise<{ success: boolean; error?: string; user?: Profile }> {
  const existingUser = await prisma.profile.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingUser) {
    return { success: false, error: 'Cet email est deja utilise' };
  }

  const hashedPassword = await hashPassword(password);

  try {
    const user = await prisma.profile.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        fullName,
        role,
        createdById: createdById || null,
      },
    });

    return { success: true, user };
  } catch (error) {
    return { success: false, error: 'Erreur lors de la creation du compte' };
  }
}
