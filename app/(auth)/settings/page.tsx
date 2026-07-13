'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { TopBar } from '@/components/top-bar';
import {
  User,
  Shield,
  Users,
  CreditCard,
  LogOut,
  ChevronRight,
  Info,
  Bell,
  Globe,
} from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await signOut();
  };

  const menuItems = [
    {
      section: 'Compte',
      items: [
        {
          icon: User,
          label: 'Mon profil',
          description: user?.email || 'email@example.com',
          href: '#',
        },
        {
          icon: Users,
          label: 'Clients',
          description: 'Gerer vos clients',
          href: '/clients',
        },
        {
          icon: CreditCard,
          label: 'Cartes',
          description: 'Voir les cartes d\'epargne',
          href: '/cards',
        },
      ],
    },
    ...(user?.role === 'ADMIN'
      ? [
          {
            section: 'Administration',
            items: [
              {
                icon: Shield,
                label: 'Agents',
                description: 'Gerer les agents et admins',
                href: '/agents',
              },
            ],
          },
        ]
      : []),
    {
      section: 'Application',
      items: [
        {
          icon: Bell,
          label: 'Notifications',
          description: 'Preferences de notification',
          href: '#',
        },
        {
          icon: Globe,
          label: 'Langue',
          description: 'Francais',
          href: '#',
        },
      ],
    },
    {
      section: 'A propos',
      items: [
        {
          icon: Info,
          label: 'A propos de Finans',
          description: 'Version 1.0.0',
          href: '/about',
        },
      ],
    },
  ];

  return (
    <>
      <TopBar title="Parametres" />
      <main className="px-container-margin mt-md space-y-lg">
        {/* Profile Section */}
        <section className="bg-surface-container-lowest rounded-xl p-md shadow-ambient">
          <div className="flex items-center gap-md">
            <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center">
              <span className="text-primary font-headline-lg text-headline-lg">
                {user?.fullName?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">
                {user?.fullName}
              </h2>
              <p className="font-body-md text-secondary">{user?.email}</p>
              <span className="inline-flex items-center gap-1 mt-xs px-2 py-0.5 rounded text-xs font-medium bg-primary-container/20 text-primary">
                {user?.role === 'ADMIN' ? 'Administrateur' : 'Agent'}
              </span>
            </div>
          </div>
        </section>

        {/* Menu Sections */}
        {menuItems.map((section) => (
          <section key={section.section} className="space-y-xs">
            <h3 className="font-label-md text-secondary uppercase tracking-widest mb-xs px-xs">
              {section.section}
            </h3>
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
              {section.items.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-md p-md hover:bg-surface-container-low transition-colors ${
                      index < section.items.length - 1
                        ? 'border-b border-surface-container'
                        : ''
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                      <Icon className="w-5 h-5 text-on-surface-variant" />
                    </div>
                    <div className="flex-1">
                      <p className="font-body-md text-on-surface">{item.label}</p>
                      <p className="font-label-sm text-secondary">{item.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-secondary" />
                  </Link>
                );
              })}
            </div>
          </section>
        ))}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={loading}
          className="w-full h-14 bg-error-container text-on-error font-label-md rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <LogOut className="w-5 h-5" />
          {loading ? 'Deconnexion...' : 'Se deconnecter'}
        </button>
      </main>
    </>
  );
}
