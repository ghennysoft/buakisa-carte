'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { TopBar } from '@/components/top-bar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, ChevronRight, CheckCircle, PiggyBank, TrendingUp } from 'lucide-react';

interface Card {
  id: string;
  totalSaved: number;
  dailyAmount: number;
  currency: string;
  totalDays: number;
  daysCovered: number;
  status: string;
  client: { fullName: string } | null;
}

export default function AddDepositPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();

  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [depositDate, setDepositDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [notes, setNotes] = useState('');

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
        setNotes('Mise d\'epargne');
      }
    } catch (err) {
      console.error('Error fetching card:', err);
    }
    setLoading(false);
  };

  const formatCurrency = (amount: number, currency: string = 'CDF') => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!card) return;

    if (card.status !== 'ACTIVE') {
      setError('Cette carte n\'est plus active');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`/api/cards/${card.id}/deposits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: card.dailyAmount,
          depositDate,
          notes: notes || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Erreur lors du depot');
        setSubmitting(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/cards/${id}`);
      }, 1500);
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <TopBar title="Mise d'epargne" showBack />
        <main className="px-container-margin mt-md animate-pulse">
          <div className="h-40 bg-surface-container rounded-xl"></div>
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
        </main>
      </>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background pb-32 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-primary-container mx-auto mb-md flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <p className="font-headline-sm text-on-surface">Mise ajoutee avec succes!</p>
        </div>
      </div>
    );
  }

  const newTotalSaved = card.totalSaved + card.dailyAmount;

  return (
    <>
      <TopBar title="Mise d'epargne" showBack />
      <main className="px-container-margin mt-sm">
        {/* Section Header */}
        <div className="mb-lg">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">
            Ajouter une mise
          </h2>
          <p className="font-body-md text-on-surface-variant">
            Ajoutez des fonds a votre carte d&apos;epargne.
          </p>
        </div>

        {/* Target Savings Card */}
        <div className="bg-inverse-surface text-on-primary rounded-xl p-md mb-lg shadow-card relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container opacity-20 rounded-full blur-3xl -mr-16 -mt-16"></div>

          <div className="flex justify-between items-start mb-md relative z-10">
            <div>
              <p className="font-label-md text-on-surface-variant uppercase tracking-wider mb-1">
                Client
              </p>
              <h3 className="font-headline-sm text-headline-sm text-surface-bright">
                {card.client?.fullName || 'N/A'}
              </h3>
            </div>
            <div className="bg-primary-container/20 p-2 rounded-lg">
              <PiggyBank className="w-5 h-5 text-primary-fixed-dim" />
            </div>
          </div>

          <div className="mb-sm relative z-10">
            <div className="flex justify-between items-end mb-xs">
              <span className="font-display-lg text-display-lg text-surface-bright">
                {formatCurrency(card.totalSaved, card.currency)}
              </span>
              <span className="font-label-md text-primary-fixed-dim mb-2">
                {Math.round((card.daysCovered / card.totalDays) * 100)}% complete
              </span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-fixed-dim transition-all"
                style={{ width: `${(card.daysCovered / card.totalDays) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="flex justify-between text-surface-variant font-label-md relative z-10">
            <span>Objectif: {formatCurrency(card.dailyAmount * card.totalDays, card.currency)}</span>
            <span>
              Restant: {formatCurrency((card.totalDays - card.daysCovered) * card.dailyAmount, card.currency)}
            </span>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-md">
          {/* Amount Display */}
          <div className="text-center py-md">
            <label className="font-label-md text-secondary mb-xs block">Montant a deposer</label>
            <div className="relative inline-block w-full">
              <input
                type="text"
                value={formatCurrency(card.dailyAmount, card.currency)}
                className="w-full bg-transparent border-none text-center font-display-lg text-display-lg text-on-surface focus:ring-0 focus:outline-none"
                readOnly
              />
              <div className="w-32 h-0.5 bg-primary-container mx-auto mt-1"></div>
            </div>
            <p className="mt-base text-secondary font-label-sm">Montant defini lors de la creation</p>
          </div>

          {/* Summary Chips */}
          <div className="grid grid-cols-2 gap-gutter">
            <div className="bg-surface-container-low p-sm rounded-xl border border-outline-variant/30">
              <p className="font-label-sm text-secondary mb-xs">Nouvel Etat</p>
              <p className="font-headline-sm text-headline-sm text-on-surface">
                {formatCurrency(newTotalSaved, card.currency)}
              </p>
            </div>
            <div className="bg-surface-container-low p-sm rounded-xl border border-outline-variant/30">
              <p className="font-label-sm text-secondary mb-xs">Jours restants</p>
              <p className="font-headline-sm text-headline-sm text-on-surface">
                {card.totalDays - card.daysCovered - 1} jours
              </p>
            </div>
          </div>

          {/* Date Selection */}
          <div className="flex items-center justify-between p-sm glass-card rounded-xl">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-secondary" />
              <div>
                <p className="font-label-md text-on-surface">Date du depot</p>
                <p className="font-body-sm text-secondary">
                  {format(new Date(depositDate), 'd MMMM yyyy', { locale: fr })}
                </p>
              </div>
            </div>
            <input
              type="date"
              value={depositDate}
              onChange={(e) => setDepositDate(e.target.value)}
              className="opacity-0 absolute right-0 w-24 cursor-pointer"
            />
            <ChevronRight className="w-5 h-5 text-secondary" />
          </div>

          {/* Notes */}
          <div>
            <label className="font-label-md text-on-surface-variant mb-xs block">
              Note (optionnel)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Mise d'epargne"
              className="w-full h-12 bg-surface-container-lowest border border-outline-variant rounded-xl px-md font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {error && (
            <div className="p-sm bg-error-container/20 border border-error/30 rounded-xl">
              <p className="font-body-sm text-error">{error}</p>
            </div>
          )}

          {/* Confirm Button */}
          <button
            type="submit"
            disabled={submitting || card.status !== 'ACTIVE'}
            className="w-full h-14 cursor-pointer bg-primary-container text-on-primary-container font-bold rounded-xl shadow-lg active:scale-95 transition-all duration-100 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-on-primary-container"></div>
                Traitement...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Confirmer le depot</span>
              </>
            )}
          </button>
        </form>

        {/* Recent Deposits */}
        {/* <section className="mt-xl">
          <h4 className="font-label-md text-secondary uppercase tracking-widest mb-md">
            Derniers depots
          </h4>
          <div className="space-y-sm">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`flex items-center justify-between p-sm bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm ${
                  i > 0 ? 'opacity-70' : ''
                }`}
              >
                <div className="flex items-center gap-sm">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-label-md text-on-surface">Mise d&apos;epargne</p>
                    <p className="font-label-sm text-secondary">Il y a {i} jour(s)</p>
                  </div>
                </div>
                <span className="font-label-md text-primary font-bold">
                  + {formatCurrency(card.dailyAmount, card.currency)}
                </span>
              </div>
            ))}
          </div>
        </section> */}
      </main>
    </>
  );
}
