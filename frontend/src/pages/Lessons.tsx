import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../icons';
import { BridgeGhost, Stars } from '../components/art';
import { useNow } from '../hooks';
import { anchorCountdowns, countdownOffsets, lesson } from '../data';
import { useStore } from '../store';
import { cdShort, downloadBlob, makeLessonPdf } from '../utils';

const DURATION = 28 * 60 + 15; // 28:15
const RESUME = 12 * 60 + 40; // 12:40
const SPEEDS = [1, 1.25, 1.5, 2, 0.75];

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, '0')}`;
}

function Speaker({ muted }: { muted: boolean }) {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
      <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" stroke="none" />
      {muted ? <path d="M16 9l5 6M21 9l-5 6" /> : <><path d="M16 9.5a3.2 3.2 0 0 1 0 5" /><path d="M18.5 7a6 6 0 0 1 0 10" /></>}
    </svg>
  );
}

export default function Lessons() {
  const now = useNow();
  const { anchor } = useStore();
  const cd = anchorCountdowns(anchor, countdownOffsets);
  const card = 'rounded-[8px] border border-border bg-surface';

  // ---- player state (simulated; content optional, controls always work) ----
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(RESUME);
  const [speedIdx, setSpeedIdx] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setCur((c) => {
        const n = c + 0.25 * SPEEDS[speedIdx];
        if (n >= DURATION) {
          setPlaying(false);
          return DURATION;
        }
        return n;
      });
    }, 250);
    return () => clearInterval(id);
  }, [playing, speedIdx]);

  const toggle = () => setPlaying((p) => !p);
  const seekBy = (d: number) => setCur((c) => Math.max(0, Math.min(DURATION, c + d)));
  const seekTo = (frac: number) => setCur(Math.max(0, Math.min(DURATION, frac * DURATION)));
  const cycleSpeed = () => setSpeedIdx((i) => (i + 1) % SPEEDS.length);

  const openLesson = () => {
    playerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setPlaying(true);
  };
  const scrollTimeline = () => timelineRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const playChapter = (t: string) => {
    const [m, s] = t.split(':').map(Number);
    setCur(m * 60 + s);
    setPlaying(true);
    playerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  const download = (name: string, type: string) => downloadBlob(makeLessonPdf(name, type), `${name}.pdf`);

  const onKey = (e: React.KeyboardEvent) => {
    const k = e.key;
    if (k === ' ' || k === 'k' || k === 'K') { e.preventDefault(); toggle(); }
    else if (k === 'ArrowLeft') { e.preventDefault(); seekBy(-10); }
    else if (k === 'ArrowRight') { e.preventDefault(); seekBy(10); }
    else if (k === 'ArrowUp') { e.preventDefault(); setMuted(false); setVolume((v) => Math.min(1, +(v + 0.1).toFixed(2))); }
    else if (k === 'ArrowDown') { e.preventDefault(); setVolume((v) => Math.max(0, +(v - 0.1).toFixed(2))); }
    else if (k === 'm' || k === 'M') { e.preventDefault(); setMuted((m) => !m); }
  };

  const pct = (cur / DURATION) * 100;
  const markers = lesson.chapters.map((c) => {
    const [m, s] = c.t.split(':').map(Number);
    return ((m * 60 + s) / DURATION) * 100;
  });

  return (
    <div className="mx-auto max-w-[1080px] animate-fade">
      {/* hero */}
      <div className="relative mb-4 overflow-hidden rounded-[8px] p-[26px_28px]" style={{ background: 'linear-gradient(115deg,#16181D 0%,#26140f 60%,#3a1620 100%)' }}>
        <div className="absolute -bottom-6 right-[-10px] h-40 w-40 text-white/[.06]"><BridgeGhost size={160} /></div>
        <div className="relative z-[2] max-w-[640px]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55">{lesson.block} · {lesson.date}</div>
          <h1 className="disp mt-2 text-[27px] tracking-[-0.01em] text-white">{lesson.title}</h1>
          <div className="mt-4 text-xs text-white/60">How much I liked this lesson</div>
          <div className="mt-1.5"><Stars n={lesson.rating} size={20} /></div>
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-white/20 bg-white/10 px-3 py-1.5 text-[12.5px] text-white">
            <Icon name="clock" size={13} /> Next live session in <span className="disp">{cdShort(cd.nextSession, now)}</span>
          </div>
          <div className="mt-[18px] flex flex-wrap gap-2.5">
            <button onClick={openLesson} className="flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-medium text-[#16181D] hover:opacity-90">
              Open lesson <Icon name="arrowRight" size={16} />
            </button>
            <button onClick={scrollTimeline} className="rounded-md border border-white/25 bg-white/10 px-[18px] py-2.5 text-sm font-medium text-white hover:bg-white/[.18]">More lessons</button>
          </div>
        </div>
      </div>

      {/* timeline */}
      <div ref={timelineRef} className="mb-6 flex gap-3.5 overflow-x-auto px-0.5 pb-1 pt-1.5 scroll-mt-24">
        {lesson.timeline.map((t, i) => {
          const dot = t.state === 'done' ? 'var(--reward)' : t.state === 'current' ? 'var(--brand)' : 'var(--faint)';
          const badge =
            t.state === 'done'
              ? { label: 'Completed', color: 'var(--st-done)', bg: 'var(--st-done-bg)', icon: 'check' as const }
              : t.state === 'current'
                ? { label: 'In progress', color: 'var(--brand)', bg: 'var(--brand-soft)', icon: 'playO' as const }
                : { label: 'Locked', color: 'var(--faint)', bg: 'var(--surface-2)', icon: 'lock' as const };
          return (
            <div key={i} className="w-[230px] flex-none">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-3 w-3 flex-none rounded-full" style={{ background: dot }} />
                <span className="h-px flex-1 bg-border" />
              </div>
              <div className="min-h-[118px] rounded-[8px] border p-4" style={{ background: t.state === 'locked' ? 'var(--surface-2)' : 'var(--surface)', borderColor: t.state === 'current' ? 'var(--brand)' : 'var(--border)' }}>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-dim">{t.label}</span>
                  <span className="inline-flex items-center gap-1 rounded-[5px] px-1.5 py-0.5 text-[10px] font-semibold" style={{ color: badge.color, background: badge.bg }}>
                    <Icon name={badge.icon} size={14} /> {badge.label}
                  </span>
                </div>
                <div className="mt-2 text-[11.5px] text-dim">{t.date}</div>
                <div className="disp mt-1 text-[15px] leading-tight" style={{ color: t.state === 'locked' ? 'var(--faint)' : 'var(--heading)' }}>{t.title}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-dim">Current lesson</div>
      <div className="grid items-start gap-[18px] lg:grid-cols-[1.55fr_1fr]">
        {/* left */}
        <div className="flex min-w-0 flex-col gap-4">
          {/* player */}
          <div ref={playerRef} tabIndex={0} onKeyDown={onKey} role="group" aria-label="Lesson video player — Space play/pause, arrows seek and volume, M mute" className={`${card} overflow-hidden scroll-mt-24 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand`}>
            <div className="relative aspect-video cursor-pointer bg-gradient-to-br from-[#16181D] via-[#2a1a1e] to-[#3a1620]" onClick={toggle}>
              <div className="absolute inset-0 opacity-[.13]"><BridgeGhost size={400} /></div>
              {!playing && (
                <div className="absolute left-1/2 top-1/2 z-10 grid h-[70px] w-[70px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-brand shadow-[0_8px_24px_rgba(0,0,0,.3)] transition-transform hover:scale-105">
                  <Icon name="play" size={22} />
                </div>
              )}
              {playing && (
                <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/30 px-3 py-1 text-xs font-medium text-white/90">Playing · {fmt(cur)}</div>
              )}
              <div className="absolute left-3.5 top-3.5 z-10 rounded-lg bg-[rgba(10,12,30,.5)] px-2.5 py-1 text-xs font-semibold text-white">Resume at 12:40</div>
              <button onClick={(e) => { e.stopPropagation(); cycleSpeed(); }} className="absolute right-3.5 top-3.5 z-10 rounded-lg border border-white/25 bg-[rgba(10,12,30,.5)] px-2.5 py-1 text-xs font-medium text-white">{SPEEDS[speedIdx]}×</button>
            </div>

            {/* scrubber */}
            <div className="px-[18px] pt-3.5">
              <div className="relative h-[7px] cursor-pointer rounded-[5px] border border-border-2 bg-surface-2" onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); seekTo((e.clientX - r.left) / r.width); }}>
                <div className="absolute inset-y-0 left-0 rounded-[5px] bg-brand" style={{ width: `${pct}%` }} />
                {markers.map((left, i) => (
                  <span key={i} className="absolute top-1/2 h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-reward bg-surface" style={{ left: `${left}%` }} />
                ))}
              </div>
            </div>

            {/* controls */}
            <div className="flex flex-wrap items-center gap-3 px-[18px] py-3">
              <button onClick={toggle} className="grid h-9 w-9 place-items-center rounded-md bg-brand text-white hover:opacity-90" title={playing ? 'Pause' : 'Play'}>
                <Icon name={playing ? 'pause' : 'play'} size={16} />
              </button>
              <button onClick={() => seekBy(-10)} className="flex items-center gap-0.5 rounded-md border border-border px-2.5 py-2 text-[12px] font-medium text-dim hover:border-brand hover:text-brand" title="Back 10s">
                <Icon name="chevLeft" size={14} /> 10
              </button>
              <button onClick={() => seekBy(10)} className="flex items-center gap-0.5 rounded-md border border-border px-2.5 py-2 text-[12px] font-medium text-dim hover:border-brand hover:text-brand" title="Forward 10s">
                10 <Icon name="chevRight" size={14} />
              </button>
              <div className="flex items-center gap-2">
                <button onClick={() => setMuted((m) => !m)} className="grid h-8 w-8 place-items-center rounded-md text-dim hover:text-brand" title={muted ? 'Unmute' : 'Mute'}>
                  <Speaker muted={muted || volume === 0} />
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={muted ? 0 : volume}
                  onChange={(e) => { setVolume(Number(e.target.value)); setMuted(false); }}
                  className="h-1 w-20 cursor-pointer accent-[var(--brand)]"
                  aria-label="Volume"
                />
              </div>
              <div className="ml-auto flex items-center gap-3 text-xs text-dim">
                <span className="disp tabular-nums">{fmt(cur)} / {fmt(DURATION)}</span>
                <button onClick={cycleSpeed} className="rounded-md border border-border px-2 py-1 font-medium hover:border-brand hover:text-brand">{SPEEDS[speedIdx]}×</button>
              </div>
            </div>
            <div className="border-t border-border-2 px-[18px] py-2 text-[11px] text-faint">
              Keyboard: <span className="text-dim">Space</span> play · <span className="text-dim">← / →</span> 10s · <span className="text-dim">↑ / ↓</span> volume · <span className="text-dim">M</span> mute
            </div>
          </div>

          <div className={`${card} flex flex-wrap items-center gap-4 p-[18px_20px]`}>
            <div className="min-w-[180px] flex-1">
              <div className="disp text-[17px] text-heading">Practice this lesson</div>
              <div className="mt-0.5 text-[13px] text-dim">20 problems. Earn <strong className="font-medium text-reward">+100 XP</strong> and a new bridge section.</div>
            </div>
            <Link to="/homework/hw1/solve" className="flex items-center gap-2 whitespace-nowrap rounded-md bg-brand px-[18px] py-2.5 text-sm font-medium text-white hover:opacity-90">
              Go to homework <Icon name="arrowRight" size={16} />
            </Link>
          </div>

          <div className={`${card} p-[18px]`}>
            <h3 className="disp mb-2.5 text-base text-heading">Lesson notes</h3>
            <ul className="list-disc pl-[18px] text-sm leading-[1.9] text-text">
              <li>A linear equation in two variables has the form <strong>ax + by = c</strong>.</li>
              <li>Its graph is always a straight line; every point on the line is a solution.</li>
              <li>Two equations form a <strong>system</strong> — the solution is where the lines cross.</li>
              <li>Systems can have one solution, none (parallel), or infinitely many (identical lines).</li>
            </ul>
          </div>

          <div className={`${card} p-[18px]`}>
            <h3 className="disp mb-3 text-base text-heading">Downloadable materials</h3>
            <div className="flex flex-col gap-2.5">
              {lesson.materials.map((mat) => (
                <button key={mat.name} onClick={() => download(mat.name, mat.type)} className="flex items-center gap-3 rounded-md border border-border-2 bg-surface-2 p-3 text-left hover:border-brand">
                  <span className="grid h-[38px] w-[38px] flex-none place-items-center rounded-md bg-brand-soft text-brand"><Icon name="doc" size={20} /></span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13.5px] font-semibold text-text">{mat.name}</div>
                    <div className="text-[11.5px] text-dim">{mat.type}</div>
                  </div>
                  <span className="text-brand"><Icon name="download" size={17} /></span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* right */}
        <div className="flex min-w-0 flex-col gap-4">
          <div className={`${card} p-[18px]`}>
            <h3 className="disp mb-3 text-base text-heading">Chapters</h3>
            <div className="flex flex-col gap-1">
              {lesson.chapters.map((c) => {
                const isCur = c.state === 'current';
                const done = c.state === 'done';
                return (
                  <button key={c.t} onClick={() => playChapter(c.t)} className="flex w-full items-center gap-3 rounded-md p-[10px_11px] text-left hover:bg-surface-2" style={{ background: isCur ? 'var(--brand-soft)' : 'transparent' }}>
                    <span className="grid h-[26px] w-[26px] flex-none place-items-center rounded-lg" style={{ background: done ? 'var(--st-done)' : isCur ? 'var(--brand)' : 'var(--surface-2)', color: done || isCur ? '#fff' : 'var(--faint)' }}>
                      <Icon name={done ? 'check' : isCur ? 'playO' : 'lock'} size={13} />
                    </span>
                    <span className="flex-1 text-[13.5px]" style={{ color: isCur ? 'var(--brand)' : done ? 'var(--text)' : 'var(--dim)', fontWeight: isCur ? 700 : 500 }}>{c.label}</span>
                    <span className="text-[11.5px] text-faint">{c.t}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className={`${card} p-[18px]`}>
            <h3 className="disp mb-3 text-base text-heading">Up next</h3>
            <div className="flex flex-col gap-2.5">
              {lesson.upnext.map((u) => {
                const locked = u.state === 'locked';
                return (
                  <div key={u.title} className="flex items-center gap-3 rounded-md border border-border-2 p-[11px]">
                    <span className="grid h-[34px] w-[34px] flex-none place-items-center rounded-md" style={{ background: locked ? 'var(--surface-2)' : 'var(--brand-soft)', color: locked ? 'var(--faint)' : 'var(--brand)' }}>
                      <Icon name={locked ? 'lock' : 'playO'} size={16} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13.5px] font-semibold" style={{ color: locked ? 'var(--dim)' : 'var(--text)' }}>{u.title}</div>
                      <div className="text-[11.5px] text-dim">{u.dur}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
