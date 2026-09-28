import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../icons';
import { BadgeIcon, BridgeGhost, Donut, Rings, Sparkline } from '../components/art';
import { useCountUp, useNow, useService } from '../hooks';
import { getRankings, getScores } from '../services';
import { anchorCountdowns, anchorHomework, countdownOffsets, levels } from '../data';
import { useStore } from '../store';
import { cdBig, cdParts, cdShort, cdClock, greeting, homeworkDueText, homeworkStatus, homeworkDueUrgent, levelInfo, ringDefs, RING_COLORS, statusMeta } from '../utils';

const GREETING_LABEL = { morning: 'Good morning', afternoon: 'Good afternoon', evening: 'Good evening' };

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('');
}

function Skeleton() {
  const bar = 'bg-[linear-gradient(90deg,var(--surface-2),var(--border),var(--surface-2))] bg-[length:800px_100%] animate-[sbShimmer_1.3s_linear_infinite]';
  return (
    <div className="mx-auto max-w-[1160px]">
      <div className={`mb-5 h-8 w-64 rounded-lg ${bar}`} />
      <div className={`mb-5 h-[300px] rounded-lg ${bar}`} />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`h-24 rounded-lg ${bar}`} />
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { theme, xp, bridge, streak, anchor, homework, profile } = useStore();
  const firstName = profile.name.split(' ')[0];
  const now = useNow();
  const scoresQ = useService(getScores);
  const rankingsQ = useService(getRankings);
  const bestNum = useCountUp(scoresQ.data?.best ?? 0);
  const [hovered, setHovered] = useState<number | null>(null);

  if (scoresQ.loading || rankingsQ.loading || !scoresQ.data || !rankingsQ.data) return <Skeleton />;

  const scores = scoresQ.data;
  const rankings = rankingsQ.data;
  const cd = anchorCountdowns(anchor, countdownOffsets);
  const li = levelInfo(xp, levels);
  const dark = theme === 'dark';

  const pending = anchorHomework(anchor, homework)
    .map((h) => ({ ...h, status: homeworkStatus(h, now) }))
    .filter((h) => h.status !== 'completed')
    .slice(0, 3);

  const myIdx = rankings.findIndex((p) => p.me);
  const snippet = rankings.slice(Math.max(0, myIdx - 2), myIdx + 3);

  const legend = [
    { ring: 1, name: 'Math', dot: RING_COLORS.math, value: `${scores.math} / ${scores.mathTotal}`, gap: '60 to goal' },
    { ring: 2, name: 'Reading and Writing', dot: RING_COLORS.rw, value: `${scores.rw} / ${scores.rwTotal}`, gap: '50 to goal' },
    { ring: 0, name: 'Bridge', dot: RING_COLORS.bridge, value: `${Math.round(bridge)}% built`, gap: '1450 goal' },
  ];
  // defs order: 0 Bridge, 1 Math, 2 R&W — compact tooltip content on ring hover
  const ringInfo = [
    { name: 'Bridge', value: `${Math.round(bridge)}% built`, color: RING_COLORS.bridge },
    { name: 'Math', value: `${scores.math}/${scores.mathTotal}`, color: RING_COLORS.math },
    { name: 'R&W', value: `${scores.rw}/${scores.rwTotal}`, color: RING_COLORS.rw },
  ];

  const card = 'rounded-[8px] border border-border bg-surface';

  return (
    <div className="mx-auto max-w-[1160px] animate-fade">
      {/* greeting */}
      <div className="mb-[22px]">
        <h1 className="text-[26px] tracking-[-0.01em] text-heading">{GREETING_LABEL[greeting(now)]}, {firstName}</h1>
        <p className="mt-1.5 text-sm text-dim">
          Your bridge is <strong className="font-medium text-text">{Math.round(bridge)}% built</strong>. {cdParts(cd.testDay, now).d} days remain until test day.{' '}
          <span className="text-faint">·</span> Today's plan resets in <span className="text-text">{cdShort(cd.planReset, now)}</span>.
        </p>
      </div>

      {/* hero */}
      <div className={`${card} relative mb-[22px] overflow-hidden p-6`}>
        <div className="absolute right-[26px] top-[22px] text-right">
          <div className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-dim">Test day · Nov 7</div>
          <div className="disp mt-[3px] text-[19px] text-text">{cdBig(cd.testDay, now)}</div>
        </div>
        <div className="flex flex-wrap items-center gap-[34px]">
          <div className="relative w-[260px] flex-none">
            <Rings dark={dark} defs={ringDefs(scores, bridge)} hover={hovered} onHover={setHovered} />
            {hovered != null && (
              <div className="pointer-events-none absolute left-1/2 top-1 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1 text-[11.5px] font-medium shadow-soft">
                <span className="h-2 w-2 rounded-full" style={{ background: ringInfo[hovered].color }} />
                <span className="text-text">{ringInfo[hovered].name}</span>
                <span className="text-dim">{ringInfo[hovered].value}</span>
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="disp text-[38px] leading-none text-heading">{bestNum.toLocaleString()}</span>
              <span className="mt-[5px] text-[11px] tracking-[0.04em] text-dim">Best score</span>
            </div>
          </div>
          <div className="min-w-[240px] flex-1">
            <div className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-dim">Your Bridge</div>
            <div className="disp mt-1 text-[30px] text-text">{Math.round(bridge)}% built</div>
            <div className="mt-4 flex flex-col gap-px">
              {legend.map((r) => (
                <div
                  key={r.name}
                  onMouseEnter={() => setHovered(r.ring)}
                  onMouseLeave={() => setHovered(null)}
                  className="flex items-center gap-2.5 rounded-md px-2 py-1.5 transition-opacity"
                  style={{ opacity: hovered != null && hovered !== r.ring ? 0.4 : 1 }}
                >
                  <span className="h-2.5 w-2.5 flex-none rounded-full" style={{ background: r.dot }} />
                  <span className="text-[13px] font-medium text-text">{r.name}</span>
                  <span className="text-[13px] text-dim">· {r.value}</span>
                  <span className="ml-auto text-xs text-faint">{r.gap}</span>
                </div>
              ))}
            </div>
            <div className="mt-3.5 border-t border-border-2 pt-3 text-[12.5px] text-dim">
              Best <span className="text-text">{scores.best}</span> &nbsp;→&nbsp; Goal <span className="text-reward">{scores.goal}</span>
            </div>
          </div>
        </div>
      </div>

      {/* stat cards */}
      <div className="mb-[22px] grid grid-cols-2 gap-3.5 md:grid-cols-4">
        {[
          { label: 'Attendance', value: '92%', pct: 92, ring: 'var(--reward)' },
          { label: 'Lessons watched', value: '65%', pct: 65, ring: 'var(--st-prog)' },
          { label: 'Homework on time', value: '88%', pct: 88, ring: 'var(--st-done)' },
        ].map((s) => (
          <div key={s.label} className={`${card} flex items-center gap-4 p-[15px_18px]`}>
            <div className="relative h-[72px] w-[72px] flex-none">
              <Donut pct={s.pct} ring={s.ring} />
              <div className="absolute inset-0 grid place-items-center">
                <span className="disp text-base text-heading">{s.value}</span>
              </div>
            </div>
            <div className="text-[13px] leading-snug text-dim">{s.label}</div>
          </div>
        ))}
        <div className={`${card} flex items-center gap-4 p-[15px_18px]`}>
          <div className="disp text-4xl leading-none text-heading">#4</div>
          <div>
            <div className="text-[13px] text-dim">Weekly rank</div>
            <div className="mt-0.5 flex items-center gap-1 text-xs text-st-done">
              <Icon name="arrowUp" size={13} /> up 3 places
            </div>
          </div>
        </div>
      </div>

      {/* main grid */}
      <div className="grid items-start gap-[18px] lg:grid-cols-[1.6fr_1fr]">
        {/* left column */}
        <div className="flex min-w-0 flex-col gap-[18px]">
          {/* live session */}
          <div className={`${card} relative overflow-hidden p-5`}>
            <div className="absolute -right-6 -top-6 h-[120px] w-[120px] text-border opacity-60">
              <BridgeGhost size={120} />
            </div>
            <div className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-dim">
              <Icon name="playO" size={14} /> Today's live session · 18:00
            </div>
            <h3 className="disp mb-1 mt-2.5 text-xl text-heading">Linear Equations in Two Variables</h3>
            <p className="text-[13.5px] text-dim">Evening Group B · Mr. Daniel Reyes</p>
            <div className="mt-3 flex items-center gap-1.5 text-[13px] text-dim">
              <Icon name="clock" size={13} /> Live session starts in <span className="disp text-text">{cdClock(cd.live, now)}</span>
            </div>
            <div className="mt-[18px] flex flex-wrap gap-2.5">
              <Link to="/lessons" className="flex items-center gap-2 rounded-md bg-brand px-[18px] py-2.5 text-sm font-medium text-white hover:opacity-90">
                Join session <Icon name="arrowRight" size={16} />
              </Link>
              <Link to="/lessons" className="rounded-md border border-border px-[18px] py-2.5 text-sm font-medium text-text hover:border-brand hover:text-brand">
                View lesson
              </Link>
            </div>
          </div>

          {/* pending homework */}
          <div className={`${card} p-[18px]`}>
            <div className="mb-3.5 flex items-center justify-between">
              <h3 className="disp text-[17px] text-heading">Pending homework</h3>
              <Link to="/homework" className="flex items-center gap-0.5 text-[13px] font-semibold text-brand">
                View all <Icon name="chevRight" size={15} />
              </Link>
            </div>
            <div className="flex flex-col gap-2.5">
              {pending.map((hw) => {
                const m = statusMeta(hw.status);
                return (
                  <Link
                    key={hw.id}
                    to={`/homework/${hw.id}/solve`}
                    className="flex items-center gap-3 rounded-lg border border-border-2 bg-surface-2 p-3 hover:border-brand"
                  >
                    <span className="grid h-10 w-10 flex-none place-items-center rounded-md bg-surface-2 text-dim">
                      <Icon name={hw.subject === 'Math' ? 'math' : 'book'} size={19} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-text">{hw.title}</div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-[5px] px-2 py-0.5 text-[11px] font-semibold" style={{ background: m.bg, color: m.color }}>
                          <Icon name={m.icon} size={13} /> {m.label}
                        </span>
                        <span className="text-[11.5px]" style={{ color: homeworkDueUrgent(hw, hw.status, now) ? 'var(--st-over)' : 'var(--dim)', fontWeight: hw.status === 'overdue' ? 600 : 500 }}>
                          {homeworkDueText(hw, hw.status, now)}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-reward">+{hw.xp}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* rankings snippet */}
          <div className={`${card} p-[18px]`}>
            <div className="mb-3.5 flex items-center justify-between">
              <h3 className="disp text-[17px] text-heading">Rankings · Evening Group B</h3>
              <Link to="/rankings" className="flex items-center gap-0.5 text-[13px] font-semibold text-brand">
                Full rankings <Icon name="chevRight" size={15} />
              </Link>
            </div>
            <div className="flex flex-col gap-1.5">
              {snippet.map((p) => (
                <div key={p.rank} className="flex items-center gap-3 rounded-md px-3 py-2.5" style={{ background: p.me ? 'var(--brand-soft)' : 'transparent', border: `1px solid ${p.me ? 'var(--brand)' : 'transparent'}` }}>
                  <span className="disp w-6 text-[15px] font-semibold" style={{ color: p.me ? 'var(--brand)' : 'var(--heading)' }}>{p.rank}</span>
                  <span className="grid w-5 place-items-center" style={{ color: p.ch > 0 ? 'var(--st-done)' : p.ch < 0 ? 'var(--st-over)' : 'var(--faint)' }}>
                    {p.ch !== 0 ? <Icon name={p.ch > 0 ? 'arrowUp' : 'arrowDown'} size={13} /> : <span className="text-xs">–</span>}
                  </span>
                  <span className="grid h-8 w-8 flex-none place-items-center rounded-md border border-border bg-surface-2 text-[12px] font-medium text-text">{initials(p.name)}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13.5px] font-semibold text-text">{p.name}</div>
                    <div className="text-[11px] text-dim">Level {p.level}</div>
                  </div>
                  <span className="disp text-[13.5px] font-medium text-heading">{p.xp.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* right column */}
        <div className="flex min-w-0 flex-col gap-[18px]">
          {/* level progress */}
          <div className={`${card} p-[18px]`}>
            <div className="flex items-center justify-between">
              <h3 className="disp text-base text-heading">Level progress</h3>
              <span className="rounded-[5px] bg-reward-soft px-2.5 py-0.5 text-xs font-medium text-reward">{li.name}</span>
            </div>
            <div className="disp mt-2.5 text-[30px] font-semibold text-heading">
              {Math.round(xp).toLocaleString()} <span className="text-sm font-semibold text-dim">XP</span>
            </div>
            <div className="mt-2.5 h-2.5 overflow-hidden rounded-[5px] border border-border-2 bg-surface-2">
              <div className="h-full rounded-[5px] bg-reward transition-[width] duration-700" style={{ width: li.pctStr }} />
            </div>
            <div className="mt-1.5 flex justify-between text-[11.5px] text-dim">
              <span>{li.name}</span>
              <span><strong className="text-reward">{li.toNext}</strong> XP to {li.nextName}</span>
            </div>
          </div>

          {/* streak */}
          <div className={`${card} p-[18px]`}>
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 flex-none place-items-center rounded-lg border border-reward text-reward">
                <Icon name="brickLg" size={26} />
              </div>
              <div>
                <div className="disp text-[23px] leading-none text-heading">{streak}-day streak</div>
                <div className="mt-1 text-[12.5px] text-dim">Consecutive active days</div>
              </div>
            </div>
            <div className="mt-3.5 flex items-center gap-2 border-t border-border-2 pt-3 text-[12.5px] text-dim">
              <span className="text-reward"><Icon name="shield" size={16} /></span>
              <span><strong className="font-medium text-text">1 Streak Shield</strong> ready, protects one missed day.</span>
            </div>
          </div>

          {/* recently earned */}
          <div className={`${card} p-[18px]`}>
            <h3 className="disp mb-3 text-base text-heading">Recently earned</h3>
            <div className="flex items-center gap-3.5">
              <div className="h-[58px] w-[58px] flex-none">
                <BadgeIcon icon="math" earned />
              </div>
              <div>
                <div className="text-[15px] font-medium text-heading">Math Engineer</div>
                <div className="mt-0.5 text-[12.5px] text-dim">Awarded for 50 correct algebra questions.</div>
                <Link to="/profile" className="mt-1.5 flex items-center gap-0.5 text-xs font-semibold text-brand">
                  See all badges <Icon name="chevRight" size={13} />
                </Link>
              </div>
            </div>
          </div>

          {/* score trend */}
          <div className={`${card} p-[18px]`}>
            <div className="mb-1.5 flex items-center justify-between">
              <h3 className="disp text-base text-heading">Score trend</h3>
              <span className="flex items-center gap-0.5 text-xs font-medium text-st-done">
                <Icon name="arrowUp" size={13} /> +160
              </span>
            </div>
            <div className="mb-1.5 text-xs text-dim">Last 4 practice tests</div>
            <Sparkline />
            <Link to="/mock-exams" className="mt-2 flex items-center gap-0.5 text-xs font-semibold text-brand">
              View all scores <Icon name="chevRight" size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
