import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const clients = await prisma.profile.findMany({
      where: { role: 'CLIENT' },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ clients });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { fullName, email, phone, address } = await request.json();

    if (!fullName) {
      return NextResponse.json({ error: 'Le nom est requis' }, { status: 400 });
    }

    // const client = await prisma.client.create({
    //   data: {
    //     fullName,
    //     email: email || null,
    //     phone: phone || null,
    //     address: address || null,
    //     agentId: session.userId,
    //   },
    // });

    return NextResponse.json('client');
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la creation' }, { status: 500 });
  }
}
