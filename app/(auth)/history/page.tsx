'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { TopBar } from '@/components/top-bar';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import { format, subDays, isWithinInterval } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Deposit {
  id: string;
  amount: number;
  createdAt: string;
  card: {
    currency: string;
    client: { fullName: string } | null;
  } | null;
}

type DateFilter = 'today' | 'week' | 'month' | 'year' | 'all';

export default function HistoryPage() {
  const { user } = useAuth();
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [filteredDeposits, setFilteredDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<DateFilter>('month');
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchDeposits();
    }
  }, [user]);

  useEffect(() => {
    filterDeposits();
  }, [deposits, dateFilter]);

  const fetchDeposits = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/deposits');
      if (res.ok) {
        const data = await res.json();
        setDeposits(data.deposits);
      }
    } catch (err) {
      console.error('Error fetching deposits:', err);
    }
    setLoading(false);
  };

  const filterDeposits = () => {
    const now = new Date();
    const result: Deposit[] = [];

    deposits.forEach((d) => {
      const depositDate = new Date(d.createdAt);
      let matches = false;

      switch (dateFilter) {
        case 'today':
          matches = depositDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = subDays(now, 7);
          matches = isWithinInterval(depositDate, { start: weekAgo, end: now });
          break;
        case 'month':
          const monthAgo = subDays(now, 30);
          matches = isWithinInterval(depositDate, { start: monthAgo, end: now });
          break;
        case 'year':
          const yearAgo = subDays(now, 365);
          matches = isWithinInterval(depositDate, { start: yearAgo, end: now });
          break;
        default:
          matches = true;
      }

      if (matches) {
        result.push(d);
      }
    });

    setFilteredDeposits(result);

    const total = result.reduce((sum, d) => sum + d.amount, 0);
    setTotalAmount(total);
  };

  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const dateFilters: { value: DateFilter; label: string }[] = [
    { value: 'today', label: 'Aujourd\'hui' },
    { value: 'week', label: '7 jours' },
    { value: 'month', label: '30 jours' },
    { value: 'year', label: '1 an' },
    { value: 'all', label: 'Tout' },
  ];

  return (
    <>
      <TopBar title="Historique" />
      <main className="px-container-margin mt-md space-y-md">
        {/* Summary Card */}
        <div className="bg-inverse-surface rounded-xl p-md text-white shadow-card">
          <p className="font-label-md text-on-surface-variant mb-xs">Total selectionne</p>
          <h2 className="font-display-lg text-surface-bright">
            {formatCurrency(totalAmount)}
          </h2>
          <p className="font-label-sm text-on-surface-variant mt-sm">
            {filteredDeposits.length} transaction(s)
          </p>
        </div>

        {/* Date Filters */}
        <div className="flex gap-xs overflow-x-auto hide-scrollbar pb-sm">
          {dateFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setDateFilter(filter.value)}
              className={`px-md py-sm rounded-full font-label-md whitespace-nowrap transition-colors ${
                dateFilter === filter.value
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-surface-container text-secondary hover:bg-surface-container-high'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Transactions List */}
        <div className="space-y-sm">
          {loading ? (
            <>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse flex items-center justify-between p-sm bg-surface-container-lowest rounded-xl">
                  <div className="flex items-center gap-sm">
                    <div className="w-12 h-12 rounded-full bg-surface-container-high"></div>
                    <div>
                      <div className="h-4 w-24 bg-surface-container-high rounded mb-xs"></div>
                      <div className="h-3 w-16 bg-surface-container-high rounded"></div>
                    </div>
                  </div>
                  <div className="h-5 w-20 bg-surface-container-high rounded"></div>
                </div>
              ))}
            </>
          ) : filteredDeposits.length === 0 ? (
            <div className="text-center py-xl">
              <TrendingUp className="w-12 h-12 text-secondary mx-auto mb-sm" />
              <p className="font-body-md text-secondary">Aucune transaction trouvee</p>
            </div>
          ) : (
            filteredDeposits.map((deposit) => {
              const currency = deposit.card?.currency || 'EUR';
              return (
                <div
                  key={deposit.id}
                  className="flex items-center justify-between p-sm bg-surface-container-lowest rounded-xl border border-surface-container hover:shadow-ambient transition-shadow"
                >
                  <div className="flex items-center gap-sm">
                    <div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center">
                      <ArrowUpRight className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-body-md text-body-md font-semibold text-on-surface">
                        {deposit.card?.client?.fullName || 'N/A'}
                      </p>
                      <p className="font-label-sm text-label-sm text-secondary">
                        {format(new Date(deposit.createdAt), 'd MMM yyyy, HH:mm', { locale: fr })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-body-md text-body-md font-bold text-primary">
                      + {formatCurrency(deposit.amount, currency)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </>
  );
}
