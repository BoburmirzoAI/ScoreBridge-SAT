import { Icon, type IconName } from '../../icons';

/** Achievement badge medallion. Ported from badgeIcon(b, size). */
export interface BadgeIconProps {
  icon: IconName;
  earned: boolean;
  /** 0–1 progress ring shown when not earned */
  prog?: number;
  size?: number;
}
export function BadgeIcon({ icon, earned, prog, size = 58 }: BadgeIconProps) {
  const col = earned ? 'var(--reward)' : 'var(--faint)';
  const r = 28;
  const circ = 2 * Math.PI * r;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} style={{ display: 'block' }} aria-hidden={true}>
      {earned ? (
        <circle cx={32} cy={32} r={r} fill="none" stroke="var(--reward)" strokeWidth={1.25} />
      ) : (
        <circle cx={32} cy={32} r={r} fill="none" stroke="var(--border)" strokeWidth={1.25} strokeDasharray="3 4" />
      )}
      {!earned && prog != null && (
        <circle
          cx={32}
          cy={32}
          r={r}
          fill="none"
          stroke="var(--reward)"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - prog)}
          transform="rotate(-90 32 32)"
        />
      )}
      {/* glyph as a nested <svg> positioned at (20,20); currentColor = col */}
      <Icon name={icon} size={24} x={20} y={20} style={{ color: col }} />
    </svg>
  );
}

/** Podium trophy. Ported from trophy(size). */
export function Trophy({ size = 130 }: { size?: number }) {
  const g = '#C9A063';
  const gd = '#8f6f42';
  const gl = '#E4C58A';
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 130" width={size} height={size} style={{ display: 'block' }} aria-hidden={true}>
      <path d="M43 24 h44 v16 a22 22 0 0 1 -44 0 z" fill={gl} />
      <path d="M43 40 a22 22 0 0 0 44 0" fill={g} />
      <path d="M43 28 h-13 a9 9 0 0 0 -9 9 c0 14 11 21 23 21" fill="none" stroke={g} strokeWidth={5} strokeLinecap="round" />
      <path d="M87 28 h13 a9 9 0 0 1 9 9 c0 14 -11 21 -23 21" fill="none" stroke={g} strokeWidth={5} strokeLinecap="round" />
      <rect x={60} y={60} width={10} height={18} fill={g} />
      <rect x={46} y={78} width={38} height={9} rx={3} fill={g} />
      <rect x={39} y={89} width={52} height={14} rx={4} fill={gd} />
      <path d="M56 33 l5 5 l10 -11" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" opacity={0.9} />
    </svg>
  );
}

/** Result / celebration crest. Ported from crest(size). */
export function Crest({ size = 80 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width={size} height={size} style={{ display: 'block' }} aria-hidden={true}>
      <circle cx={40} cy={40} r={30} fill="none" stroke="var(--reward)" strokeWidth={1.5} />
      <circle cx={40} cy={40} r={23} fill="none" stroke="var(--reward)" strokeWidth={0.75} opacity={0.55} />
      <path d="M29 41 l7 7 l15 -16" fill="none" stroke="var(--reward)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Row of rating stars (filled up to n of 5). Ported from stars(n, size). */
export function Stars({ n, size = 14 }: { n: number; size?: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: '2px' }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} style={{ color: i < n ? 'var(--reward)' : 'var(--border)', display: 'grid', placeItems: 'center' }}>
          <Icon name="star" size={size} />
        </span>
      ))}
    </span>
  );
}

export default BadgeIcon;
