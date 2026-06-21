'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS, ICON_PATHS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface SidebarProps {
  open: boolean;
  compact: boolean;
  onClose: () => void;
  onToggleCompact: () => void;
}

export function Sidebar({ open, compact, onClose, onToggleCompact }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-card/95 backdrop-blur-xl transition-all duration-300 lg:translate-x-0',
          compact ? 'w-20' : 'w-64',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className={cn('flex h-16 items-center border-b border-border', compact ? 'justify-center px-2' : 'gap-3 px-6')}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/20">
            <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          {!compact && (
            <div>
              <h1 className="font-bold text-lg gradient-text">Corroba</h1>
              <p className="text-[10px] text-muted-foreground">Proof → Growth Engine</p>
            </div>
          )}
        </div>

        <nav className={cn('flex-1 overflow-y-auto space-y-1', compact ? 'p-2' : 'p-4')}>
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                title={compact ? item.label : undefined}
                className={cn(
                  'group flex items-center rounded-lg text-sm font-medium transition-all duration-200',
                  compact ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5',
                  active
                    ? 'bg-primary/15 text-primary shadow-sm shadow-primary/10'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                  !compact && !active && 'hover:translate-x-1'
                )}
              >
                <svg className={cn('h-4 w-4 shrink-0 transition-transform group-hover:scale-110', active && 'text-primary')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ICON_PATHS[item.icon]} />
                </svg>
                {!compact && (
                  <>
                    {item.label}
                    {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        <div className={cn('border-t border-border space-y-2', compact ? 'p-2' : 'p-4')}>
          <button
            type="button"
            onClick={onToggleCompact}
            className={cn(
              'hidden w-full items-center rounded-lg border border-border text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:flex',
              compact ? 'justify-center p-2.5' : 'gap-2 px-3 py-2'
            )}
            title={compact ? 'Expand sidebar' : 'Compact sidebar'}
          >
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={compact ? 'M13 5l7 7-7 7M5 5l7 7-7 7' : 'M11 19l-7-7 7-7m8 14l-7-7 7-7'} />
            </svg>
            {!compact && <span>Compact sidebar</span>}
          </button>
          {!compact && (
            <div className="rounded-lg bg-primary/10 p-3 text-xs">
              <p className="font-semibold text-primary">Demo Mode Active</p>
              <p className="mt-1 text-muted-foreground">Preloaded proof data ready. Upload or paste to discover more.</p>
            </div>
          )}
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />}
    </>
  );
}
