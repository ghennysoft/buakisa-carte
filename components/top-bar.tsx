'use client';

import { useAuth } from '@/components/auth-provider';
import { Bell, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  showUser?: boolean;
  rightAction?: React.ReactNode;
}

export function TopBar({ title, showBack = false, showUser = true, rightAction }: TopBarProps) {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <header
      className={cn(
        'sticky top-0 z-50 bg-background flex justify-between items-center w-full',
        'px-container-margin py-xs'
      )}
    >
      <div className="flex items-center gap-xs">
        {showBack ? (
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-on-surface" />
          </button>
        ) : showUser && user ? (
          <>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-outline-variant bg-primary-container flex items-center justify-center">
              <span className="text-primary font-headline-sm">
                {user.fullName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-on-surface-variant">
                Bonjour,
              </span>
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                {user.fullName.split(' ')[0]}
              </span>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center">
              <span className="text-primary font-bold text-sm">F</span>
            </div>
            <span className="font-headline-md text-headline-md font-bold text-on-surface">
              Finans
            </span>
          </div>
        )}
        {title && showBack && (
          <span className="font-headline-sm text-headline-sm text-on-surface">{title}</span>
        )}
      </div>
      <div className="flex items-center gap-sm">
        {rightAction ? (
          rightAction
        ) : showUser ? (
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors">
            <Bell className="w-6 h-6 text-on-surface" />
          </button>
        ) : null}
      </div>
    </header>
  );
}
