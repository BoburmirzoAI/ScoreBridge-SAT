/**
 * "Bo" — the geometric beaver mascot (used in the empty-homework state).
 * Ported 1:1 from bo(mood, size); currentColor via var(--dim).
 */
export function Bo({ size = 56 }: { mood?: string; size?: number }) {
  const st = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 80 80"
      width={size}
      height={size}
      style={{ display: 'block', color: 'var(--dim)' }}
      aria-hidden={true}
    >
      <path d="M40 47 L40 63 Q51 61 51 50" {...st} />
      <rect x={26} y={41} width={28} height={23} rx={11} {...st} />
      <circle cx={40} cy={31} r={16} {...st} />
      <circle cx={28} cy={23} r={3.5} {...st} />
      <circle cx={52} cy={23} r={3.5} {...st} />
      <ellipse cx={40} cy={37} rx={8.5} ry={5.5} {...st} />
      <circle cx={40} cy={33.5} r={1.4} fill="currentColor" />
      <path d="M40 39.5 v3.5" {...st} />
      <circle cx={34} cy={28} r={1.3} fill="currentColor" />
      <circle cx={46} cy={28} r={1.3} fill="currentColor" />
      <path d="M25 21.5 a15 9 0 0 1 30 0" {...st} />
      <path d="M21 21.5 h38" {...st} />
    </svg>
  );
}

export default Bo;
