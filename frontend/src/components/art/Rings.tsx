import type { ReactNode } from 'react';

/**
 * Concentric score rings (the dashboard / profile hero gauge).
 * Ported from rings(): 3 arcs (Bridge / Math / R&W) with goal ticks.
 * Colors are the fixed brass palette; only the track colour is theme-aware.
 */

export interface RingDef {
  r: number;
  color: string;
  /** filled fraction 0–100 */
  pct: number;
  /** goal tick position 0–100 */
  goal: number;
}

/** Design defaults: outer=Bridge 58%, mid=Math 88.75% (710/800), inner=R&W 78.75% (630/800). */
const DEFAULT_RINGS: RingDef[] = [
  { r: 116, color: '#B08D57', pct: 58, goal: 100 },
  { r: 90, color: '#5E80AD', pct: 88.75, goal: 96.25 },
  { r: 64, color: '#A64C58', pct: 78.75, goal: 85 },
];

export interface RingsProps {
  dark?: boolean;
  /** when true the arcs animate from empty to their pct */
  animateIn?: boolean;
  /** index of the hovered ring (dims the others), or null */
  hover?: number | null;
  /** fired when a ring arc is hovered (index) or the gauge is left (null) */
  onHover?: (i: number | null) => void;
  defs?: RingDef[];
}

export function Rings({ dark = false, animateIn = true, hover = null, onHover, defs = DEFAULT_RINGS }: RingsProps) {
  const cx = 130;
  const box = 260;
  const sw = 14;
  const track = dark ? '#2A2C31' : '#E4E0D6';
  const nodes: ReactNode[] = [];

  defs.forEach((d, i) => {
    const c = 2 * Math.PI * d.r;
    const dim = hover != null && hover !== i;
    nodes.push(
      <circle key={`t${i}`} cx={cx} cy={cx} r={d.r} fill="none" stroke={track} strokeWidth={sw} opacity={dim ? 0.4 : 1} />,
    );
    nodes.push(
      <circle
        key={`a${i}`}
        cx={cx}
        cy={cx}
        r={d.r}
        fill="none"
        stroke={d.color}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={animateIn ? c * (1 - d.pct / 100) : c}
        transform={`rotate(-90 ${cx} ${cx})`}
        opacity={dim ? 0.3 : 1}
        onMouseEnter={onHover ? () => onHover(i) : undefined}
        style={{ transition: `stroke-dashoffset 1s cubic-bezier(.4,0,.2,1) ${i * 0.22}s, opacity .25s`, cursor: onHover ? 'pointer' : undefined }}
      />,
    );
    const ang = ((-90 + (360 * d.goal) / 100) * Math.PI) / 180;
    const r1 = d.r - sw / 2 - 2;
    const r2 = d.r + sw / 2 + 2;
    nodes.push(
      <line
        key={`g${i}`}
        x1={cx + r1 * Math.cos(ang)}
        y1={cx + r1 * Math.sin(ang)}
        x2={cx + r2 * Math.cos(ang)}
        y2={cx + r2 * Math.sin(ang)}
        stroke={dark ? '#E9E7E1' : '#16181D'}
        strokeWidth={2}
        opacity={dim ? 0.35 : 0.8}
      />,
    );
  });

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${box} ${box}`}
      width="100%"
      style={{ display: 'block', maxWidth: '260px', margin: '0 auto' }}
      onMouseLeave={onHover ? () => onHover(null) : undefined}
      aria-hidden={true}
    >
      {nodes}
    </svg>
  );
}

export default Rings;
