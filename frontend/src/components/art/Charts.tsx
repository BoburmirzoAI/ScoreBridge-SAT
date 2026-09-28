import { useId, useState, type ReactNode } from 'react';

/** Mini stat ring. Ported from donut(pct,size,ring,track). */
export interface DonutProps {
  pct: number;
  size?: number;
  ring?: string;
  track?: string;
}
export function Donut({ pct, size = 76, ring = 'var(--reward)', track = 'var(--surface-2)' }: DonutProps) {
  const s = size;
  const sw = 7;
  const r = (s - sw) / 2;
  const c = 2 * Math.PI * r;
  const cx = s / 2;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${s} ${s}`} width={s} height={s} style={{ display: 'block' }} aria-hidden={true}>
      <circle cx={cx} cy={cx} r={r} fill="none" stroke={track} strokeWidth={sw} />
      <circle
        cx={cx}
        cy={cx}
        r={r}
        fill="none"
        stroke={ring}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct / 100)}
        transform={`rotate(-90 ${cx} ${cx})`}
        style={{ transition: 'stroke-dashoffset .9s cubic-bezier(.4,0,.2,1)' }}
      />
    </svg>
  );
}

/** Dashboard score trend sparkline. Ported from sparkline(data,w,hh). */
export interface SparklineProps {
  data?: number[];
  width?: number;
  height?: number;
}
export function Sparkline({ data = [1180, 1240, 1290, 1340], width = 280, height = 70 }: SparklineProps) {
  const gradId = useId();
  const pts = data;
  const W = width;
  const H = height;
  const pad = 8;
  const min = 1150;
  const max = 1360;
  const sx = (i: number) => pad + i * ((W - 2 * pad) / (pts.length - 1));
  const sy = (v: number) => H - pad - ((v - min) / (max - min)) * (H - 2 * pad);
  let d = `M${sx(0)} ${sy(pts[0])}`;
  for (let i = 1; i < pts.length; i++) d += ` L${sx(i)} ${sy(pts[i])}`;
  const area = `${d} L${sx(pts.length - 1)} ${H} L${sx(0)} ${H} Z`;
  const last = pts[pts.length - 1];
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ display: 'block' }} aria-hidden={true}>
      <defs>
        <linearGradient id={gradId} x1={0} y1={0} x2={0} y2={1}>
          <stop offset={0} stopColor="var(--text)" stopOpacity={0.1} />
          <stop offset={1} stopColor="var(--text)" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      <path d={d} fill="none" stroke="var(--text)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((v, i) => (
        <circle
          key={i}
          cx={sx(i)}
          cy={sy(v)}
          r={i === pts.length - 1 ? 3.5 : 2.4}
          fill={i === pts.length - 1 ? 'var(--reward)' : 'var(--surface)'}
          stroke={i === pts.length - 1 ? 'var(--reward)' : 'var(--text)'}
          strokeWidth={1.4}
        />
      ))}
      <text x={sx(pts.length - 1)} y={sy(last) - 9} textAnchor="end" fontSize={11} fontWeight={600} fill="var(--reward)" fontFamily="Source Serif 4">
        {last}
      </text>
    </svg>
  );
}

/** Mock-exam score history line chart. Ported from practiceChart(). */
export interface ExamPoint {
  date: string;
  total: number;
  math: number;
  rw: number;
}
export type PracticeFilter = 'total' | 'math' | 'rw' | 'all';

export function PracticeChart({ tests, filter }: { tests: ExamPoint[]; filter: PracticeFilter }) {
  const [hover, setHover] = useState<{ si: number; pi: number } | null>(null);
  const W = 640;
  const H = 280;
  const padL = 44;
  const padR = 20;
  const padT = 24;
  const padB = 36;
  const n = tests.length;

  const series: { key: 'total' | 'math' | 'rw'; color: string; name: string }[] = [];
  if (filter === 'total' || filter === 'all') series.push({ key: 'total', color: 'var(--text)', name: 'Total' });
  if (filter === 'math' || filter === 'all') series.push({ key: 'math', color: 'var(--st-prog)', name: 'Math' });
  if (filter === 'rw' || filter === 'all') series.push({ key: 'rw', color: 'var(--st-late)', name: 'R&W' });

  // Dynamic Y domain so Math/R&W (≈560–730) are visible, not just Total (≈1180–1380).
  const showGoal = filter === 'total' || filter === 'all';
  const values: number[] = [];
  series.forEach((s) => tests.forEach((t) => values.push(t[s.key])));
  if (showGoal) values.push(1450);
  const lo = Math.floor((Math.min(...values) - 40) / 100) * 100;
  const hi = Math.ceil((Math.max(...values) + 40) / 100) * 100;
  const min = lo;
  const max = Math.max(hi, lo + 100);

  const sx = (i: number) => padL + i * ((W - padL - padR) / Math.max(1, n - 1));
  const sy = (v: number) => padT + (1 - (v - min) / (max - min)) * (H - padT - padB);

  const gridLines = Array.from({ length: 6 }, (_, i) => Math.round(min + ((max - min) * i) / 5));
  const goalInRange = 1450 >= min && 1450 <= max;

  let bestMarker: ReactNode = null;
  if ((filter === 'total' || filter === 'all') && n > 0) {
    const totals = tests.map((t) => t.total);
    const best = Math.max(...totals);
    const bi = totals.lastIndexOf(best);
    bestMarker = (
      <g>
        <circle cx={sx(bi)} cy={sy(best)} r={4} fill="var(--reward)" />
        <text x={sx(bi) + 3} y={sy(best) - 11} textAnchor="end" fontSize={11} fontWeight={600} fill="var(--reward)" fontFamily="Source Serif 4">
          Best {best}
        </text>
      </g>
    );
  }

  const hoverPoint = hover ? { s: series[hover.si], v: tests[hover.pi][series[hover.si].key], t: tests[hover.pi] } : null;

  return (
    <div className="relative">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }} onMouseLeave={() => setHover(null)}>
      {gridLines.map((g, i) => (
        <g key={`g${i}`}>
          <line x1={padL} y1={sy(g)} x2={W - padR} y2={sy(g)} stroke="var(--border-2)" strokeWidth={1} />
          <text x={padL - 8} y={sy(g) + 4} textAnchor="end" fontSize={10} fill="var(--faint)">
            {g}
          </text>
        </g>
      ))}
      {showGoal && goalInRange && (
        <>
          <line x1={padL} y1={sy(1450)} x2={W - padR} y2={sy(1450)} stroke="var(--reward)" strokeWidth={1.2} strokeDasharray="4 4" />
          <text x={W - padR} y={sy(1450) - 6} textAnchor="end" fontSize={10} fontWeight={600} fill="var(--reward)" fontFamily="Inter">
            Goal 1450
          </text>
        </>
      )}
      {tests.map((t, i) => (
        <text key={`x${i}`} x={sx(i)} y={H - 14} textAnchor="middle" fontSize={11} fill="var(--dim)">
          {t.date}
        </text>
      ))}
      {series.map((s) => {
        let d = `M${sx(0)} ${sy(tests[0][s.key])}`;
        for (let i = 1; i < n; i++) d += ` L${sx(i)} ${sy(tests[i][s.key])}`;
        return (
          <g key={s.key}>
            <path d={d} fill="none" stroke={s.color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
            {tests.map((t, i) => (
              <circle key={i} cx={sx(i)} cy={sy(t[s.key])} r={3} fill="var(--surface)" stroke={s.color} strokeWidth={1.5} />
            ))}
          </g>
        );
      })}
      {bestMarker}
      {/* invisible hover hit-targets (on top) */}
      {series.map((s, si) =>
        tests.map((t, pi) => (
          <circle
            key={`h${si}-${pi}`}
            cx={sx(pi)}
            cy={sy(t[s.key])}
            r={12}
            fill="transparent"
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => setHover({ si, pi })}
          />
        )),
      )}
      {hover && hoverPoint && (
        <circle cx={sx(hover.pi)} cy={sy(hoverPoint.v)} r={5} fill={hoverPoint.s.color} stroke="var(--surface)" strokeWidth={1.5} />
      )}
    </svg>
    {hover && hoverPoint && (
      <div
        className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[130%] whitespace-nowrap rounded-md border border-border bg-surface px-2.5 py-1.5 text-[11.5px] shadow-soft"
        style={{ left: `${(sx(hover.pi) / W) * 100}%`, top: `${(sy(hoverPoint.v) / H) * 100}%` }}
      >
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: hoverPoint.s.color }} />
          <span className="font-medium text-text">{hoverPoint.s.name}</span>
          <span className="disp text-heading">{hoverPoint.v}</span>
        </div>
        <div className="mt-0.5 text-faint">{hoverPoint.t.date} · 2026</div>
      </div>
    )}
    </div>
  );
}

export default Donut;
