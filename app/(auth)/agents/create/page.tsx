'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { TopBar } from '@/components/top-bar';
import { Info, CheckCircle } from 'lucide-react';
import type { Role } from '@prisma/client';

export default function AgentCreatePage() {
  const { user, signUp } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('AGENT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (user && user.role !== 'ADMIN') {
    return (
      <>
        <TopBar title="Nouvel agent" showBack />
        <main className="px-container-margin mt-md text-center py-xl">
          <p className="font-body-md text-secondary">
            Seuls les administrateurs peuvent creer des agents.
          </p>
        </main>
      </>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: signUpError } = await signUp(email, password, fullName, role, user?.id);

      if (signUpError) {
        setError(signUpError);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push('/agents');
        }, 1500);
      }
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background pb-32 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-primary-container mx-auto mb-md flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <p className="font-headline-sm text-on-surface">Agent cree avec succes!</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <TopBar title="Nouvel agent" showBack />
      <main className="px-container-margin mt-md">
        <div className="mb-lg">
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">
            Creer un agent
          </h1>
          <p className="font-body-md text-on-surface-variant">
            Ajoutez un nouvel agent ou administrateur.
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
              Email *
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-14 bg-surface-container-lowest border border-outline-variant rounded-xl px-md font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="jean@example.com"
              required
            />
          </div>

          <div>
            <label className="font-label-md text-on-surface mb-xs block" htmlFor="password">
              Mot de passe *
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-14 bg-surface-container-lowest border border-outline-variant rounded-xl px-md font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Minimum 6 caracteres"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="font-label-md text-on-surface mb-xs block">Role</label>
            <div className="grid grid-cols-2 gap-sm">
              <button
                type="button"
                onClick={() => setRole('AGENT')}
                className={`h-14 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${
                  role === 'AGENT'
                    ? 'border-primary bg-primary-container/20'
                    : 'border-outline-variant bg-surface-container-lowest'
                }`}
              >
                <span className="material-symbols-outlined">person</span>
                <span className="font-body-md">Agent</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('ADMIN')}
                className={`h-14 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${
                  role === 'ADMIN'
                    ? 'border-primary bg-primary-container/20'
                    : 'border-outline-variant bg-surface-container-lowest'
                }`}
              >
                <span className="material-symbols-outlined">shield</span>
                <span className="font-body-md">Admin</span>
              </button>
            </div>
            <div className="mt-xs flex items-start gap-sm p-sm bg-surface-container-low rounded-xl">
              <Info className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
              <p className="font-label-sm text-secondary">
                Les administrateurs peuvent gerer les agents et voir toutes les donnees. Les agents
                ne peuvent voir que leurs propres clients et cartes.
              </p>
            </div>
          </div>

          {error && (
            <div className="p-sm bg-error-container/20 border border-error/30 rounded-xl">
              <p className="font-body-sm text-error">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !fullName.trim() || !email || password.length < 6}
            className="w-full h-14 bg-primary-container text-on-primary-container font-headline-sm text-headline-sm rounded-full shadow-primary hover:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-on-primary-container"></div>
                Creation...
              </span>
            ) : (
              'Creer le compte'
            )}
          </button>
        </form>
      </main>
    </>
  );
}
