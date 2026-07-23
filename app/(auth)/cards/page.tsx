'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { TopBar } from '@/components/top-bar';
import { BottomNav } from '@/components/bottom-nav';
import { Plus, Search, CreditCard } from 'lucide-react';
import Link from 'next/link';

interface Card {
  id: string;
  name: string;
  totalSaved: number;
  dailyAmount: number;
  currency: string;
  totalDays: number;
  daysCovered: number;
  status: string;
  client: { fullName: string } | null;
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
  WITHDRAWAL_REQUESTED: 'bg-error-container text-on-error-container',
  WITHDRAWN: 'bg-surface-container-high text-secondary',
};

export default function CardsPage() {
  const { user } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);
  const [filteredCards, setFilteredCards] = useState<Card[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCards();
    }
  }, [user]);

  useEffect(() => {
    let filtered = cards;

    if (statusFilter !== 'all') {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    if (search.trim() !== '') {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.client?.fullName?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredCards(filtered);
  }, [search, statusFilter, cards]);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cards');
      if (res.ok) {
        const data = await res.json();
        setCards(data.cards);
        setFilteredCards(data.cards);
      }
    } catch (err) {
      console.error('Error fetching cards:', err);
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

  return (
    <>
      <TopBar title="Cartes d'epargne" />
      <main className="px-container-margin mt-md space-y-md">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-md top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une carte..."
            className="w-full h-12 bg-surface-container-lowest border border-outline-variant rounded-xl pl-12 pr-md font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Status Filter */}
        <div className="flex gap-xs overflow-x-auto hide-scrollbar pb-sm">
          {[
            { value: 'all', label: 'Tous' },
            { value: 'ACTIVE', label: 'Actifs' },
            { value: 'COMPLETED', label: 'Completes' },
            { value: 'WITHDRAWAL_REQUESTED', label: 'Retraits' },
            { value: 'WITHDRAWN', label: 'Retires' },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`px-md py-sm rounded-full font-label-md whitespace-nowrap transition-colors ${
                statusFilter === filter.value
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-surface-container text-secondary hover:bg-surface-container-high'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Add Button */}
        {user?.role !== 'CLIENT' && (<Link
          href="/cards/create"
          className="flex items-center justify-center gap-2 w-full h-12 bg-primary-container text-on-primary-container font-label-md rounded-xl hover:bg-primary-fixed transition-colors"
        >
          <Plus className="w-5 h-5" />
          Creer une carte
        </Link>)}

        {/* Card List */}
        <div className="space-y-sm">
          {loading ? (
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-surface-container-lowest rounded-xl p-md">
                  <div className="flex justify-between mb-sm">
                    <div className="h-4 w-20 bg-surface-container-high rounded"></div>
                    <div className="h-4 w-12 bg-surface-container-high rounded"></div>
                  </div>
                  <div className="h-6 w-32 bg-surface-container-high rounded mb-sm"></div>
                  <div className="h-2 w-full bg-surface-container-high rounded-full"></div>
                </div>
              ))}
            </>
          ) : filteredCards.length === 0 ? (
            <div className="text-center py-xl">
              <CreditCard className="w-12 h-12 text-secondary mx-auto mb-sm" />
              <p className="font-body-md text-secondary">
                {search || statusFilter !== 'all' ? 'Aucune carte trouvee' : 'Aucune carte'}
              </p>
              <Link
                href="/cards/create"
                className="inline-block mt-sm text-primary font-label-md"
              >
                Creer une carte
              </Link>
            </div>
          ) : (
            filteredCards.map((card) => {
              const progress = card.totalDays > 0 ? (card.daysCovered / card.totalDays) * 100 : 0;
              const target = card.dailyAmount * card.totalDays;
              return (
                <Link
                  key={card.id}
                  href={`/cards/${card.id}`}
                  className="block bg-surface-container-lowest rounded-xl p-md border border-surface-container hover:shadow-ambient transition-all"
                >
                  <div className="flex justify-between items-start mb-xs">
                    <div>
                      <p className="font-label-sm text-secondary">
                        {card.client?.fullName || 'Client inconnu'}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full font-label-sm text-[10px] ${
                        statusColors[card.status] || ''
                      }`}
                    >
                      {statusLabels[card.status]}
                    </span>
                  </div>
                  <p className="font-headline-sm text-headline-sm font-bold text-on-surface mb-sm">
                    {formatCurrency(card.totalSaved, card.currency)}{' '}
                    <span className="text-sm text-secondary font-normal">
                      / {formatCurrency(target, card.currency)}
                    </span>
                  </p>
                  <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        card.status === 'ACTIVE' ? 'bg-primary' : 'bg-secondary'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-xs">
                    <span className="font-label-sm text-secondary">
                      {card.daysCovered} / {card.totalDays} jours
                    </span>
                    <span className="font-label-sm text-secondary">
                      {Math.round(progress)}%
                    </span>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </main>
    </>
  );
}
