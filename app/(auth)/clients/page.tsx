'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { TopBar } from '@/components/top-bar';
import { Plus, Search, Edit, User } from 'lucide-react';
import Link from 'next/link';

interface Client {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
}

export default function ClientsPage() {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchClients();
    }
  }, [user]);

  useEffect(() => {
    if (search.trim() === '') {
      setFilteredClients(clients);
    } else {
      setFilteredClients(
        clients.filter(
          (c) =>
            c.fullName.toLowerCase().includes(search.toLowerCase()) ||
            c.email?.toLowerCase().includes(search.toLowerCase()) ||
            c.phone?.includes(search)
        )
      );
    }
  }, [search, clients]);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/clients');
      if (res.ok) {
        const data = await res.json();
        setClients(data.clients);
        setFilteredClients(data.clients);
      }
    } catch (err) {
      console.error('Error fetching clients:', err);
    }
    setLoading(false);
  };

  return (
    <>
      <TopBar title="Clients" />
      <main className="px-container-margin mt-md space-y-md">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-md top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un client..."
            className="w-full h-12 bg-surface-container-lowest border border-outline-variant rounded-xl pl-12 pr-md font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Add Button */}
        <Link
          href="/clients/create"
          className="flex items-center justify-center gap-2 w-full h-12 bg-primary-container text-on-primary-container font-label-md rounded-xl hover:bg-primary-fixed transition-colors"
        >
          <Plus className="w-5 h-5" />
          Ajouter un client
        </Link>

        {/* Client List */}
        <div className="space-y-sm">
          {loading ? (
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex items-center justify-between p-sm bg-surface-container-lowest rounded-xl">
                  <div className="flex items-center gap-sm">
                    <div className="w-12 h-12 rounded-full bg-surface-container-high"></div>
                    <div>
                      <div className="h-4 w-24 bg-surface-container-high rounded mb-xs"></div>
                      <div className="h-3 w-16 bg-surface-container-high rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-xl">
              <User className="w-12 h-12 text-secondary mx-auto mb-sm" />
              <p className="font-body-md text-secondary">
                {search ? 'Aucun client trouve' : 'Aucun client'}
              </p>
              <Link
                href="/clients/create"
                className="inline-block mt-sm text-primary font-label-md"
              >
                Ajouter un client
              </Link>
            </div>
          ) : (
            filteredClients.map((client) => (
              <div
                key={client.id}
                className="flex items-center justify-between p-sm bg-surface-container-lowest rounded-xl border border-surface-container hover:bg-surface-container-low transition-colors"
              >
                <div className="flex items-center gap-sm">
                  <div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center">
                    <span className="text-primary font-headline-sm">
                      {client.fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-body-md text-body-md font-semibold text-on-surface">
                      {client.fullName}
                    </p>
                    <p className="font-label-sm text-label-sm text-secondary">
                      {client.email || client.phone || 'Aucun contact'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-xs">
                  <Link
                    href={`/clients/${client.id}/edit`}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors"
                  >
                    <Edit className="w-5 h-5 text-secondary" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </>
  );
}
