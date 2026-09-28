export * from './countdown';
export * from './homework';
export * from './level';
export * from './rings';
export * from './pdf';

/** Up-to-two-letter initials from a name. */
export function initialsOf(name: string): string {
  return name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase() || 'U';
}

/** morning / afternoon / evening from real local time (dashboard greeting). */
export function greeting(now: number = Date.now()): 'morning' | 'afternoon' | 'evening' {
  const h = new Date(now).getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
}
