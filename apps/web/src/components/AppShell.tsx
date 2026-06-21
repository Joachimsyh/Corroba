'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ScrollNetwork } from '@/components/ScrollNetwork';
import { Sidebar } from '@/components/Sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CommandPalette } from '@/components/CommandPalette';
import { BackToTop } from '@/components/BackToTop';
import { getCompactSidebar } from '@/lib/preferences';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [compactSidebar, setCompactSidebar] = useState(false);

  useEffect(() => {
    setCompactSidebar(getCompactSidebar());

    function onPreferencesChange() {
      setCompactSidebar(getCompactSidebar());
    }
    window.addEventListener('corroba-preferences-change', onPreferencesChange);
    return () => window.removeEventListener('corroba-preferences-change', onPreferencesChange);
  }, []);

  return (
    <div className="relative min-h-screen mesh-bg">
      <ScrollNetwork dotCount={20} />
      <Sidebar
        open={sidebarOpen}
        compact={compactSidebar}
        onClose={() => setSidebarOpen(false)}
        onToggleCompact={() => {
          setCompactSidebar((value) => {
            const next = !value;
            localStorage.setItem('corroba-sidebar-compact', String(next));
            return next;
          });
        }}
      />

      <div className={`relative z-10 transition-[padding] duration-300 ${compactSidebar ? 'lg:pl-20' : 'lg:pl-64'}`}>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/50 bg-background/80 backdrop-blur-xl px-4 sm:px-6">
          <button
            className="lg:hidden rounded-lg p-2 hover:bg-accent transition-colors"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <CommandPalette />
          <div className="flex-1" />
          <ThemeToggle />
          <Link
            href="/discovery"
            className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Discover Proof
          </Link>
        </header>
        <main className="p-6 lg:p-8">{children}</main>
      </div>
      <BackToTop />
    </div>
  );
}
