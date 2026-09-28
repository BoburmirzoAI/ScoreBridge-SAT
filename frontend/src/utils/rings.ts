import type { RingDef } from '../components/art';
import type { Scores } from '../data/types';

/**
 * Ring gauge definitions derived from scores + bridge %.
 * Outer = Bridge, mid = Math (score/total), inner = R&W (score/total).
 * Goals mirror the design (Math 96.25%, R&W 85%, Bridge 100%).
 */
/** Ring colors — distinct hues within the brand palette (brass / steel blue / oxblood rose). */
export const RING_COLORS = { bridge: '#B08D57', math: '#5E80AD', rw: '#A64C58' } as const;

export function ringDefs(scores: Scores, bridge: number): RingDef[] {
  return [
    { r: 116, color: RING_COLORS.bridge, pct: bridge, goal: 100 },
    { r: 90, color: RING_COLORS.math, pct: (scores.math / scores.mathTotal) * 100, goal: 96.25 },
    { r: 64, color: RING_COLORS.rw, pct: (scores.rw / scores.rwTotal) * 100, goal: 85 },
  ];
}
