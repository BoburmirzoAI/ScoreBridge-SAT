import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, type IconName } from '../icons';
import { lesson } from '../data';
import { useStore } from '../store';

interface Result {
  label: string;
  sub: string;
  to: string;
  icon: IconName;
}

const PAGES: Result[] = [
  { label: 'Dashboard', sub: 'Page', to: '/', icon: 'dashboard' },
  { label: 'Lessons', sub: 'Page', to: '/lessons', icon: 'lessons' },
  { label: 'Homework', sub: 'Page', to: '/homework', icon: 'homework' },
  { label: 'Rankings', sub: 'Page', to: '/rankings', icon: 'leaderboard' },
  { label: 'Attendance', sub: 'Page', to: '/attendance', icon: 'attendance' },
  { label: 'Mock Exams', sub: 'Page', to: '/mock-exams', icon: 'practice' },
  { label: 'Profile', sub: 'Page', to: '/profile', icon: 'profile' },
  { label: 'Design system', sub: 'Page', to: '/design-system', icon: 'settings' },
];

export function Search() {
  const navigate = useNavigate();
  const homework = useStore((s) => s.homework);
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const index = useMemo<Result[]>(() => {
    const hw: Result[] = homework.map((h) => ({ label: h.title, sub: `Homework · ${h.subject}`, to: '/homework', icon: 'homework' }));
    const lessons: Result[] = [
      { label: lesson.title, sub: `Lesson · ${lesson.block}`, to: '/lessons', icon: 'lessons' },
      ...lesson.chapters.map((c) => ({ label: c.label, sub: 'Lesson chapter', to: '/lessons', icon: 'playO' as IconName })),
    ];
    return [...PAGES, ...hw, ...lessons];
  }, [homework]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return index.filter((r) => r.label.toLowerCase().includes(term) || r.sub.toLowerCase().includes(term)).slice(0, 8);
  }, [q, index]);

  const go = (r: Result) => {
    navigate(r.to);
    setQ('');
    setOpen(false);
    inputRef.current?.blur();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => (a + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => (a - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      go(results[active]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const showDropdown = open && results.length > 0;

  return (
    <div className="relative hidden max-w-[360px] flex-1 sm:block">
      <span className="pointer-events-none absolute left-[13px] top-1/2 grid -translate-y-1/2 place-items-center text-faint">
        <Icon name="search" size={18} />
      </span>
      <input
        ref={inputRef}
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        onKeyDown={onKeyDown}
        placeholder="Search lessons, homework, topics…"
        role="combobox"
        aria-expanded={showDropdown}
        aria-controls="sb-search-list"
        className="w-full rounded-md border border-border bg-surface py-2.5 pl-10 pr-3 text-[13.5px] text-text outline-none focus:border-brand"
      />
      {showDropdown && (
        <div id="sb-search-list" role="listbox" className="animate-fade absolute left-0 top-11 z-40 w-full overflow-hidden rounded-lg border border-border bg-surface py-1.5 shadow-soft">
          {results.map((r, i) => (
            <button
              key={`${r.to}-${r.label}-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => {
                e.preventDefault();
                go(r);
              }}
              className="flex w-full items-center gap-3 px-3 py-2 text-left"
              style={{ background: i === active ? 'var(--surface-2)' : 'transparent' }}
            >
              <span className="grid h-8 w-8 flex-none place-items-center rounded-md bg-surface-2 text-dim">
                <Icon name={r.icon} size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13.5px] font-medium text-text">{r.label}</div>
                <div className="truncate text-[11px] text-faint">{r.sub}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;
