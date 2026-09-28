import { Icon, type IconName } from '../icons';
import { BadgeIcon } from '../components/art';

const BRAND = [
  { name: 'Ink', hex: '#16181D' },
  { name: 'Paper', hex: '#F6F4EF' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Oxblood', hex: '#7A1F2B' },
  { name: 'Brass', hex: '#B08D57' },
  { name: 'Border', hex: '#E4E0D6' },
];
const STATUS = [
  { name: 'Not started', hex: '#8A8780' },
  { name: 'In progress', hex: '#3F5F8A' },
  { name: 'Overdue / Absent', hex: '#A33A2E' },
  { name: 'Completed / Present', hex: '#3D7A5A' },
  { name: 'Late / Excused', hex: '#A87A2A' },
];
const PILLS: { label: string; color: string; bg: string; icon: IconName }[] = [
  { label: 'Not started', color: 'var(--st-none)', bg: 'var(--st-none-bg)', icon: 'clock' },
  { label: 'In progress', color: 'var(--st-prog)', bg: 'var(--st-prog-bg)', icon: 'playO' },
  { label: 'Overdue', color: 'var(--st-over)', bg: 'var(--st-over-bg)', icon: 'flag' },
  { label: 'Completed', color: 'var(--st-done)', bg: 'var(--st-done-bg)', icon: 'checkSm' },
  { label: 'Late', color: 'var(--st-late)', bg: 'var(--st-late-bg)', icon: 'clock' },
];

const card = 'rounded-[8px] border border-border bg-surface p-[22px]';
const kicker = 'mb-3.5 text-xs font-medium uppercase tracking-[0.06em] text-dim';

export default function DesignSystem() {
  return (
    <div className="mx-auto max-w-[1000px] animate-fade">
      <div className="mb-[22px]">
        <h1 className="text-[26px] tracking-[-0.02em] text-heading">Scorebridge design system</h1>
        <p className="mt-1 text-sm text-dim">Component-based tokens built for a clean React + Tailwind translation. Toggle the theme in the top bar to preview dark mode.</p>
      </div>

      {/* colors */}
      <div className={`${card} mb-4`}>
        <div className={kicker}>Brand colors</div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {BRAND.map((c) => (
            <div key={c.name} className="overflow-hidden rounded-md border border-border-2">
              <div className="h-14" style={{ background: c.hex }} />
              <div className="p-[9px_11px]">
                <div className="text-[12.5px] font-semibold text-heading">{c.name}</div>
                <div className="font-mono text-[11px] text-dim">{c.hex}</div>
              </div>
            </div>
          ))}
        </div>
        <div className={`${kicker} mt-5`}>Status colors</div>
        <div className="flex flex-wrap gap-2.5">
          {STATUS.map((c) => (
            <div key={c.name} className="flex items-center gap-2.5 rounded-[5px] border border-border-2 bg-surface-2 p-[7px_14px_7px_8px]">
              <span className="h-[22px] w-[22px] rounded-full" style={{ background: c.hex }} />
              <span className="text-[12.5px] font-semibold text-text">{c.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* type + buttons */}
      <div className="mb-4 grid gap-4 md:grid-cols-2">
        <div className={card}>
          <div className={kicker}>Type scale</div>
          <div className="disp text-[34px] font-semibold leading-tight tracking-[-0.02em] text-heading">Source Serif 4 · 34</div>
          <div className="disp mt-2 text-[24px] font-medium text-heading">Source Serif 4 · 24</div>
          <div className="mt-2.5 text-base font-semibold text-text">Inter 16 medium — UI label</div>
          <div className="mt-1.5 text-sm text-text">Inter 14 regular — body copy for descriptions and helper text.</div>
          <div className="mt-1.5 text-xs text-dim">Inter 12 — captions and metadata.</div>
        </div>
        <div className={card}>
          <div className={kicker}>Buttons</div>
          <div className="flex flex-wrap gap-2.5">
            <button className="rounded-md bg-brand px-5 py-2.5 text-sm font-medium text-white hover:opacity-90">Primary</button>
            <button className="rounded-md border border-brand bg-surface px-5 py-2.5 text-sm font-medium text-brand">Secondary</button>
            <button className="rounded-md bg-reward px-5 py-2.5 text-sm font-semibold text-[#1C1F4A]">Reward</button>
            <button className="rounded-md px-4 py-2.5 text-sm font-semibold text-dim">Ghost</button>
          </div>
          <div className={`${kicker} mt-5`}>Inputs</div>
          <input placeholder="Text input" className="mb-2.5 w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm text-text outline-none focus:border-brand" />
          <div className="flex items-center gap-3">
            <div className="h-2.5 flex-1 overflow-hidden rounded-[5px] border border-border-2 bg-surface-2"><div className="h-full w-2/3 rounded-[5px]" style={{ background: 'linear-gradient(90deg,var(--brand),#9d86ff)' }} /></div>
            <span className="text-xs text-dim">Progress</span>
          </div>
        </div>
      </div>

      {/* pills + avatar/badges */}
      <div className={`${card} mb-4`}>
        <div className={kicker}>Status pills</div>
        <div className="flex flex-wrap gap-2.5">
          {PILLS.map((p) => (
            <span key={p.label} className="inline-flex items-center gap-1.5 rounded-[5px] px-3.5 py-1.5 text-[12.5px] font-semibold" style={{ background: p.bg, color: p.color }}>
              <Icon name={p.icon} size={13} /> {p.label}
            </span>
          ))}
        </div>
        <div className={`${kicker} mt-5`}>Avatar &amp; badges</div>
        <div className="flex flex-wrap items-center gap-3.5">
          <div className="grid h-11 w-11 place-items-center rounded-md bg-surface-2 text-sm font-medium text-text" style={{ boxShadow: '0 0 0 1.5px var(--brand)' }}>AK</div>
          <BadgeIcon icon="brick" earned size={52} />
          <BadgeIcon icon="trophy" earned size={52} />
          <BadgeIcon icon="book" earned={false} prog={0.6} size={52} />
        </div>
      </div>

      {/* shape */}
      <div className={card}>
        <div className={kicker}>Shape &amp; elevation</div>
        <div className="flex flex-wrap gap-4">
          <div className="grid h-20 w-[120px] place-items-center rounded-[8px] border border-border bg-surface-2 text-xs text-dim shadow-soft">16px card</div>
          <div className="grid h-20 w-[120px] place-items-center rounded-md border border-border bg-surface-2 text-xs text-dim">12px button</div>
          <div className="grid h-20 w-[120px] place-items-center rounded-[8px] border border-border bg-surface-2 text-xs text-dim shadow-soft">Elevated</div>
        </div>
      </div>
    </div>
  );
}
