'use client';

import { useAuth } from '@/components/auth-provider';
import { TopBar } from '@/components/top-bar';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TrendingUp, Send, CreditCard, Receipt, Grid3X3, ShoppingBag, Utensils, Briefcase } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface SavingsCard {
  id: string;
  totalSaved: number;
  dailyAmount: number;
  currency: string;
  totalDays: number;
  daysCovered: number;
  status: string;
  client: { fullName: string } | null;
}

interface Transaction {
  id: string;
  card: {currency: string};
  amount: number;
  currency: string;
  label: string;
  date: Date;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [cardsCDF, setCardsCDF] = useState<SavingsCard[]>([]);
  const [cardsUSD, setCardsUSD] = useState<SavingsCard[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [totalBalanceCDF, setTotalBalanceCDF] = useState(0);
  const [totalBalanceUSD, setTotalBalanceUSD] = useState(0);
  const [monthlyIncomeCDF, setMonthlyIncomeCDF] = useState(0);
  const [monthlyIncomeUSD, setMonthlyIncomeUSD] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch cards
      const cardsRes = await fetch('/api/cards');
      if (cardsRes.ok) {
        const cardsData = await cardsRes.json();
        const activeCardsCDF = cardsData.cards.filter((c: SavingsCard) => c.status === 'ACTIVE').filter((c: SavingsCard) => c.currency === 'CDF');
        setCardsCDF(activeCardsCDF.slice(0, 5));
        const activeCardsUSD = cardsData.cards.filter((c: SavingsCard) => c.status === 'ACTIVE').filter((c: SavingsCard) => c.currency === 'USD');
        setCardsCDF(activeCardsUSD.slice(0, 5));

        // Calculate totals
        const totalCDF = activeCardsCDF.reduce((sum: number, card: SavingsCard) => sum + card.totalSaved, 0);
        setTotalBalanceCDF(totalCDF);
        const totalUSD = activeCardsUSD.reduce((sum: number, card: SavingsCard) => sum + card.totalSaved, 0);
        setTotalBalanceUSD(totalUSD);
      }

      // Fetch deposits
      const depositsRes = await fetch('/api/deposits');
      if (depositsRes.ok) {
        const depositsData = await depositsRes.json();

        // Calculate monthly income
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const monthlyDepositsCDF = depositsData.deposits
        .filter((d: { createdAt: string }) =>
          new Date(d.createdAt) >= startOfMonth
        )
        .filter((d: { card: SavingsCard }) => d.card.currency == 'CDF');
        const monthlyTotalCDF = monthlyDepositsCDF.reduce((sum: number, d: { amount: number }) => sum + d.amount, 0);
        setMonthlyIncomeCDF(monthlyTotalCDF);

        const monthlyDepositsUSD = depositsData.deposits
        .filter((d: { createdAt: string }) =>
          new Date(d.createdAt) >= startOfMonth
        )
        .filter((d: { card: SavingsCard }) => d.card.currency == 'USD');
        const monthlyTotalUSD = monthlyDepositsUSD.reduce((sum: number, d: { amount: number }) => sum + d.amount, 0);
        setMonthlyIncomeUSD(monthlyTotalUSD);

        // Recent transactions
        const transactions: Transaction[] = depositsData.deposits.slice(0, 3).map((d: { id: string; amount: number; notes: string | null; createdAt: string; card: { name: string, currency: string } }) => ({
          id: d.id,
          amount: d.amount,
          currency: d.card.currency,
          label: d.notes || 'Mise d\'epargne',
          date: new Date(d.createdAt),
        }));
        setRecentTransactions(transactions);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const quickActions = [
    { icon: Send, label: 'Envoyer', href: '#' },
    { icon: CreditCard, label: 'Epargne', href: '/cards' },
    { icon: Receipt, label: 'Factures', href: '#' },
    { icon: Grid3X3, label: 'Plus', href: '#' },
  ];

  const transactionIcon = (type: string, label: string) => {
    if (label.toLowerCase().includes('salaire')) return Briefcase;
    if (label.toLowerCase().includes('restaurant') || label.toLowerCase().includes('bistro')) return Utensils;
    if (label.toLowerCase().includes('apple') || label.toLowerCase().includes('shop')) return ShoppingBag;
    return TrendingUp;
  };

  return (
    <div className="px-container-margin mt-md space-y-lg">
      {/* Total Balance Card */}
      <section className="relative overflow-hidden bg-inverse-surface rounded-xl p-md text-white shadow-card h-52 flex flex-col justify-between">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container rounded-full -mr-16 -mt-16 blur-2xl"></div>
        </div>
        <div className="z-10">
          <p className="font-label-md text-label-md text-outline-variant">Solde Total</p>
          <h2 className="font-display-lg text-display-lg font-bold mt-xs">
            {formatCurrency(totalBalanceCDF, 'CDF')}
          </h2>
        </div>
        <div className="z-10 flex justify-between items-end">
          <div className="flex gap-xs">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-outline-variant">
                Revenus ce mois
              </span>
              <span className="font-body-md text-body-md font-semibold text-primary-container">
                + {formatCurrency(monthlyIncomeCDF, 'CDF')}
              </span>
            </div>
          </div>
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center border-2 border-inverse-surface">
              <TrendingUp className="w-4 h-4 text-inverse-surface" />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h3 className="font-headline-sm text-headline-sm mb-md">Actions Rapides</h3>
        <div className="grid grid-cols-4 gap-gutter">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                className="flex flex-col items-center gap-xs group cursor-pointer"
              >
                <div className="w-14 h-14 bg-surface-container rounded-xl flex items-center justify-center group-active:scale-95 transition-transform">
                  <Icon className="w-6 h-6 text-on-surface" />
                </div>
                <span className="font-label-sm text-label-sm text-on-surface text-center">
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Active Cards */}
      <section>
        <div className="flex justify-between items-center mb-md">
          <h3 className="font-headline-sm text-headline-sm">Cartes Actives</h3>
          <Link href="/cards" className="text-primary font-label-md text-label-md">
            Tout voir
          </Link>
        </div>
        <div className="flex gap-md overflow-x-auto hide-scrollbar -mx-container-margin px-container-margin pb-base">
          {loading && (
            <>
              {[1, 2].map((i) => (
                <div key={i} className="min-w-50 bg-surface-container p-md rounded-xl animate-pulse">
                  <div className="h-10 w-10 rounded-full bg-surface-container-highest mb-sm"></div>
                  <div className="h-4 w-20 bg-surface-container-highest rounded mb-xs"></div>
                  <div className="h-6 w-24 bg-surface-container-highest rounded mb-xs"></div>
                  <div className="h-1.5 w-full bg-surface-container-highest rounded-full"></div>
                </div>
              ))}
            </>
          )} 

          {
            cardsCDF.length === 0 && cardsCDF.length === 0 && (
            <div className="min-w-full bg-surface-container-lowest p-md rounded-xl border border-outline-variant/30 text-center">
              <p className="font-body-md text-secondary">Aucune carte active</p>
            </div>
          )}

          {cardsCDF.length !== 0 &&  (
              cardsCDF.map((card) => {
                const progress = card.totalDays > 0 ? (card.daysCovered / card.totalDays) * 100 : 0;
                const target = card.dailyAmount * card.totalDays;
                return (
                  <Link
                    key={card.id}
                    href={`/cards/${card.id}`}
                    className="min-w-50 bg-surface-container-lowest p-md rounded-xl shadow-ambient border border-surface-container hover:bg-surface-container-low transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center mb-sm">
                      <CreditCard className="w-5 h-5 text-primary" />
                    </div>
                    <p className="font-label-md text-label-md text-on-surface-variant truncate">
                      {card.client?.fullName || 'Client'}
                    </p>
                    <p className="font-headline-sm text-headline-sm font-bold mb-xs">
                      {formatCurrency(card.totalSaved, card.currency)}{' '}
                      <span className="text-xs text-on-surface-variant font-normal">
                        / {formatCurrency(target, card.currency)}
                      </span>
                    </p>
                    <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full transition-all"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                  </Link>
                );
              })
          )}

          {cardsUSD.length !== 0 && (
            cardsUSD.map((card) => {
              const progress = card.totalDays > 0 ? (card.daysCovered / card.totalDays) * 100 : 0;
              const target = card.dailyAmount * card.totalDays;
              return (
                <Link
                  key={card.id}
                  href={`/cards/${card.id}`}
                  className="min-w-50 bg-surface-container-lowest p-md rounded-xl shadow-ambient border border-surface-container hover:bg-surface-container-low transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center mb-sm">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <p className="font-label-md text-label-md text-on-surface-variant truncate">
                    {card.client?.fullName || 'Client'}
                  </p>
                  <p className="font-headline-sm text-headline-sm font-bold mb-xs">
                    {formatCurrency(card.totalSaved, card.currency)}{' '}
                    <span className="text-xs text-on-surface-variant font-normal">
                      / {formatCurrency(target, card.currency)}
                    </span>
                  </p>
                  <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </section>

      {/* Recent Transactions */}
      <section className="space-y-sm">
        <div className="flex justify-between items-center">
          <h3 className="font-headline-sm text-headline-sm">Recent</h3>
          <Link href="/history" className="text-primary font-label-md text-label-md">
            Voir l&apos;historique
          </Link>
        </div>
        <div className="space-y-xs">
          {loading ? (
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-sm bg-surface-container-lowest rounded-xl animate-pulse">
                  <div className="flex items-center gap-sm">
                    <div className="w-12 h-12 bg-surface-container rounded-full"></div>
                    <div>
                      <div className="h-4 w-24 bg-surface-container rounded mb-xs"></div>
                      <div className="h-3 w-16 bg-surface-container rounded"></div>
                    </div>
                  </div>
                  <div className="h-4 w-16 bg-surface-container rounded"></div>
                </div>
              ))}
            </>
          ) : recentTransactions.length === 0 ? (
            <div className="p-md bg-surface-container-lowest rounded-xl text-center">
              <p className="font-body-md text-secondary">Aucune transaction recente</p>
            </div>
          ) : (
            recentTransactions.map((tx) => {
              const Icon = transactionIcon('deposit', tx.label);
              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-sm bg-surface-container-lowest rounded-xl border border-surface-container hover:bg-surface-container-low transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-sm">
                    <div className="w-12 h-12 bg-surface-container-low rounded-full flex items-center justify-center">
                      <Icon className="w-5 h-5 text-on-surface-variant" />
                    </div>
                    <div>
                      <p className="font-body-md text-body-md font-semibold text-on-surface">
                        {tx.label}
                      </p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">
                        {format(tx.date, "'Aujourd hui,' HH:mm", { locale: fr })}
                      </p>
                    </div>
                  </div>
                  <p className="font-body-md text-body-md font-bold text-primary">
                    + {tx.amount} {tx.currency}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
