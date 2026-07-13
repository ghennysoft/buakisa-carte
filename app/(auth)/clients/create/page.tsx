'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { TopBar } from '@/components/top-bar';

export default function ClientCreatePage() {
  const { user } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email: email || null,
          phone: phone || null,
          address: address || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Erreur lors de la creation');
      } else {
        router.push('/clients');
      }
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TopBar title="Nouveau client" showBack />
      <main className="px-container-margin mt-md">
        <div className="mb-lg">
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">
            Creer un client
          </h1>
          <p className="font-body-md text-on-surface-variant">
            Ajoutez un nouveau client pour lui creer des cartes d&apos;epargne.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-md">
          <div>
            <label className="font-label-md text-on-surface mb-xs block" htmlFor="fullName">
              Nom complet *
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full h-14 bg-surface-container-lowest border border-outline-variant rounded-xl px-md font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Jean Dupont"
              required
            />
          </div>

          <div>
            <label className="font-label-md text-on-surface mb-xs block" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-14 bg-surface-container-lowest border border-outline-variant rounded-xl px-md font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="jean@example.com"
            />
          </div>

          <div>
            <label className="font-label-md text-on-surface mb-xs block" htmlFor="phone">
              Telephone
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-14 bg-surface-container-lowest border border-outline-variant rounded-xl px-md font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="+33 6 12 34 56 78"
            />
          </div>

          <div>
            <label className="font-label-md text-on-surface mb-xs block" htmlFor="address">
              Adresse
            </label>
            <textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-md py-sm font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Adresse du client"
            />
          </div>

          {error && (
            <div className="p-sm bg-error-container/20 border border-error/30 rounded-xl">
              <p className="font-body-sm text-error">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !fullName.trim()}
            className="w-full h-14 bg-primary-container text-on-primary-container font-headline-sm text-headline-sm rounded-full shadow-primary hover:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-on-primary-container"></div>
                Creation...
              </span>
            ) : (
              'Creer le client'
            )}
          </button>
        </form>
      </main>
    </>
  );
}
