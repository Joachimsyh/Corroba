'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { NAV_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [...NAV_ITEMS];
    return NAV_ITEMS.filter(
      (item) => item.label.toLowerCase().includes(q) || item.href.toLowerCase().includes(q)
    );
  }, [query]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((value) => !value);
      }
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setActiveIndex(0);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  function navigate(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden items-center gap-2 rounded-lg border border-border bg-card/80 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:inline-flex"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span>Search</span>
        <kbd className="rounded border border-border bg-muted px-1.5 text-[10px]">⌘K</kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 p-4 pt-[12vh] backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div
            className="w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setActiveIndex((i) => Math.min(i + 1, results.length - 1));
                  }
                  if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setActiveIndex((i) => Math.max(i - 1, 0));
                  }
                  if (e.key === 'Enter' && results[activeIndex]) {
                    e.preventDefault();
                    navigate(results[activeIndex].href);
                  }
                }}
                placeholder="Jump to a page..."
                className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline">Esc</kbd>
            </div>
            <ul className="max-h-72 overflow-y-auto p-2">
              {results.length === 0 ? (
                <li className="px-3 py-6 text-center text-sm text-muted-foreground">No pages found.</li>
              ) : (
                results.map((item, index) => (
                  <li key={item.href}>
                    <button
                      type="button"
                      onClick={() => navigate(item.href)}
                      className={cn(
                        'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                        index === activeIndex ? 'bg-primary/15 text-primary' : 'text-foreground hover:bg-accent'
                      )}
                    >
                      <span>{item.label}</span>
                      <span className="text-xs text-muted-foreground">{item.href}</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
            <div className="border-t border-border px-4 py-2 text-[11px] text-muted-foreground">
              <span className="hidden sm:inline">↑↓ navigate · Enter open · </span>
              <kbd className="rounded border border-border bg-muted px-1">Ctrl</kbd>+<kbd className="rounded border border-border bg-muted px-1">K</kbd> toggle
            </div>
          </div>
        </div>
      )}
    </>
  );
}
