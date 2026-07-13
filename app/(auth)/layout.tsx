'use client';

import { AuthProvider } from '@/components/auth-provider';
import { ProtectedRoute } from '@/components/protected-route';
import { BottomNav } from '@/components/bottom-nav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <div className="min-h-screen bg-background pb-32">
          {children}
        </div>
        <BottomNav />
      </ProtectedRoute>
    </AuthProvider>
  );
}
