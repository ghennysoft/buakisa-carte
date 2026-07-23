import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { id } = await params;

    let whereData;
    if(session.role !== 'CLIENT'){
      whereData = { id, ...(session.role === 'ADMIN' ? {} : { createdById: session.userId }) }
    } else {
      whereData = { id, ...({ clientId: session.userId }) }
    }

    const card = await prisma.savingsCard.findFirst({
      where: whereData,
      include: {
        client: {
          select: { id: true, fullName: true },
        },
        deposits: {
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
      },
    });

    if (!card) {
      return NextResponse.json({ error: 'Carte non trouvee' }, { status: 404 });
    }

    return NextResponse.json({ card });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    const card = await prisma.savingsCard.update({
      where: { id },
      data,
    });

    return NextResponse.json({ card });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la mise a jour' }, { status: 500 });
  }
}
