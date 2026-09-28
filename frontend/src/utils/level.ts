import type { Level } from '../data/types';

export interface LevelInfo {
  name: string;
  nextName: string;
  /** % progress into the current level, 0–100 */
  pct: number;
  pctStr: string;
  /** e.g. "3,580" XP remaining to next level */
  toNext: string;
}

/** Ported from levelInfo(): current/next level + progress toward next. */
export function levelInfo(xp: number, levels: Level[]): LevelInfo {
  const x = Math.round(xp);
  let i = 0;
  for (let j = 0; j < levels.length; j++) if (x >= levels[j].xp) i = j;
  const cur = levels[i];
  const next = levels[Math.min(i + 1, levels.length - 1)];
  const base = cur.xp;
  const top = next.xp === cur.xp ? cur.xp + 1 : next.xp;
  const pct = Math.max(0, Math.min(100, ((x - base) / (top - base)) * 100));
  return {
    name: cur.name,
    nextName: next.name,
    pct,
    pctStr: `${pct.toFixed(1)}%`,
    toNext: (top - x).toLocaleString(),
  };
}
