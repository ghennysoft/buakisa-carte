import { NextRequest, NextResponse } from 'next/server';
import { register } from '@/lib/auth';
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const { email, password, fullName, role, createdBy } = await request.json();

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caracteres' },
        { status: 400 }
      );
    }

    // Only admins can create other admins/agents
    const userRole = role || 'AGENT';
    const createdById = createdBy || session?.userId || null;

    const result = await register(email, password, fullName, userRole, createdById);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const { password: _, ...userWithoutPassword } = result.user!;
    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la creation du compte' },
      { status: 500 }
    );
  }
}
