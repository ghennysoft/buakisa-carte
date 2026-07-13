'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Logo from '@/app/logo.jpg';
import Image from 'next/image';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) setError(error);
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          setError(error);
        } else {
          setError('Compte cree avec succes! Connectez-vous.');
          setIsLogin(true);
        }
      }
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-135 mx-auto">
      {/* Header */}
      {/* <header className="flex items-center px-container-margin py-md">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-on-surface" />
        </button>
      </header> */}

      {/* Content */}
      <main className="flex-1 px-container-margin">
        <div className="mb-lg">
          <div className="flex py-3">
            <Image src={Logo} alt='Logo BCarte' width={170} height={170} />
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2 text-2xl mt-5 font-bold">
            {isLogin ? 'Connexion' : 'Creer un compte'}
          </h1>
          <p className="font-body-md text-on-surface-variant">
            {isLogin
              ? 'Connectez-vous pour acceder a votre espace'
              : 'Rejoignez Finans pour gerer votre epargne'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-md">
          {!isLogin && (
            <div>
              <label className="font-label-md text-on-surface mb-xs block" htmlFor="fullName">
                Nom complet
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-14 bg-surface-container-lowest border border-outline-variant rounded-xl px-md font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Votre nom complet"
                required={!isLogin}
              />
            </div>
          )}

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
              placeholder="votre@email.com"
              required
            />
          </div>

          <div>
            <label className="font-label-md text-on-surface mb-xs block" htmlFor="password">
              Mot de passe
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 bg-surface-container-lowest border border-outline-variant rounded-xl px-md pr-12 font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="********"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-md top-1/2 -translate-y-1/2 text-secondary hover:text-on-surface"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-sm bg-error-container/20 border border-error/30 rounded-xl">
              <p className="font-body-sm text-error">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-primary-container text-on-primary-container font-headline-sm text-headline-sm rounded-full shadow-primary hover:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-on-primary-container"></div>
            ) : isLogin ? (
              'Se connecter'
            ) : (
              'Creer le compte'
            )}
          </button>
        </form>

        {/* <div className="mt-lg text-center">
          <p className="font-body-md text-secondary">
            {isLogin ? "Pas encore de compte ?" : 'Deja un compte ?'}{' '}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="text-primary font-semibold hover:underline"
            >
              {isLogin ? 'Creer un compte' : 'Se connecter'}
            </button>
          </p>
        </div> */}
      </main>
    </div>
  );
}
