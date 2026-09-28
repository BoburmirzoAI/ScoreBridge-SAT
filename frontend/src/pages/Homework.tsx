import { useNavigate } from 'react-router-dom';
import { Icon } from '../icons';
import { Bo } from '../components/art';
import { useNow } from '../hooks';
import { anchorHomework } from '../data';
import { useStore } from '../store';
import { cdShort, homeworkAction, homeworkDueText, homeworkDueUrgent, homeworkStatus, statusMeta, type HomeworkLike } from '../utils';
import type { HomeworkStatus } from '../data/types';

const FILTERS: { label: string; st: HomeworkStatus | null }[] = [
  { label: 'All', st: null },
  { label: 'Not started', st: 'notstarted' },
  { label: 'In progress', st: 'inprogress' },
  { label: 'Overdue', st: 'overdue' },
  { label: 'Completed', st: 'completed' },
];

export default function Homework() {
  const navigate = useNavigate();
  const now = useNow();
  const { anchor, homework, hwFilter, setHwFilter } = useStore();

  const list = anchorHomework(anchor, homework).map((h) => ({ ...h, status: homeworkStatus(h, now) }));
  const counts = (st: HomeworkStatus | null) => (st ? list.filter((h) => h.status === st).length : list.length);
  const active = FILTERS.find((f) => f.label === hwFilter) ?? FILTERS[0];
  const shown = active.st ? list.filter((h) => h.status === active.st) : list;

  const nearest = list
    .filter((h) => h.status !== 'completed' && h.due - now >= 0)
    .sort((a, b) => a.due - b.due)[0];

  const onAction = (id: string, status: HomeworkStatus) =>
    navigate(status === 'completed' ? `/homework/${id}/result` : `/homework/${id}/solve`);

  return (
    <div className="mx-auto max-w-[1000px] animate-fade">
      <div className="mb-4">
        <h1 className="text-[26px] tracking-[-0.02em] text-heading">Homework</h1>
        <p className="mt-1 text-sm text-dim">Finish tasks to earn XP and add pieces to your bridge.</p>
      </div>

      {nearest && (
        <div className="mb-4 flex items-center gap-2 rounded-[8px] border border-border bg-surface px-4 py-2.5 text-[13px] text-dim">
          <Icon name="clock" size={13} />
          <span>
            Next deadline: <strong className="font-medium text-text">{nearest.title}</strong> ·{' '}
            <span className="disp text-st-over">{cdShort(nearest.due, now)}</span>
          </span>
        </div>
      )}

      {/* filter tabs */}
      <div className="mb-[18px] flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const isActive = f.label === hwFilter;
          return (
            <button
              key={f.label}
              onClick={() => setHwFilter(f.label)}
              className={`flex items-center gap-1.5 rounded-md border px-[15px] py-2 text-[13.5px] font-semibold transition-colors ${
                isActive ? 'border-brand bg-brand text-white' : 'border-border bg-surface text-text hover:border-brand'
              }`}
            >
              {f.label}
              <span
                className="grid h-5 min-w-[20px] place-items-center rounded-[5px] px-1.5 text-[11.5px] font-medium"
                style={{ background: isActive ? 'rgba(255,255,255,.22)' : 'var(--surface-2)', color: isActive ? '#fff' : 'var(--dim)' }}
              >
                {counts(f.st)}
              </span>
            </button>
          );
        })}
      </div>

      {shown.length === 0 ? (
        <div className="rounded-[8px] border border-border bg-surface px-5 py-16 text-center">
          <div className="mx-auto mb-3 h-[90px] w-[90px]">
            <Bo size={90} />
          </div>
          <h3 className="disp text-[19px] text-heading">Nothing here right now</h3>
          <p className="mt-1.5 text-sm text-dim">No homework matches this filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3.5">
          {shown.map((hw) => {
            const m = statusMeta(hw.status);
            const like: HomeworkLike = hw;
            const showBar = hw.status !== 'notstarted';
            const pct = Math.round((hw.done / hw.total) * 100);
            return (
              <div key={hw.id} className="flex flex-col gap-3 rounded-[8px] border border-border bg-surface p-[17px] transition-transform hover:-translate-y-0.5 hover:shadow-soft">
                <div className="flex items-start gap-3">
                  <span className="grid h-[42px] w-[42px] flex-none place-items-center rounded-md bg-surface-2 text-dim">
                    <Icon name={hw.subject === 'Math' ? 'math' : 'book'} size={19} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[15px] font-semibold leading-tight text-heading">{hw.title}</div>
                    <div className="mt-0.5 text-xs text-dim">{hw.subject === 'Math' ? 'Math' : 'Reading & Writing'}</div>
                  </div>
                  <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-[5px] px-2.5 py-1 text-[11px] font-semibold" style={{ background: m.bg, color: m.color }}>
                    <Icon name={m.icon} size={13} /> {m.label}
                  </span>
                </div>

                {showBar && (
                  <div>
                    <div className="mb-1.5 flex justify-between text-[11.5px] text-dim">
                      <span>Progress</span>
                      <span className="font-semibold text-text">{hw.done} / {hw.total}</span>
                    </div>
                    <div className="h-[7px] overflow-hidden rounded-[5px] border border-border-2 bg-surface-2">
                      <div className="h-full rounded-[5px] transition-[width] duration-500" style={{ width: `${pct}%`, background: hw.status === 'completed' ? 'var(--st-done)' : 'var(--dim)' }} />
                    </div>
                  </div>
                )}

                <div className="mt-0.5 flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs" style={{ color: homeworkDueUrgent(like, hw.status, now) ? 'var(--st-over)' : 'var(--dim)', fontWeight: hw.status === 'overdue' ? 600 : 500 }}>
                      {homeworkDueText(like, hw.status, now)}
                    </span>
                    <span className="text-[11.5px] font-medium text-reward">+{hw.xp} XP</span>
                  </div>
                  <button
                    onClick={() => onAction(hw.id, hw.status)}
                    className="rounded-md px-[18px] py-2.5 text-[13.5px] font-medium transition-transform hover:-translate-y-px"
                    style={{
                      background: 'var(--surface)',
                      color: hw.status === 'overdue' ? 'var(--brand)' : 'var(--text)',
                      border: `1px solid ${hw.status === 'overdue' ? 'var(--brand)' : 'var(--border)'}`,
                    }}
                  >
                    {homeworkAction(hw.status)}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
