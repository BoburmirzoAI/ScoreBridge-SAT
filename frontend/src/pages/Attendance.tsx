import { useState } from 'react';
import { Icon, type IconName } from '../icons';
import { Donut, Stars } from '../components/art';
import { useNow } from '../hooks';
import { anchorAttendance, anchorCountdowns, attendanceRate, attendanceStreak, countdownOffsets } from '../data';
import type { AttStatus } from '../data/types';
import { useStore } from '../store';
import { cdShort } from '../utils';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

type AttMeta = { label: string; color: string; bg: string; icon: IconName };
const ATT_META: Record<AttStatus, AttMeta> = {
  present: { label: 'Present', color: 'var(--st-done)', bg: 'var(--st-done-bg)', icon: 'check' },
  late: { label: 'Late', color: 'var(--st-late)', bg: 'var(--st-late-bg)', icon: 'clock' },
  excused: { label: 'Excused', color: 'var(--st-late)', bg: 'var(--st-late-bg)', icon: 'doc' },
  absent: { label: 'Absent', color: 'var(--st-over)', bg: 'var(--st-over-bg)', icon: 'x' },
  upcoming: { label: 'Upcoming', color: 'var(--st-prog)', bg: 'var(--st-prog-bg)', icon: 'clock' },
};
function meta(s: AttStatus): AttMeta {
  return ATT_META[s];
}

export default function Attendance() {
  const now = useNow();
  const { anchor } = useStore();
  const cd = anchorCountdowns(anchor, countdownOffsets);
  const sessions = anchorAttendance(anchor);

  const [view, setView] = useState<'calendar' | 'table'>('calendar');
  const [monthOffset, setMonthOffset] = useState(0);
  const [selDay, setSelDay] = useState(23);

  const held = sessions.filter((s) => s.status !== 'upcoming');
  const attended = held.filter((s) => s.status === 'present' || s.status === 'late').length;

  const anchorDate = new Date(anchor);
  const disp = new Date(anchorDate.getFullYear(), anchorDate.getMonth() + monthOffset, 1);
  const isAnchorMonth = disp.getMonth() === anchorDate.getMonth() && disp.getFullYear() === anchorDate.getFullYear();
  const year = disp.getFullYear();
  const month = disp.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const sessionByDay = new Map<number, (typeof sessions)[number]>();
  if (isAnchorMonth) sessions.forEach((s) => sessionByDay.set(s.date.getDate(), s));

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const sel = isAnchorMonth ? sessionByDay.get(selDay) : undefined;
  const selMeta = sel ? meta(sel.status) : null;

  const card = 'rounded-[8px] border border-border bg-surface';

  return (
    <div className="mx-auto max-w-[1020px] animate-fade">
      <div className="mb-4">
        <h1 className="text-[26px] tracking-[-0.02em] text-heading">Attendance</h1>
        <p className="mt-1 text-sm text-dim">Evening Group B · {MONTHS[anchorDate.getMonth()]} {anchorDate.getFullYear()}.</p>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center gap-1.5 rounded-[8px] border border-border bg-surface px-3.5 py-2 text-[13px] text-dim">
          <Icon name="clock" size={13} /> Next session in <span className="disp text-text">{cdShort(cd.nextSession, now)}</span>
        </div>
        {/* Calendar / Table toggle (amendment 2) */}
        <div className="ml-auto flex gap-1.5 rounded-md border border-border bg-surface p-1">
          {(['calendar', 'table'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="rounded-[5px] px-3.5 py-1.5 text-[12.5px] font-semibold capitalize"
              style={{ background: view === v ? 'var(--brand)' : 'transparent', color: view === v ? '#fff' : 'var(--dim)' }}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* stat cards */}
      <div className="mb-[18px] grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className={`${card} flex items-center gap-4 p-[16px_18px]`}>
          <div className="relative h-[84px] w-[84px] flex-none">
            <Donut pct={Math.round((attended / held.length) * 100)} size={84} ring="var(--reward)" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="disp text-[22px] leading-none text-heading">{attended}</span>
              <span className="text-[10px] text-dim">of {held.length}</span>
            </div>
          </div>
          <div className="text-[13px] leading-snug text-dim">Attended<br />held lessons</div>
        </div>
        <div className={`${card} p-[16px_18px]`}>
          <div className="flex items-baseline justify-between"><span className="disp text-[22px] text-heading">{attended}</span><span className="text-xs text-st-done">Online</span></div>
          <div className="mb-3 mt-1.5 h-1.5 overflow-hidden rounded-md bg-surface-2"><div className="h-full w-full rounded-md bg-st-done" /></div>
          <div className="flex items-baseline justify-between"><span className="disp text-[22px] text-heading">0</span><span className="text-xs text-dim">In person</span></div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-md bg-surface-2"><div className="h-full w-[3%] rounded-md bg-dim" /></div>
        </div>
        <div className={`${card} flex flex-col justify-center gap-2 p-[16px_18px]`}>
          <div className="origin-left scale-110"><Stars n={5} size={16} /></div>
          <div className="text-[12.5px] text-dim">Average lesson rating · 4.8</div>
        </div>
        <div className={`${card} flex items-center gap-4 p-[16px_18px]`}>
          <div className="disp text-[30px] leading-none text-reward">{attendanceRate}%</div>
          <div>
            <div className="text-[13px] text-dim">Attendance rate</div>
            <div className="mt-0.5 text-xs text-dim">{attendanceStreak}-session streak</div>
          </div>
        </div>
      </div>

      {view === 'calendar' ? (
        <div className="grid gap-4 md:grid-cols-[1.5fr_1fr]">
          {/* calendar */}
          <div className={`${card} p-[18px]`}>
            <div className="mb-3 flex items-center justify-between">
              <button onClick={() => setMonthOffset((m) => m - 1)} className="grid h-8 w-8 place-items-center rounded-md border border-border text-dim hover:border-brand hover:text-brand"><Icon name="chevLeft" size={16} /></button>
              <strong className="disp text-[15px] text-heading">{MONTHS[month]} {year}</strong>
              <button onClick={() => setMonthOffset((m) => m + 1)} className="grid h-8 w-8 place-items-center rounded-md border border-border text-dim hover:border-brand hover:text-brand"><Icon name="chevRight" size={16} /></button>
            </div>
            <div className="mb-1.5 grid grid-cols-7 gap-1.5 text-center text-[11px] font-semibold text-faint">
              {WEEKDAYS.map((w, i) => <div key={i}>{w}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {cells.map((d, i) => {
                if (d == null) return <div key={i} />;
                const s = sessionByDay.get(d);
                const m = s ? meta(s.status) : null;
                const selected = isAnchorMonth && d === selDay && !!s;
                const isToday = isAnchorMonth && d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                return (
                  <button
                    key={i}
                    disabled={!s}
                    onClick={() => s && setSelDay(d)}
                    className="grid aspect-square place-items-center rounded-md text-[13px] transition-colors"
                    style={{
                      background: selected ? 'var(--brand-soft)' : m ? m.bg : 'transparent',
                      color: m ? m.color : 'var(--dim)',
                      border: `1px solid ${selected ? 'var(--brand)' : isToday ? 'var(--faint)' : 'transparent'}`,
                      cursor: s ? 'pointer' : 'default',
                      fontWeight: s ? 700 : 500,
                    }}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
            {/* legend */}
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-border-2 pt-3 text-[11.5px] text-dim">
              {(['present', 'late', 'excused', 'absent', 'upcoming'] as AttStatus[]).map((st) => (
                <span key={st} className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded" style={{ background: meta(st).bg, border: `1px solid ${meta(st).color}` }} />
                  {meta(st).label}
                </span>
              ))}
            </div>
          </div>

          {/* day details */}
          <div className={`${card} p-[18px]`}>
            {sel && selMeta ? (
              <>
                <div className="flex items-center justify-between">
                  <strong className="disp text-[15px] text-heading">{MONTHS[month]} {selDay}</strong>
                  <span className="inline-flex items-center gap-1 rounded-[5px] px-2.5 py-1 text-[11px] font-semibold" style={{ background: selMeta.bg, color: selMeta.color }}>
                    <Icon name={selMeta.icon} size={14} /> {selMeta.label}
                  </span>
                </div>
                <div className="mt-3 text-[13px] text-dim">18:00 – 19:30</div>
                <div className="disp mt-3 text-[17px] text-heading">{sel.topic}</div>
                <p className="mt-1.5 text-sm text-dim">{sel.note}</p>
              </>
            ) : (
              <div className="grid h-full min-h-[160px] place-items-center text-center text-sm text-dim">
                {isAnchorMonth ? 'Select a highlighted day to see details.' : 'No sessions this month.'}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* transposed session-log table */
        <div className={`${card} overflow-hidden`}>
          <div className="flex items-center gap-2.5 border-b border-border px-[18px] py-3.5">
            <span className="grid h-[26px] w-[26px] place-items-center rounded-md bg-surface-2 text-dim"><Icon name="brick" size={14} /></span>
            <strong className="disp text-[15px] text-heading">Block 1 · session log</strong>
          </div>
          <div className="overflow-x-auto">
            <table className="w-max min-w-full border-collapse">
              <tbody>
                <tr className="border-b border-border-2">
                  <td className="sticky left-0 z-[2] w-[150px] bg-surface px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-faint">Lesson date</td>
                  {held.map((s, i) => (
                    <td key={i} className="w-[112px] border-l border-border-2 px-2 py-2.5 text-center">
                      <div className="text-xs font-medium text-heading">{String(s.date.getDate()).padStart(2, '0')}.{String(month + 1).padStart(2, '0')}</div>
                      <div className="text-[11px] text-dim">Lesson {i + 1}</div>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border-2">
                  <td className="sticky left-0 z-[2] w-[150px] bg-surface px-4 py-3.5 text-[13px] text-dim">I attended</td>
                  {held.map((s, i) => {
                    const ok = s.status === 'present' || s.status === 'late';
                    return (
                      <td key={i} className="border-l border-border-2 px-3 py-2.5 text-center">
                        <span className="mx-auto grid h-7 w-7 place-items-center rounded-full" style={{ background: ok ? 'var(--st-done-bg)' : 'var(--st-over-bg)', color: ok ? 'var(--st-done)' : 'var(--st-over)' }}>
                          <Icon name={ok ? 'check' : 'x'} size={ok ? 15 : 13} />
                        </span>
                      </td>
                    );
                  })}
                </tr>
                <tr className="border-b border-border-2">
                  <td className="sticky left-0 z-[2] w-[150px] bg-surface px-4 py-3.5 text-[13px] text-dim">Format</td>
                  {held.map((s, i) => {
                    const absent = s.status === 'absent';
                    return (
                      <td key={i} className="border-l border-border-2 px-3 py-2.5 text-center">
                        <span className="inline-flex items-center gap-1.5 rounded-[5px] px-2 py-0.5 text-xs font-medium" style={{ color: absent ? 'var(--faint)' : 'var(--st-done)', background: absent ? 'transparent' : 'var(--st-done-bg)' }}>
                          {absent ? '—' : <><Icon name="globe" size={12} /> Online</>}
                        </span>
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="sticky left-0 z-[2] w-[150px] bg-surface px-4 py-3.5 text-[13px] text-dim">My rating</td>
                  {held.map((s, i) => {
                    const rating = s.status === 'absent' ? 0 : s.status === 'late' ? 4 : 5;
                    return (
                      <td key={i} className="border-l border-border-2 px-3 py-2.5">
                        <div className="grid place-items-center"><Stars n={rating} size={12} /></div>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
