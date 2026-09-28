/** Countdown math + formatters — ported from component.reference.js (cd*). */

export interface CdParts {
  past: boolean;
  ms: number;
  d: number;
  h: number;
  m: number;
  s: number;
}

const pad = (n: number) => `0${n}`.slice(-2);
const DAY = 864e5;

export function cdParts(target: number, now: number): CdParts {
  const diff = target - now;
  const a = Math.abs(diff);
  return {
    past: diff < 0,
    ms: diff,
    d: Math.floor(a / DAY),
    h: Math.floor((a % DAY) / 36e5),
    m: Math.floor((a % 36e5) / 6e4),
    s: Math.floor((a % 6e4) / 1e3),
  };
}

/** "40d 08h" / "8h 05m" / "12m" */
export function cdShort(target: number, now: number): string {
  const p = cdParts(target, now);
  if (p.d > 0) return `${p.d}d ${pad(p.h)}h`;
  if (p.h > 0) return `${p.h}h ${pad(p.m)}m`;
  return `${p.m}m`;
}

/** "Overdue by 1d 06h 05m" / "1d 06h 05m" */
export function cdMed(target: number, now: number): string {
  const p = cdParts(target, now);
  const pre = p.past ? 'Overdue by ' : '';
  if (p.d > 0) return `${pre}${p.d}d ${pad(p.h)}h ${pad(p.m)}m`;
  if (p.h > 0) return `${pre}${p.h}h ${pad(p.m)}m`;
  return `${pre}${p.m}m`;
}

/** "40d 08h 55m" */
export function cdBig(target: number, now: number): string {
  const p = cdParts(target, now);
  return `${p.d}d ${pad(p.h)}h ${pad(p.m)}m`;
}

/** "00:42:13" */
export function cdClock(target: number, now: number): string {
  const p = cdParts(target, now);
  return `${pad(p.h)}:${pad(p.m)}:${pad(p.s)}`;
}

/** past or under 24h */
export function cdUrgent(target: number, now: number): boolean {
  const p = cdParts(target, now);
  return p.past || p.ms < DAY;
}
