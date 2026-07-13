'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { TopBar } from '@/components/top-bar';
import { Plus, Search, Shield, User, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface Agent {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

export default function AgentsPage() {
  const { user } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      fetchAgents();
    }
  }, [user]);

  useEffect(() => {
    if (search.trim() === '') {
      setFilteredAgents(agents);
    } else {
      setFilteredAgents(
        agents.filter(
          (a) =>
            a.fullName.toLowerCase().includes(search.toLowerCase()) ||
            a.email.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, agents]);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/agents');
      if (res.ok) {
        const data = await res.json();
        setAgents(data.agents);
        setFilteredAgents(data.agents);
      }
    } catch (err) {
      console.error('Error fetching agents:', err);
    }
    setLoading(false);
  };

  if (user && user.role !== 'ADMIN') {
    return (
      <>
        <TopBar title="Agents" />
        <main className="px-container-margin mt-md text-center py-xl">
          <Shield className="w-12 h-12 text-secondary mx-auto mb-sm" />
          <p className="font-body-md text-secondary">
            Seuls les administrateurs peuvent gerer les agents.
          </p>
        </main>
      </>
    );
  }

  return (
    <>
      <TopBar title="Agents & Admins" />
      <main className="px-container-margin mt-md space-y-md">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-md top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full h-12 bg-surface-container-lowest border border-outline-variant rounded-xl pl-12 pr-md font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Add Button */}
        <Link
          href="/agents/create"
          className="flex items-center justify-center gap-2 w-full h-12 bg-primary-container text-on-primary-container font-label-md rounded-xl hover:bg-primary-fixed transition-colors"
        >
          <Plus className="w-5 h-5" />
          Ajouter un agent/admin
        </Link>

        {/* Agent List */}
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
          ) : filteredAgents.length === 0 ? (
            <div className="text-center py-xl">
              <User className="w-12 h-12 text-secondary mx-auto mb-sm" />
              <p className="font-body-md text-secondary">Aucun agent trouve</p>
            </div>
          ) : (
            filteredAgents.map((agent) => (
              <div
                key={agent.id}
                className="flex items-center justify-between p-sm bg-surface-container-lowest rounded-xl border border-surface-container hover:bg-surface-container-low transition-colors"
              >
                <div className="flex items-center gap-sm">
                  <div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center">
                    {agent.role === 'ADMIN' ? (
                      <ShieldCheck className="w-5 h-5 text-primary" />
                    ) : (
                      <span className="text-primary font-headline-sm">
                        {agent.fullName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-sm">
                      <p className="font-body-md text-body-md font-semibold text-on-surface">
                        {agent.fullName}
                      </p>
                      {agent.role === 'ADMIN' && (
                        <span className="px-2 py-0.5 bg-secondary-container text-on-secondary-container font-label-sm rounded-full text-[10px]">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="font-label-sm text-label-sm text-secondary">{agent.email}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </>
  );
}
