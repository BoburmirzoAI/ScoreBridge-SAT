import { useState } from 'react';
import { Icon } from '../icons';
import { PracticeChart } from '../components/art';
import { useNow, useService } from '../hooks';
import { getMockExams } from '../services';
import { anchorCountdowns, countdownOffsets } from '../data';
import { useStore } from '../store';
import { cdShort } from '../utils';

const FILTERS: { key: 'total' | 'math' | 'rw' | 'all'; label: string }[] = [
  { key: 'total', label: 'Total' },
  { key: 'math', label: 'Math' },
  { key: 'rw', label: 'R&W' },
  { key: 'all', label: 'All' },
];

export default function MockExams() {
  const now = useNow();
  const { anchor, extraTests, practiceFilter, setPracticeFilter, startMock } = useStore();
  const q = useService(getMockExams);
  const [loading, setLoading] = useState(false);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const cd = anchorCountdowns(anchor, countdownOffsets);

  if (q.loading || !q.data) return <div className="mx-auto max-w-[1000px] text-dim">Loading…</div>;

  const tests = [...q.data, ...extraTests];
  const best = Math.max(...tests.map((t) => t.total));
  const reversed = [...tests].reverse();
  const goal = 1450;

  const start = () => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      startMock();
      setLoading(false);
    }, 1200);
  };

  const card = 'rounded-[8px] border border-border bg-surface';

  return (
    <div className="mx-auto max-w-[1000px] animate-fade">
      <div className="mb-[18px] flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[26px] tracking-[-0.02em] text-heading">Mock Exams</h1>
          <p className="mt-1 text-sm text-dim">Full-length practice tests and your score history.</p>
          <div className="mt-2.5 flex flex-wrap items-center gap-4 text-[12.5px] text-dim">
            <span className="inline-flex items-center gap-1.5"><Icon name="clock" size={13} /> Next scheduled mock exam in <span className="disp text-text">{cdShort(cd.nextMock, now)}</span></span>
            <span className="text-faint">Recommended: 4 more mock exams before test day</span>
          </div>
        </div>
        <button onClick={start} disabled={loading} className="flex items-center gap-2 rounded-md bg-brand px-5 py-3 text-sm font-medium text-white transition-transform hover:-translate-y-px disabled:opacity-70" style={{ boxShadow: '0 6px 18px var(--brand-soft)' }}>
          <Icon name="plus" size={17} /> {loading ? 'Scoring your exam…' : 'Start new mock exam'}
          <span className="rounded-[5px] bg-white/20 px-2 py-0.5 text-[11.5px]">+300 XP</span>
        </button>
      </div>

      {/* chart */}
      <div className={`${card} mb-[18px] p-5`}>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
          <h3 className="disp text-[17px] text-heading">Score history</h3>
          <div className="flex gap-1.5 rounded-md border border-border-2 bg-surface-2 p-[3px]">
            {FILTERS.map((f) => (
              <button key={f.key} onClick={() => setPracticeFilter(f.key)} className="rounded-[7px] px-3.5 py-1.5 text-[12.5px] font-semibold" style={{ background: practiceFilter === f.key ? 'var(--brand)' : 'transparent', color: practiceFilter === f.key ? '#fff' : 'var(--dim)' }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <PracticeChart tests={tests} filter={practiceFilter} />
      </div>

      {/* past exams */}
      <div className="flex flex-col gap-2.5">
        {reversed.map((t, i) => {
          const prev = reversed[i + 1];
          const delta = prev ? t.total - prev.total : null;
          const open = openIdx === i;
          const bars = [
            { label: 'Total', value: t.total, maxV: 1600, color: 'var(--heading)' },
            { label: 'Math', value: t.math, maxV: 800, color: 'var(--st-prog)' },
            { label: 'Reading & Writing', value: t.rw, maxV: 800, color: 'var(--reward)' },
          ];
          return (
            <div key={i} className={card}>
              <div className="flex flex-wrap items-center gap-4 p-[15px_18px]">
                <div className="min-w-[70px]">
                  <div className="text-xs text-dim">2026</div>
                  <div className="text-sm font-semibold text-heading">{t.date}</div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="disp text-[26px] font-semibold text-heading">{t.total}</span>
                  {t.total === best && <span className="rounded-[5px] bg-reward-soft px-2 py-0.5 text-[11px] font-medium text-reward">Best</span>}
                </div>
                <div className="flex min-w-[180px] flex-1 gap-5">
                  <div><div className="text-[11px] text-dim">Math</div><div className="text-[15px] font-medium text-st-prog">{t.math}</div></div>
                  <div><div className="text-[11px] text-dim">Reading &amp; Writing</div><div className="text-[15px] font-medium text-reward">{t.rw}</div></div>
                </div>
                <button onClick={() => setOpenIdx(open ? null : i)} className="flex items-center gap-1 rounded-md border border-border bg-surface px-4 py-2 text-[13px] font-semibold text-brand hover:border-brand">
                  Review <Icon name="chevDown" size={14} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }} />
                </button>
              </div>
              {open && (
                <div className="animate-fade border-t border-border-2 p-[16px_18px]">
                  <div className="mb-3 flex flex-wrap items-center gap-4 text-[13px]">
                    <span className="text-dim">vs goal {goal}: <strong className="text-heading">{t.total - goal >= 0 ? '+' : ''}{t.total - goal}</strong></span>
                    {delta != null && (
                      <span className="inline-flex items-center gap-1" style={{ color: delta >= 0 ? 'var(--st-done)' : 'var(--st-over)' }}>
                        <Icon name={delta >= 0 ? 'arrowUp' : 'arrowDown'} size={13} /> {delta >= 0 ? '+' : ''}{delta} vs previous
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    {bars.map((b) => (
                      <div key={b.label}>
                        <div className="mb-1 flex justify-between text-[12px]"><span className="text-dim">{b.label}</span><span className="font-medium text-heading">{b.value} / {b.maxV}</span></div>
                        <div className="h-2 overflow-hidden rounded-md bg-surface-2"><div className="h-full rounded-md" style={{ width: `${(b.value / b.maxV) * 100}%`, background: b.color }} /></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
