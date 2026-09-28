import { NavLink } from 'react-router-dom';
import { Icon, type IconName } from '../icons';

const TABS: { to: string; label: string; icon: IconName; end?: boolean }[] = [
  { to: '/', label: 'Home', icon: 'dashboard', end: true },
  { to: '/lessons', label: 'Lessons', icon: 'lessons' },
  { to: '/homework', label: 'Tasks', icon: 'homework' },
  { to: '/rankings', label: 'Board', icon: 'leaderboard' },
  { to: '/profile', label: 'Me', icon: 'profile' },
];

export function BottomTabs() {
  return (
    <nav className="sticky bottom-0 z-20 flex justify-around border-t border-border bg-surface px-1.5 pb-3.5 pt-2.5 lg:hidden">
      {TABS.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.end}
          className={({ isActive }) =>
            `flex flex-col items-center gap-[3px] ${isActive ? 'text-brand' : 'text-faint'}`
          }
        >
          <Icon name={t.icon} size={20} />
          <span className="text-[9.5px] font-semibold">{t.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default BottomTabs;
