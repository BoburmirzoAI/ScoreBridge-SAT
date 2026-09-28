import type { ReactElement, SVGProps } from 'react';

/**
 * Outline icon set — ported 1:1 from design/source/component.reference.js (the
 * `ICON` map + `ic()` helper). No icon library: these are the exact 24×24
 * currentColor glyphs the design uses.
 *
 * The <svg> carries the shared defaults (fill none, stroke currentColor,
 * width 1.5, round caps), matching the reference `P()` helper. Individual
 * shapes only declare overrides (e.g. filled dots set fill + stroke="none").
 */

export type IconName =
  | 'dashboard'
  | 'lessons'
  | 'homework'
  | 'leaderboard'
  | 'attendance'
  | 'practice'
  | 'profile'
  | 'search'
  | 'bell'
  | 'spark'
  | 'brick'
  | 'brickLg'
  | 'shield'
  | 'arrowUp'
  | 'arrowDown'
  | 'arrowRight'
  | 'chevRight'
  | 'chevLeft'
  | 'chevDown'
  | 'play'
  | 'playO'
  | 'pause'
  | 'check'
  | 'checkSm'
  | 'x'
  | 'flag'
  | 'lock'
  | 'sun'
  | 'moon'
  | 'clock'
  | 'download'
  | 'doc'
  | 'math'
  | 'book'
  | 'trophy'
  | 'target'
  | 'fire'
  | 'settings'
  | 'plus'
  | 'users'
  | 'mobile'
  | 'star'
  | 'eye'
  | 'globe';

const ICONS: Record<IconName, ReactElement> = {
  dashboard: (
    <>
      <path d="M3 17V12.5a9 9 0 0 1 18 0V17" />
      <path d="M2.5 17h19" />
      <path d="M8 17v-4" />
      <path d="M16 17v-4" />
      <path d="M12 17v-5" />
    </>
  ),
  lessons: (
    <>
      <circle cx={12} cy={12} r={9} />
      <path d="M10 8.5l6 3.5-6 3.5z" fill="currentColor" />
    </>
  ),
  homework: (
    <>
      <rect x={5} y={3.5} width={14} height={17} rx={2.5} />
      <rect x={9} y={2} width={6} height={3.2} rx={1.2} />
      <path d="M8.5 10h7" />
      <path d="M8.5 13.5h7" />
      <path d="M8.5 17h4" />
    </>
  ),
  leaderboard: (
    <>
      <path d="M6 20V11" />
      <path d="M12 20V6" />
      <path d="M18 20v-6" />
      <path d="M3.5 20h17" />
    </>
  ),
  attendance: (
    <>
      <rect x={3.5} y={5} width={17} height={15} rx={2.5} />
      <path d="M3.5 9.5h17" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <circle cx={8.5} cy={14} r={1.3} fill="currentColor" stroke="none" />
      <circle cx={12.5} cy={14} r={1.3} fill="currentColor" stroke="none" />
    </>
  ),
  practice: (
    <>
      <circle cx={12} cy={12} r={8.5} />
      <circle cx={12} cy={12} r={4.6} />
      <circle cx={12} cy={12} r={1.4} fill="currentColor" stroke="none" />
    </>
  ),
  profile: (
    <>
      <circle cx={12} cy={8.5} r={3.6} />
      <path d="M5.5 19.5a6.5 6.5 0 0 1 13 0" />
    </>
  ),
  search: (
    <>
      <circle cx={11} cy={11} r={6.5} />
      <path d="M20 20l-4-4" />
    </>
  ),
  bell: (
    <>
      <path d="M18 15.5V11a6 6 0 1 0-12 0v4.5L4.5 18h15z" />
      <path d="M9.5 18a2.5 2.5 0 0 0 5 0" />
    </>
  ),
  spark: <path d="M12 3l2.1 5.9L20 11l-5.9 2.1L12 19l-2.1-5.9L4 11l5.9-2.1z" fill="currentColor" stroke="none" />,
  brick: (
    <>
      <rect x={4} y={8} width={16} height={9} rx={1.6} />
      <path d="M12 8v9" />
      <path d="M4 12.5h4" />
      <path d="M16 12.5h4" />
    </>
  ),
  brickLg: (
    <>
      <rect x={4} y={8} width={16} height={9} rx={1.8} strokeWidth={2} />
      <path d="M12 8v9" strokeWidth={2} />
      <path d="M4 12.5h4" strokeWidth={2} />
      <path d="M16 12.5h4" strokeWidth={2} />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7 2.5v5.5c0 4.3-3 7.7-7 9-4-1.3-7-4.7-7-9V5.5z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  arrowUp: (
    <>
      <path d="M12 19V6" />
      <path d="M6 11l6-6 6 6" />
    </>
  ),
  arrowDown: (
    <>
      <path d="M12 5v13" />
      <path d="M6 13l6 6 6-6" />
    </>
  ),
  arrowRight: (
    <>
      <path d="M5 12h13" />
      <path d="M13 6l6 6-6 6" />
    </>
  ),
  chevRight: <path d="M9 6l6 6-6 6" />,
  chevLeft: <path d="M15 6l-6 6 6 6" />,
  chevDown: <path d="M6 9l6 6 6-6" />,
  play: <path d="M8 6l11 6-11 6z" fill="currentColor" />,
  playO: <path d="M9 7l9 5-9 5z" />,
  pause: (
    <>
      <path d="M9 6v12" />
      <path d="M15 6v12" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7" />,
  checkSm: <path d="M5 12l4 4 10-10" strokeWidth={2} />,
  x: (
    <>
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </>
  ),
  flag: (
    <>
      <path d="M6 21V4" />
      <path d="M6 4h11l-2 3.5L17 11H6" />
    </>
  ),
  lock: (
    <>
      <rect x={5} y={11} width={14} height={9} rx={2} />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  sun: (
    <>
      <circle cx={12} cy={12} r={4} />
      <path d="M12 2v2.5" />
      <path d="M12 19.5V22" />
      <path d="M2 12h2.5" />
      <path d="M19.5 12H22" />
      <path d="M4.9 4.9l1.8 1.8" />
      <path d="M17.3 17.3l1.8 1.8" />
      <path d="M19.1 4.9l-1.8 1.8" />
      <path d="M6.7 17.3l-1.8 1.8" />
    </>
  ),
  moon: <path d="M20 13.5A8 8 0 1 1 10.5 4a6.5 6.5 0 0 0 9.5 9.5z" />,
  clock: (
    <>
      <circle cx={12} cy={12} r={8.5} />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  download: (
    <>
      <path d="M12 4v10" />
      <path d="M8 11l4 4 4-4" />
      <path d="M5 19h14" />
    </>
  ),
  doc: (
    <>
      <path d="M7 3.5h7l4 4V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z" />
      <path d="M14 3.5V8h4" />
      <path d="M9 13h6" />
      <path d="M9 16.5h6" />
    </>
  ),
  math: (
    <>
      <path d="M6 5h12" />
      <path d="M9 5l-3 14" />
      <path d="M15 5l3 14" />
      <path d="M5 12h14" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.5A2 2 0 0 1 6 4h5v15H6a2 2 0 0 0-2 1.5z" />
      <path d="M20 5.5A2 2 0 0 0 18 4h-5v15h5a2 2 0 0 1 2 1.5z" />
    </>
  ),
  trophy: (
    <>
      <path d="M8 5h8v4a4 4 0 0 1-8 0z" />
      <path d="M8 6H5.5A1.5 1.5 0 0 0 4 7.5C4 10 6 11 8 11" />
      <path d="M16 6h2.5A1.5 1.5 0 0 1 20 7.5C20 10 18 11 16 11" />
      <path d="M12 13v3" />
      <path d="M8.5 19.5h7" />
      <path d="M10 16.5h4l.5 3h-5z" />
    </>
  ),
  target: (
    <>
      <circle cx={12} cy={12} r={8.5} />
      <circle cx={12} cy={12} r={1.6} fill="currentColor" stroke="none" />
    </>
  ),
  fire: <path d="M12 3c3 3 5 5.5 5 9a5 5 0 0 1-10 0c0-1.6.6-2.7 1.5-3.6C9 10 10 11 10 12c1-1 2-3.5 2-9z" />,
  settings: (
    <>
      <circle cx={12} cy={12} r={3} />
      <path d="M12 3v2M12 19v2M4.2 7l1.7 1M18.1 16l1.7 1M4.2 17l1.7-1M18.1 8l1.7-1M3 12h2M19 12h2" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  users: (
    <>
      <circle cx={9} cy={9} r={3} />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <path d="M15.5 6.2a3 3 0 0 1 0 5.6" />
      <path d="M17 13.5a5.5 5.5 0 0 1 3.5 5.1" />
    </>
  ),
  mobile: (
    <>
      <rect x={7} y={3} width={10} height={18} rx={2.5} />
      <path d="M10.5 5.5h3" />
      <circle cx={12} cy={18} r={0.9} fill="currentColor" stroke="none" />
    </>
  ),
  star: (
    <path
      d="M12 3.6l2.55 5.8 6.3.55-4.77 4.16 1.44 6.16L12 17.02 6.48 20.3l1.44-6.16L3.15 9.95l6.3-.55z"
      fill="currentColor"
      stroke="none"
    />
  ),
  eye: (
    <>
      <path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12s-3.5 6.5-9.5 6.5S2.5 12 2.5 12z" />
      <circle cx={12} cy={12} r={2.6} />
    </>
  ),
  globe: (
    <>
      <circle cx={12} cy={12} r={8.5} />
      <path d="M3.5 12h17" />
      <path d="M12 3.5c2.5 2.6 2.5 14.4 0 17" />
      <path d="M12 3.5c-2.5 2.6-2.5 14.4 0 17" />
    </>
  ),
};

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  /** px, applied to width & height (default 20) */
  size?: number;
}

export function Icon({ name, size = 20, style, ...rest }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block', ...style }}
      aria-hidden={true}
      {...rest}
    >
      {ICONS[name]}
    </svg>
  );
}

export default Icon;
