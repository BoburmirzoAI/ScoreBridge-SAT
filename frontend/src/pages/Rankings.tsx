import { Icon } from '../icons';
import { Trophy } from '../components/art';
import { useNow, useService } from '../hooks';
import { getRankings } from '../services';
import { anchorCountdowns, countdownOffsets } from '../data';
import { useStore } from '../store';
import { cdBig } from '../utils';

const GROUPS = ['All groups', 'Evening Group A', 'Evening Group B'];
const TABS = ['This week', 'All time'];

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('');
}

export default function Rankings() {
  const now = useNow();
  const { anchor, leaderGroup, leaderTab, setLeaderGroup, setLeaderTab } = useStore();
  const q = useService(getRankings);
  const cd = anchorCountdowns(anchor, countdownOffsets);

  if (q.loading || !q.data) return <div className="mx-auto max-w-[940px] animate-pulse text-dim">Loading…</div>;

  const raw = q.data;
  const list = (leaderGroup === 'All groups' ? raw : raw.filter((p) => p.group === leaderGroup)).map((p, i) => ({ ...p, dispRank: i + 1 }));
  const maxXp = Math.max(...list.map((p) => p.xp), 1);
  const me = list.find((p) => p.me);
  const top3 = list.slice(0, 3);
  const rings = ['var(--reward)', 'rgba(255,255,255,.5)', '#C08A5A'];

  return (
    <div className="mx-auto max-w-[940px] animate-fade">
      {/* filters */}
      <div className="mb-4 flex flex-wrap items-center justify-end gap-2.5">
        <div className="flex flex-wrap gap-2">
          {GROUPS.map((g) => {
            const active = leaderGroup === g;
            return (
              <button key={g} onClick={() => setLeaderGroup(g)} className="whitespace-nowrap rounded-[5px] border px-3.5 py-1.5 text-[12.5px] font-medium" style={{ borderColor: active ? 'var(--brand)' : 'var(--border)', background: active ? 'var(--surface)' : 'transparent', color: active ? 'var(--brand)' : 'var(--dim)' }}>
                {g}
              </button>
            );
          })}
        </div>
        <div className="flex gap-1.5 rounded-md border border-border bg-surface p-1">
          {TABS.map((t) => {
            const active = leaderTab === t;
            return (
              <button key={t} onClick={() => setLeaderTab(t)} className="whitespace-nowrap rounded-[5px] px-3.5 py-1.5 text-[12.5px] font-medium" style={{ background: active ? 'var(--brand)' : 'transparent', color: active ? '#fff' : 'var(--dim)' }}>
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* hero */}
      <div className="relative mb-[18px] overflow-hidden rounded-[8px] p-[26px_28px]" style={{ background: 'linear-gradient(115deg,#16181D 0%,#3a1620 52%,#7A1F2B 100%)' }}>
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 opacity-95"><Trophy size={150} /></div>
        <div className="relative z-[2]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60">Evening Group B</div>
          <h1 className="disp mt-1.5 text-[32px] tracking-[-0.01em] text-white">Rankings</h1>
          <div className="mt-1.5 text-[13px] text-white/70">Weekly and all-time rankings across your group.</div>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-white/[.18] bg-white/10 px-3 py-1.5 text-[12.5px] text-white">
            <Icon name="clock" size={13} /> Weekly ranking closes in <span className="disp">{cdBig(cd.weeklyClose, now)}</span>
          </div>
        </div>
        <div className="relative z-[2] mt-6 flex flex-wrap gap-[22px]">
          {top3.map((p, i) => (
            <div key={p.rank} className="flex w-[100px] flex-col items-center">
              <div className="disp grid h-[62px] w-[62px] place-items-center rounded-full bg-white/10 text-[18px] text-white" style={{ boxShadow: `0 0 0 2px ${rings[i]}` }}>{initials(p.name)}</div>
              <div className="mt-2 max-w-[100px] truncate text-center text-xs font-medium text-white">{p.name}</div>
              <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-0.5">
                <span className="disp text-[13px] text-[#16181D]">{p.xp.toLocaleString()}</span>
                <span className="text-reward"><Icon name="star" size={13} /></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* pager */}
      <div className="my-4 flex flex-col items-center gap-1">
        <div className="flex items-center gap-3 text-faint">
          <Icon name="chevLeft" size={16} />
          <span className="disp grid h-[30px] w-[30px] place-items-center rounded-full bg-reward text-[13px] text-[#16181D]">1</span>
          <Icon name="chevRight" size={16} />
        </div>
        <div className="text-xs text-dim">1 – {list.length} of {list.length}</div>
      </div>

      {/* rows */}
      <div className="overflow-hidden rounded-[8px] border border-border bg-surface">
        {list.map((p) => (
          <div key={p.rank} className="flex items-center gap-4 border-b border-border-2 px-[18px] py-3.5" style={{ background: p.me ? 'var(--surface-2)' : 'var(--surface)' }}>
            <span className="disp grid h-[30px] w-[30px] flex-none place-items-center rounded-full border border-border text-[13px]" style={{ background: p.dispRank === 1 ? 'var(--reward)' : p.dispRank <= 3 ? 'var(--dim)' : 'transparent', color: p.dispRank <= 3 ? '#fff' : 'var(--dim)' }}>{p.dispRank}</span>
            <span className="grid h-[38px] w-[38px] flex-none place-items-center rounded-full bg-surface-2 text-[13px] font-medium text-text" style={{ boxShadow: p.me ? '0 0 0 1.5px var(--brand)' : 'inset 0 0 0 1px var(--border)' }}>{initials(p.name)}</span>
            <div className="w-[190px] flex-none">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-medium" style={{ color: p.me ? 'var(--brand)' : 'var(--heading)' }}>{p.name}</span>
                {p.me && <span className="flex-none rounded-[5px] bg-st-done px-1.5 py-0.5 text-[10px] font-semibold text-white">You</span>}
              </div>
              <div className="text-[11.5px] text-dim">Level {p.level}</div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[11px] text-faint">Score</span>
                <span className="inline-flex items-center gap-1.5"><span className="disp text-sm text-heading">{p.xp.toLocaleString()}</span><span className="text-reward"><Icon name="star" size={13} /></span></span>
              </div>
              <div className="h-2 overflow-hidden rounded-md bg-surface-2"><div className="h-full rounded-md transition-[width] duration-500" style={{ width: `${Math.round((p.xp / maxXp) * 100)}%`, background: p.me ? 'var(--brand)' : 'var(--reward)' }} /></div>
            </div>
          </div>
        ))}
      </div>

      {/* sticky me */}
      {me && (
        <div className="sticky bottom-0 -mx-4 mt-4 border-t border-border px-4 py-3.5 backdrop-blur-md sm:-mx-[26px] sm:px-[26px]" style={{ background: 'color-mix(in srgb, var(--bg) 90%, transparent)' }}>
          <div className="mx-auto flex max-w-[940px] items-center gap-4 rounded-[8px] border border-brand bg-surface px-[18px] py-3">
            <span className="disp grid h-[30px] w-[30px] flex-none place-items-center rounded-full bg-brand text-[13px] text-white">{me.dispRank}</span>
            <span className="grid h-[38px] w-[38px] flex-none place-items-center rounded-full bg-surface-2 text-[13px] font-medium text-text" style={{ boxShadow: '0 0 0 1.5px var(--brand)' }}>{initials(me.name)}</span>
            <div className="w-[190px] flex-none">
              <div className="flex items-center gap-2"><span className="text-sm font-medium text-brand">{me.name}</span><span className="rounded-[5px] bg-st-done px-1.5 py-0.5 text-[10px] font-semibold text-white">You</span></div>
              <div className="text-[11.5px] text-dim">Up 3 places this week</div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1.5 flex items-center justify-between"><span className="text-[11px] text-faint">Score</span><span className="inline-flex items-center gap-1.5"><span className="disp text-sm text-heading">{me.xp.toLocaleString()}</span><span className="text-reward"><Icon name="star" size={13} /></span></span></div>
              <div className="h-2 overflow-hidden rounded-md bg-surface-2"><div className="h-full rounded-md bg-brand" style={{ width: `${Math.round((me.xp / maxXp) * 100)}%` }} /></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
