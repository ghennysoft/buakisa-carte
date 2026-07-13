'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { TopBar } from '@/components/top-bar';
import { User, DollarSign, Plus, Minus, ChevronRight } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Client {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
}

const currencies = [
  { code: 'CDF', symbol: 'FC', name: 'Franc Congolais' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
];

export default function CardCreatePage() {
  const { user } = useAuth();
  const router = useRouter();

  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showClientPicker, setShowClientPicker] = useState(false);
  const [clientSearch, setClientSearch] = useState('');

  const [dailyAmount, setDailyAmount] = useState('');
  const [currency, setCurrency] = useState('EUR');
  const [totalDays, setTotalDays] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchClients();
    }
  }, [user]);

  const fetchClients = async () => {
    try {
      const res = await fetch('/api/clients');
      const data = await res.json();
      console.log('Fetch clients response:', data);
      if (res.ok) {
        setClients(data.clients);
      }
    } catch (err) {
      console.error('Error fetching clients:', err);
    }
  };

  const filteredClients = clientSearch.trim()
    ? clients.filter((c) =>
        c.fullName.toLowerCase().includes(clientSearch.toLowerCase())
      )
    : clients;

  const amount = parseFloat(dailyAmount) || 0;
  const totalProjected = amount * totalDays;
  const endDate = addDays(new Date(), totalDays);

  const currencySymbol = currencies.find((c) => c.code === currency)?.symbol || 'FC';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedClient) {
      setError('Veuillez selectionner un client');
      return;
    }

    if (amount <= 0) {
      setError('Le montant quotidien doit etre superieur a 0');
      return;
    }

    if (totalDays <= 0) {
      setError('Le nombre de jours doit etre superieur a 0');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: selectedClient.id,
          name: `Epargne ${selectedClient.fullName}`,
          dailyAmount: amount,
          currency,
          totalDays,
        }),
      });

      console.log('Card creation response:', await res.json());
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Erreur lors de la creation');
      } else {
        router.push('/cards');
      }
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TopBar title="Creer une carte" showBack />
      <main className="px-container-margin mt-md">
        {/* Client Selection */}
        <div>
          <p className="font-label-md text-on-surface-variant mb-xs">Selection du client</p>
          <button
            type="button"
            onClick={() => setShowClientPicker(true)}
            className="w-full bg-surface-container-lowest rounded-xl p-sm flex items-center justify-between shadow-ambient border border-transparent hover:border-outline-variant/30 transition-colors"
          >
            <div className="flex items-center gap-sm">
              <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center">
                <User className="w-5 h-5 text-on-surface-variant" />
              </div>
              <div className="text-left">
                <p className="font-body-md text-body-md text-on-surface">
                  {selectedClient ? selectedClient.fullName : 'Selectionner un client'}
                </p>
                {selectedClient && (
                  <p className="font-label-sm text-label-sm text-secondary">
                    {selectedClient.email || selectedClient.phone || 'Aucun contact'}
                  </p>
                )}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>

        {/* Amount Input */}
        <div className="mt-lg">
          <p className="font-label-md text-on-surface-variant mb-xs">Mise Quotidienne</p>
          <div className="flex items-center justify-center py-md">
            <span className="font-headline-lg text-headline-lg text-on-surface-variant mr-2">
              {currencySymbol}
            </span>
            <input
              type="number"
              value={dailyAmount}
              onChange={(e) => setDailyAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-transparent border-none text-center font-display-lg text-display-lg text-on-surface focus:ring-0 focus:outline-none placeholder-surface-container-highest caret-primary-fixed-dim"
              style={{ fontSize: '40px', lineHeight: '48px', fontWeight: 600 }}
            />
            <div className="w-px h-10 bg-on-surface animate-pulse ml-2"></div>
          </div>
        </div>

        {/* Configuration Card */}
        <div className="bg-surface-container-lowest rounded-xl p-md shadow-ambient space-y-md">
          {/* Currency */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-sm">
              <DollarSign className="w-5 h-5 text-secondary" />
              <div>
                <p className="font-label-md text-label-md text-on-surface font-semibold">
                  {currencies.find((c) => c.code === currency)?.name}
                </p>
                <p className="font-label-sm text-label-sm text-secondary">Devise de la carte</p>
              </div>
            </div>
            <div className="flex gap-xs">
              {currencies.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => setCurrency(c.code)}
                  className={`px-3 py-1 rounded-full font-label-sm transition-colors ${
                    currency === c.code
                      ? 'bg-primary-container text-on-primary-container'
                      : 'bg-surface-container-high text-secondary hover:bg-surface-container'
                  }`}
                >
                  {c.symbol}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-outline-variant/30" />

          {/* Duration */}
          <div>
            <div className="flex items-center justify-between mb-sm">
              <div>
                <p className="font-label-md text-label-md text-on-surface font-semibold">
                  Duree d&apos;epargne
                </p>
                <p className="font-label-sm text-label-sm text-secondary">Nombre de jours</p>
              </div>
              <div className="flex items-center bg-surface-container-low rounded-lg border border-outline-variant/50">
                <button
                  type="button"
                  onClick={() => setTotalDays(Math.max(1, totalDays - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-surface-container-highest text-on-surface-variant"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <input
                  type="number"
                  value={totalDays}
                  onChange={(e) => setTotalDays(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center bg-transparent border-none p-0 font-body-md text-body-md font-semibold text-on-surface focus:ring-0"
                />
                <button
                  type="button"
                  onClick={() => setTotalDays(totalDays + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-surface-container-highest text-on-surface-variant"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-md px-sm space-y-xs">
          <div className="flex justify-between items-center">
            <p className="font-label-md text-label-md text-on-surface-variant">Total projete</p>
            <p className="font-label-md text-label-md font-semibold text-on-surface">
              {currencySymbol}
              {totalProjected.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <p className="font-label-md text-label-md text-on-surface-variant">Date de fin</p>
            <p className="font-label-md text-label-md font-semibold text-on-surface">
              {format(endDate, 'd MMM yyyy', { locale: fr })}
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-md p-sm bg-error-container/20 border border-error/30 rounded-xl">
            <p className="font-body-sm text-error">{error}</p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || !selectedClient || amount <= 0}
          className="w-full mt-lg h-14 bg-primary-container text-on-primary-container font-headline-sm text-headline-sm rounded-full shadow-primary hover:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-on-primary-container"></div>
              Creation...
            </>
          ) : (
            'Creer la carte'
          )}
        </button>
      </main>

      {/* Client Picker Modal */}
      {showClientPicker && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center">
          <div className="w-full max-w-135 bg-surface-container-lowest rounded-t-3xl max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-md border-b border-outline-variant/30">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Selectionner un client
              </h3>
              <button
                onClick={() => setShowClientPicker(false)}
                className="text-secondary hover:text-on-surface"
              >
                Fermer
              </button>
            </div>
            <div className="p-sm">
              <div className="relative">
                <input
                  type="text"
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full h-10 bg-surface-container border border-outline-variant rounded-lg px-md font-body-md text-on-surface"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-sm pb-md">
              {filteredClients.length === 0 ? (
                <p className="text-center text-secondary py-md">Aucun client trouve</p>
              ) : (
                filteredClients.map((client) => (
                  <button
                    key={client.id}
                    type="button"
                    onClick={() => {
                      setSelectedClient(client);
                      setShowClientPicker(false);
                    }}
                    className="w-full flex items-center gap-sm p-sm rounded-xl hover:bg-surface-container transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center">
                      <span className="text-primary font-headline-sm">
                        {client.fullName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="text-left">
                      <p className="font-body-md text-on-surface">{client.fullName}</p>
                      <p className="font-label-sm text-secondary">
                        {client.email || client.phone || 'Aucun contact'}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
