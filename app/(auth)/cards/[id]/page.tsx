'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { TopBar } from '@/components/top-bar';
import { BottomNav } from '@/components/bottom-nav';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, Hourglass, Wallet, Plus, AlertTriangle, MoreVertical, Clock } from 'lucide-react';
import Link from 'next/link';

interface Deposit {
  id: string;
  amount: number;
  depositDate: Date;
  status: string;
  notes: string | null;
  createdAt: string;
}

interface Card {
  id: string;
  totalSaved: number;
  dailyAmount: number;
  currency: string;
  totalDays: number;
  daysCovered: number;
  status: string;
  client: { fullName: string } | null;
  deposits: Deposit[];
}

const statusLabels: Record<string, string> = {
  ACTIVE: 'Actif',
  COMPLETED: 'Complete',
  WITHDRAWAL_REQUESTED: 'Retrait demande',
  WITHDRAWN: 'Retire',
};

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-primary-container/20 text-primary',
  COMPLETED: 'bg-secondary-container text-on-secondary-container',
  WITHDRAWAL_REQUESTED: 'bg-error-container/20 text-error',
  WITHDRAWN: 'bg-surface-container-high text-secondary',
};

export default function CardDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const id = params?.id as string;

  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [withdrawalLoading, setWithdrawalLoading] = useState(false);

  useEffect(() => {
    if (id && user) {
      fetchCard();
    }
  }, [id, user]);

  const fetchCard = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/cards/${id}`);
      if (res.ok) {
        const data = await res.json();
        setCard(data.card);
      }
    } catch (err) {
      console.error('Error fetching card:', err);
    }
    setLoading(false);
  };

  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleWithdrawalRequest = async () => {
    if (!card || withdrawalLoading) return;
    if (!confirm('Etes-vous sur de vouloir demander un retrait pour cette carte ?')) return;

    setWithdrawalLoading(true);
    try {
      const res = await fetch(`/api/cards/${card.id}/withdrawal`, {
        method: 'POST',
      });

      if (!res.ok) {
        alert('Erreur lors de la demande de retrait');
        return;
      }

      await fetchCard();
      alert('Demande de retrait envoyee');
    } catch (err) {
      alert('Erreur lors de la demande de retrait');
    } finally {
      setWithdrawalLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <TopBar title="Chargement..." showBack />
        <main className="px-container-margin mt-md space-y-md animate-pulse">
          <div className="h-40 bg-surface-container rounded-xl"></div>
          <div className="h-20 bg-surface-container rounded-xl"></div>
        </main>
      </>
    );
  }

  if (!card) {
    return (
      <>
        <TopBar title="Carte non trouvee" showBack />
        <main className="px-container-margin mt-md text-center py-xl">
          <p className="font-body-md text-secondary">Cette carte n&apos;existe pas.</p>
          <button
            onClick={() => router.push('/cards')}
            className="mt-sm text-primary font-label-md"
          >
            Retour aux cartes
          </button>
        </main>
      </>
    );
  }

  const progress = card.totalDays > 0 ? (card.daysCovered / card.totalDays) * 100 : 0;
  const target = card.dailyAmount * card.totalDays;
  const daysRemaining = card.totalDays - card.daysCovered;
  const canAddDeposit = card.status === 'ACTIVE' && daysRemaining > 0;

  return (
    <>
      <TopBar
        title={card.client?.fullName || 'Carte'}
        showBack
        rightAction={
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors">
            <MoreVertical className="w-6 h-6 text-on-surface" />
          </button>
        }
      />
      <main className="px-container-margin mt-sm space-y-md">
        {/* Card Details */}
        <section className="bg-surface-container-lowest rounded-xl p-md shadow-ambient relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container opacity-20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

          <div className="flex items-center justify-between mb-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-tertiary-container flex items-center justify-center">
                <Wallet className="w-4 h-4 text-on-surface" />
              </div>
              <span className="font-label-md text-on-surface-variant">
                {card.client?.fullName || 'Client inconnu'}
              </span>
            </div>
            <span
              className={`px-2 py-0.5 rounded-md font-label-sm ${statusColors[card.status]}`}
            >
              {statusLabels[card.status]}
            </span>
          </div>

          <div className="mt-xs">
            <p className="font-body-sm text-secondary mb-1">Montant epargne</p>
            <h2 className="font-display-lg text-on-surface tracking-tight">
              {formatCurrency(card.totalSaved, card.currency)}
            </h2>
          </div>

          {/* Progress */}
          <div className="mt-md">
            <div className="flex justify-between font-label-sm text-on-surface-variant mb-2">
              <span>Progression</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  card.status === 'ACTIVE' ? 'bg-primary' : 'bg-secondary'
                }`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between font-label-sm text-secondary mt-2">
              <span>Objectif: {formatCurrency(target, card.currency)}</span>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-4 mt-lg border-t border-surface-container pt-md">
            <div>
              <p className="font-label-sm text-secondary mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Jours couverts
              </p>
              <p className="font-headline-sm text-on-surface">
                {card.daysCovered}{' '}
                <span className="font-body-sm text-secondary font-normal">jours</span>
              </p>
            </div>
            <div>
              <p className="font-label-sm text-secondary mb-1 flex items-center gap-1">
                <Hourglass className="w-3 h-3" /> Jours restants
              </p>
              <p className="font-headline-sm text-on-surface">
                {daysRemaining > 0 ? daysRemaining : 0}{' '}
                <span className="font-body-sm text-secondary font-normal">jours</span>
              </p>
            </div>
          </div>
        </section>

        {/* Add Deposit Button */}
        {canAddDeposit && (
          <Link
            href={`/cards/${card.id}/deposit`}
            className="w-full py-4 rounded-full bg-primary-container text-on-primary-container font-label-md flex justify-center items-center gap-2 shadow-primary hover:scale-[0.98] transition-all"
          >
            <Plus className="w-5 h-5" />
            Ajouter une mise
          </Link>
        )}

        {/* Withdrawal Request Button */}
        {card.status === 'ACTIVE' && card.totalSaved > 0 && (
          <button
            onClick={handleWithdrawalRequest}
            disabled={withdrawalLoading}
            className="w-full py-4 rounded-full bg-surface-container-lowest border border-outline-variant text-on-surface font-label-md flex justify-center items-center gap-2 hover:bg-surface-container-low transition-all"
          >
            <AlertTriangle className="w-5 h-5 text-error" />
            {withdrawalLoading ? 'Traitement...' : 'Demander un retrait'}
          </button>
        )}

        {card.status === 'WITHDRAWAL_REQUESTED' && (
          <div className="p-sm bg-error-container/20 border border-error/30 rounded-xl flex items-center gap-2">
            <Clock className="w-5 h-5 text-error" />
            <p className="font-body-sm text-error">Retrait en attente de validation</p>
          </div>
        )}

        {/* Deposits List */}
        <section className="mt-lg">
          <div className="flex justify-between items-end mb-sm">
            <h3 className="font-headline-sm text-on-surface">Mises quotidiennes</h3>
            <span className="font-label-sm text-secondary">{card.deposits?.length || 0} mises</span>
          </div>

          {!card.deposits || card.deposits.length === 0 ? (
            <div className="text-center py-md bg-surface-container-lowest rounded-xl">
              <p className="font-body-md text-secondary">Aucune mise pour cette carte</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {card.deposits.slice(0, 10).map((deposit) => (
                <div
                  key={deposit.id}
                  className="flex items-center justify-between p-sm bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-ambient transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                      <Plus className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-label-md text-on-surface">
                        {deposit.notes || 'Mise d\'epargne'}
                      </p>
                      <p className="font-body-sm text-secondary">
                        {format(new Date(deposit.depositDate), 'd MMM yyyy, HH:mm', { locale: fr })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-label-md text-on-surface">+ {formatCurrency(deposit.amount, card.currency)}</p>
                    <span className="inline-flex items-center gap-1 mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-secondary-container/30 text-on-surface-variant">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed-dim"></span>
                      {deposit.status === 'COMPLETED' ? 'Reussi' : 'En attente'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
