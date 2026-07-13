'use client';

import { TopBar } from '@/components/top-bar';
import { BottomNav } from '@/components/bottom-nav';
import { Shield, Heart, Smartphone } from 'lucide-react';

export default function AboutPage() {
  return (
    <>
      <TopBar title="A propos" showBack />
      <main className="px-container-margin mt-md">
        {/* Logo Section */}
        <div className="text-center py-xl">
          <div className="w-20 h-20 rounded-2xl bg-primary-container mx-auto mb-md flex items-center justify-center">
            <span className="text-primary font-display-lg text-display-lg">F</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Finans</h1>
          <p className="font-body-md text-secondary">Application d&apos;epargne</p>
          <p className="font-label-sm text-secondary mt-xs">Version 1.0.0</p>
        </div>

        {/* Features */}
        <section className="space-y-sm mb-lg">
          <h2 className="font-headline-sm text-on-surface mb-md">Fonctionnalites</h2>

          <div className="bg-surface-container-lowest rounded-xl p-md shadow-ambient flex items-start gap-md">
            <div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-body-md font-semibold text-on-surface">Securite</h3>
              <p className="font-body-sm text-secondary mt-xs">
                Vos donnees sont protegees par des protocoles de securite avances.
              </p>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-md shadow-ambient flex items-start gap-md">
            <div className="w-12 h-12 rounded-full bg-secondary-container/50 flex items-center justify-center flex-shrink-0">
              <Heart className="w-6 h-6 text-error" />
            </div>
            <div>
              <h3 className="font-body-md font-semibold text-on-surface">Epargne intelligente</h3>
              <p className="font-body-sm text-secondary mt-xs">
                Definissez vos objectifs d&apos;epargne et suivez votre progression jour apres jour.
              </p>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-md shadow-ambient flex items-start gap-md">
            <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h3 className="font-body-md font-semibold text-on-surface">Multi-plateforme</h3>
              <p className="font-body-sm text-secondary mt-xs">
                Accedez a votre epargne depuis n&apos;importe quel appareil.
              </p>
            </div>
          </div>
        </section>

        {/* Description */}
        <section className="bg-surface-container-low rounded-xl p-md mb-lg">
          <h2 className="font-headline-sm text-on-surface mb-sm">Notre mission</h2>
          <p className="font-body-md text-secondary leading-relaxed">
            Finans vous aide a atteindre vos objectifs financiers grace a une approche simple et
            structuree de l&apos;epargne. Creez des cartes d&apos;epargne personnalisees, suivez
            vos depots quotidiens et atteignez vos objectifs finance par finance.
          </p>
        </section>

        {/* Footer */}
        <footer className="text-center text-secondary font-label-sm pb-xl">
          <p>© 2024 Finans. Tous droits reserves.</p>
        </footer>
      </main>
    </>
  );
}
