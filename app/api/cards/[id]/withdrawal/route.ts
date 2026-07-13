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

    const card = await prisma.savingsCard.findFirst({
      where: {
        id,
        status: 'ACTIVE',
      },
    });

    if (!card) {
      return NextResponse.json({ error: 'Carte non trouvee ou inactive' }, { status: 404 });
    }

    // Create withdrawal request
    const withdrawal = await prisma.withdrawalRequest.create({
      data: {
        cardId: id,
        requestedById: session.userId,
        amount: card.totalSaved,
      },
    });

    // Update card status
    await prisma.savingsCard.update({
      where: { id },
      data: { status: 'WITHDRAWAL_REQUESTED' },
    });

    return NextResponse.json({ withdrawal });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la demande de retrait' }, { status: 500 });
  }
}
