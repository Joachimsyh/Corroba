const COMPACT_SIDEBAR_KEY = 'corroba-sidebar-compact';

export function getCompactSidebar(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(COMPACT_SIDEBAR_KEY) === 'true';
}

export function setCompactSidebar(compact: boolean) {
  localStorage.setItem(COMPACT_SIDEBAR_KEY, String(compact));
}
