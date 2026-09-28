import { useId } from 'react';

/**
 * "Your Bridge" hero — a catenary arch from SCHOOL to UNIVERSITY, with the
 * built (brass) portion revealed via a clip-path that grows with progress.
 * Ported 1:1 from bridge(progress, w, hh).
 */
export interface BridgeProps {
  /** built fraction 0–100 */
  progress: number;
  width?: number;
  height?: number;
  dark?: boolean;
}

export function Bridge({ progress, width = 760, height = 300, dark = false }: BridgeProps) {
  const clipId = useId();
  const W = width;
  const H = height;
  const prog = progress;
  const pad = W < 440 ? 46 : 80;
  const x0 = pad;
  const x1 = W - pad;
  const span = x1 - x0;
  const deckY = H - 64;
  const builtX = x0 + (span * prog) / 100;
  const cx = (x0 + x1) / 2;
  const rx = span / 2;
  const ry = Math.min(H * 0.52, deckY - 22);
  const archY = (x: number) => deckY - ry * Math.sqrt(Math.max(0, 1 - Math.pow((x - cx) / rx, 2)));

  let archPath = `M${x0} ${deckY.toFixed(1)}`;
  for (let i = 1; i <= 64; i++) {
    const x = x0 + (span * i) / 64;
    archPath += ` L${x.toFixed(1)} ${archY(x).toFixed(1)}`;
  }
  const piers: number[] = [];
  for (let i = 1; i <= 9; i++) piers.push(x0 + (span * i) / 10);

  const inkDim = dark ? 'rgba(185,182,174,0.30)' : 'rgba(22,24,29,0.18)';
  const inkLine = dark ? '#8C8A83' : '#4A4A46';
  const brass = '#B08D57';

  const drawSet = (stroke: string, dash: string, wDeck: number, wArch: number, wPier: number) => (
    <g>
      <path d={archPath} fill="none" stroke={stroke} strokeWidth={wArch} strokeDasharray={dash} strokeLinecap="round" strokeLinejoin="round" />
      <line x1={x0} y1={deckY} x2={x1} y2={deckY} stroke={stroke} strokeWidth={wDeck} strokeDasharray={dash} strokeLinecap="round" />
      {piers.map((px, i) => (
        <line key={i} x1={px} y1={deckY} x2={px} y2={archY(px)} stroke={stroke} strokeWidth={wPier} strokeDasharray={dash} />
      ))}
    </g>
  );

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }} aria-hidden={true}>
      <defs>
        <clipPath id={clipId}>
          <rect x={0} y={0} width={builtX} height={H} style={{ transition: 'width .9s cubic-bezier(.4,0,.2,1)' }} />
        </clipPath>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill={dark ? '#16181D' : '#F1EDE4'} />
      <line x1={0} y1={deckY + 2} x2={W} y2={deckY + 2} stroke={inkDim} strokeWidth={1} />
      {drawSet(inkDim, '2 5', 1.2, 1, 0.7)}
      <g clipPath={`url(#${clipId})`}>{drawSet(brass, 'none', 2, 1.5, 0.9)}</g>
      <circle cx={builtX} cy={deckY} r={3} fill={brass} style={{ transition: 'cx .9s cubic-bezier(.4,0,.2,1)' }} />
      <text x={x0} y={deckY + 22} fill={inkLine} fontSize={9.5} fontWeight={600} letterSpacing="0.14em" fontFamily="Inter">
        SCHOOL
      </text>
      <text x={x1} y={deckY + 22} textAnchor="end" fill={brass} fontSize={9.5} fontWeight={600} letterSpacing="0.14em" fontFamily="Inter">
        UNIVERSITY
      </text>
    </svg>
  );
}

/** Faint decorative bridge silhouette (uses currentColor). Ported from bridgeGhost(). */
export function BridgeGhost({ size = 150 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width={size} height={size} style={{ display: 'block' }} aria-hidden={true}>
      <path d="M8 70 V55 a32 32 0 0 1 64 0 V70" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      <path d="M6 72 L92 30" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

export default Bridge;
