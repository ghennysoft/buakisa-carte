'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, CreditCard, PlusCircle, BarChart3, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: Home, label: 'Accueil' },
  { href: '/cards', icon: CreditCard, label: 'Cartes' },
  { href: '/cards/create', icon: PlusCircle, label: 'Ajouter', isFAB: true },
  { href: '/history', icon: BarChart3, label: 'Historique' },
  { href: '/settings', icon: Settings, label: 'Parametres' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-4 py-2 pb-6 bg-surface-container-lowest shadow-lg border-t border-outline-variant">
      {navItems.map((item) => {
        const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
        const Icon = item.icon;

        if (item.isFAB) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center text-primary"
            >
              <div className="w-12 h-12 bg-primary-container rounded-full flex items-center justify-center shadow-primary -mt-8">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <span className="font-label-sm text-label-sm mt-1 invisible">{item.label}</span>
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center transition-all px-2 py-1',
              isActive
                ? 'text-primary bg-primary-container/10 rounded-full'
                : 'text-secondary hover:bg-surface-container-high'
            )}
          >
            <Icon className="w-6 h-6" />
            <span className="font-label-sm text-label-sm">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
