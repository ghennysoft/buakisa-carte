import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { id } = await params;
    const { depositDate, notes } = await request.json();

    const card = await prisma.savingsCard.findFirst({
      where: {
        id,
        status: 'ACTIVE',
      },
    });

    if (!card) {
      return NextResponse.json({ error: 'Carte non trouvee ou inactive' }, { status: 404 });
    }

    // Create deposit
    const deposit = await prisma.deposit.create({
      data: {
        cardId: id,
        amount: card.dailyAmount,
        depositDate: new Date(depositDate || new Date()),
        notes: notes || null,
        createdById: session.userId,
      },
    });

    // Update card stats
    const newDaysCovered = card.daysCovered + 1;
    const newTotalSaved = card.totalSaved.toNumber() + card.dailyAmount.toNumber();
    const newStatus = newDaysCovered >= card.totalDays ? 'COMPLETED' : 'ACTIVE';

    await prisma.savingsCard.update({
      where: { id },
      data: {
        daysCovered: newDaysCovered,
        totalSaved: newTotalSaved,
        status: newStatus,
      },
    });

    return NextResponse.json({ deposit, card: { ...card, daysCovered: newDaysCovered, totalSaved: newTotalSaved, status: newStatus } });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la creation du depot' }, { status: 500 });
  }
}
