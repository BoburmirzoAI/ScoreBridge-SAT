import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, type IconName } from '../icons';
import { BadgeIcon, Rings } from '../components/art';
import { Avatar } from '../components/Avatar';
import { useCountUp, useNow, useService } from '../hooks';
import { getBadges, getScores } from '../services';
import { anchorCountdowns, countdownOffsets, levels, student } from '../data';
import { useStore } from '../store';
import { cdShort, initialsOf, levelInfo, ringDefs, RING_COLORS } from '../utils';

const STATS: { label: string; value: string; icon: IconName; to: string }[] = [
  { label: 'Lessons completed', value: '34', icon: 'lessons', to: '/lessons' },
  { label: 'Homework on time', value: '88%', icon: 'homework', to: '/homework' },
  { label: 'Attendance', value: '92%', icon: 'attendance', to: '/attendance' },
  { label: 'Correct answers', value: '1,204', icon: 'check', to: '/mock-exams' },
];

export default function Profile() {
  const navigate = useNavigate();
  const now = useNow();
  const { theme, xp, bridge, streak, anchor, profile, updateProfile } = useStore();
  const scoresQ = useService(getScores);
  const badgesQ = useService(getBadges);
  const cd = anchorCountdowns(anchor, countdownOffsets);
  const li = levelInfo(xp, levels);
  const bestNum = useCountUp(scoresQ.data?.best ?? 0);
  const [hovered, setHovered] = useState<number | null>(null);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile);
  const fileRef = useRef<HTMLInputElement>(null);

  if (scoresQ.loading || badgesQ.loading || !scoresQ.data || !badgesQ.data) return <div className="mx-auto max-w-[1000px] text-dim">Loading…</div>;

  const scores = scoresQ.data;
  const badges = badgesQ.data;
  const earned = badges.filter((b) => b.earned).length;
  const card = 'rounded-[8px] border border-border bg-surface';

  const legend = [
    { ring: 1, name: 'Math', dot: RING_COLORS.math, value: `${scores.math} / ${scores.mathTotal}`, gap: '60 to goal' },
    { ring: 2, name: 'Reading and Writing', dot: RING_COLORS.rw, value: `${scores.rw} / ${scores.rwTotal}`, gap: '50 to goal' },
    { ring: 0, name: 'Bridge', dot: RING_COLORS.bridge, value: `${Math.round(bridge)}% built`, gap: '1450 goal' },
  ];
  const ringInfo = [
    { name: 'Bridge', value: `${Math.round(bridge)}% built`, color: RING_COLORS.bridge },
    { name: 'Math', value: `${scores.math}/${scores.mathTotal}`, color: RING_COLORS.math },
    { name: 'R&W', value: `${scores.rw}/${scores.rwTotal}`, color: RING_COLORS.rw },
  ];

  const openEdit = () => {
    setForm(profile);
    setEditing(true);
  };
  const save = () => {
    updateProfile({ ...form, name: form.name.trim() || profile.name });
    setEditing(false);
  };
  const pickPhoto = () => fileRef.current?.click();
  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      const url = r.result as string;
      if (editing) setForm((fm) => ({ ...fm, avatar: url }));
      else updateProfile({ avatar: url });
    };
    r.readAsDataURL(f);
    e.target.value = '';
  };

  const info = [
    { label: 'Email', value: profile.email },
    { label: 'Goal score', value: String(scores.goal) },
    { label: 'Member since', value: student.joined },
    { label: 'Group', value: student.group },
  ];

  return (
    <div className="mx-auto max-w-[1000px] animate-fade">
      {/* identity */}
      <div className={`${card} mb-[18px] p-6`}>
        <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
        {!editing ? (
          <div className="flex flex-wrap items-start gap-[22px]">
            <button onClick={pickPhoto} title="Change photo" className="group relative h-[72px] w-[72px] flex-none rounded-[12px]">
              <Avatar size={72} radius={12} />
              <span className="absolute inset-0 grid place-items-center rounded-[12px] bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100">
                <Icon name="download" size={18} style={{ transform: 'rotate(180deg)' }} />
              </span>
            </button>
            <div className="min-w-[220px] flex-1">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-[26px] tracking-[-0.02em] text-heading">{profile.name}</h1>
                  <p className="mt-1 text-sm text-dim">{student.group} · joined {student.joined}</p>
                </div>
                <button onClick={openEdit} className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-3.5 py-2 text-[13px] font-semibold text-text hover:border-brand hover:text-brand">
                  <Icon name="settings" size={15} /> Edit profile
                </button>
              </div>
              <p className="mt-2.5 max-w-[560px] text-[13.5px] leading-relaxed text-text">{profile.bio}</p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-[5px] bg-reward-soft px-3 py-1.5 text-[13px] font-medium text-reward">Level {li.name}</span>
                <span className="inline-flex items-center gap-1.5 rounded-[5px] bg-reward-soft px-3 py-1.5 text-[13px] font-medium text-reward"><Icon name="spark" size={14} />{Math.round(xp).toLocaleString()} XP</span>
                <span className="inline-flex items-center gap-1.5 rounded-[5px] border border-border bg-surface-2 px-3 py-1.5 text-[13px] font-medium text-text"><Icon name="brick" size={14} />{streak}-day streak</span>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2 border-t border-border-2 pt-4 sm:grid-cols-2">
                {info.map((r) => (
                  <div key={r.label} className="flex items-center justify-between gap-3 text-[13px]">
                    <span className="text-dim">{r.label}</span>
                    <span className="truncate font-medium text-text">{r.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-[13px] text-dim">
                <Icon name="clock" size={13} /> Practice today to keep your {streak}-day streak: <span className="disp text-st-over">{cdShort(cd.streak, now)} left</span>
              </div>
            </div>
          </div>
        ) : (
          /* edit form */
          <div className="flex flex-wrap gap-[22px]">
            <div className="flex flex-col items-center gap-2">
              <button onClick={pickPhoto} title="Change photo" className="group relative h-[72px] w-[72px] rounded-[12px]" style={{ boxShadow: '0 0 0 1.5px var(--brand)' }}>
                {form.avatar ? (
                  <img src={form.avatar} alt="preview" className="h-[72px] w-[72px] rounded-[12px] object-cover" />
                ) : (
                  <div className="disp grid h-[72px] w-[72px] place-items-center rounded-[12px] bg-surface-2 text-[22px] font-medium text-text">{initialsOf(form.name)}</div>
                )}
                <span className="absolute inset-0 grid place-items-center rounded-[12px] bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <Icon name="download" size={18} style={{ transform: 'rotate(180deg)' }} />
                </span>
              </button>
              <span className="text-[11px] text-dim">Tap photo to change</span>
              {form.avatar && (
                <button onClick={() => setForm((fm) => ({ ...fm, avatar: null }))} className="text-[11px] text-dim hover:text-st-over">Remove</button>
              )}
            </div>
            <div className="min-w-[240px] flex-1">
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.06em] text-dim">Name</label>
              <input value={form.name} onChange={(e) => setForm((fm) => ({ ...fm, name: e.target.value }))} className="mb-3 w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm text-text outline-none focus:border-brand" />
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.06em] text-dim">Email</label>
              <input value={form.email} onChange={(e) => setForm((fm) => ({ ...fm, email: e.target.value }))} className="mb-3 w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm text-text outline-none focus:border-brand" />
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.06em] text-dim">Bio</label>
              <textarea value={form.bio} onChange={(e) => setForm((fm) => ({ ...fm, bio: e.target.value }))} rows={3} className="mb-3 w-full resize-none rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm text-text outline-none focus:border-brand" />
              <div className="flex gap-2.5">
                <button onClick={save} className="rounded-md bg-brand px-5 py-2.5 text-sm font-medium text-white hover:opacity-90">Save changes</button>
                <button onClick={() => setEditing(false)} className="rounded-md border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-text">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* bridge */}
      <div className={`${card} mb-[18px] p-6`}>
        <div className="flex flex-wrap items-center gap-[34px]">
          <div className="relative w-[240px] flex-none">
            <Rings dark={theme === 'dark'} defs={ringDefs(scores, bridge)} hover={hovered} onHover={setHovered} />
            {hovered != null && (
              <div className="pointer-events-none absolute left-1/2 top-1 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1 text-[11.5px] font-medium shadow-soft">
                <span className="h-2 w-2 rounded-full" style={{ background: ringInfo[hovered].color }} />
                <span className="text-text">{ringInfo[hovered].name}</span>
                <span className="text-dim">{ringInfo[hovered].value}</span>
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="disp text-[36px] leading-none text-heading">{bestNum.toLocaleString()}</span>
              <span className="mt-[5px] text-[11px] tracking-[0.04em] text-dim">Best score</span>
            </div>
          </div>
          <div className="min-w-[240px] flex-1">
            <div className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-dim">Your Bridge</div>
            <div className="disp mt-1 text-[28px] text-text">{Math.round(bridge)}% built</div>
            <div className="mt-3.5 flex flex-col gap-px">
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
          </div>
        </div>
      </div>

      {/* stats (clickable) */}
      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {STATS.map((s) => (
          <button key={s.label} onClick={() => navigate(s.to)} className={`${card} flex items-center gap-3.5 p-[16px_18px] text-left transition-transform hover:-translate-y-0.5 hover:border-brand`}>
            <span className="grid h-10 w-10 place-items-center rounded-md bg-surface-2 text-dim"><Icon name={s.icon} size={18} /></span>
            <div>
              <div className="disp text-[22px] font-semibold text-heading">{s.value}</div>
              <div className="text-xs text-dim">{s.label}</div>
            </div>
          </button>
        ))}
      </div>

      {/* badges */}
      <div className="mb-3.5 flex items-center justify-between">
        <h3 className="disp text-lg text-heading">Badges</h3>
        <span className="text-[13px] text-dim"><strong className="text-reward">{earned}</strong> of 8 earned</span>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
        {badges.map((b) => (
          <div key={b.id} className={`${card} flex items-center gap-3.5 p-4`}>
            <div className="h-14 w-14 flex-none"><BadgeIcon icon={b.icon} earned={b.earned} prog={b.prog} size={56} /></div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium" style={{ color: b.earned ? 'var(--heading)' : 'var(--dim)' }}>{b.name}</div>
              <div className="mt-0.5 text-[11.5px] leading-tight text-dim">{b.desc}</div>
              {!b.earned && b.prog != null && <div className="mt-1.5 text-[11px] font-medium text-brand">{Math.round(b.prog * 100)}% there</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
