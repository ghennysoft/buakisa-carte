import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const cards = await prisma.savingsCard.findMany({
      where: session.role === 'ADMIN' ? {} : { createdById: session.userId },
      include: {
        client: {
          select: { id: true, fullName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ cards });
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

    const { clientId, name, dailyAmount, currency, totalDays } = await request.json();

    if (!clientId || !dailyAmount || !totalDays) {
      return NextResponse.json({ error: 'Tous les champs sont requis' }, { status: 400 });
    }

    const card = await prisma.savingsCard.create({
      data: {
        clientId,
        name: name || 'Epargne',
        dailyAmount: parseFloat(dailyAmount),
        currency: currency,
        totalDays: parseInt(totalDays),
        createdById: session.userId,
      },
      include: {
        client: {
          select: { id: true, fullName: true },
        },
      },
    });

    return NextResponse.json({ card });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la creation' }, { status: 500 });
  }
}
