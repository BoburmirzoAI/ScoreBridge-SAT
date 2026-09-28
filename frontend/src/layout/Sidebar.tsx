import { NavLink } from 'react-router-dom';
import { Icon, type IconName } from '../icons';
import { LogoMark } from '../components/art';
import { useStore } from '../store';
import { levels } from '../data';
import { homeworkStatus, levelInfo } from '../utils';

interface NavItem {
  to: string;
  label: string;
  icon: IconName;
  end?: boolean;
}

const NAV: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/lessons', label: 'Lessons', icon: 'lessons' },
  { to: '/homework', label: 'Homework', icon: 'homework' },
  { to: '/rankings', label: 'Rankings', icon: 'leaderboard' },
  { to: '/attendance', label: 'Attendance', icon: 'attendance' },
  { to: '/mock-exams', label: 'Mock Exams', icon: 'practice' },
  { to: '/profile', label: 'Profile', icon: 'profile' },
  { to: '/design-system', label: 'Design system', icon: 'settings' },
];

export function Sidebar() {
  const { xp, homework, anchor } = useStore();
  const now = Date.now();
  const pendingCount = homework.filter(
    (h) => homeworkStatus({ ...h, due: anchor + h.dueOffsetMs }, now) !== 'completed',
  ).length;
  const li = levelInfo(xp, levels);

  return (
    <aside className="sticky top-0 z-20 hidden h-screen w-[238px] flex-none flex-col bg-sidebar px-4 py-[22px] text-on-side lg:flex">
      {/* brand */}
      <div className="flex items-center gap-[11px] px-2 pb-5 pt-1.5">
        <LogoMark />
        <div>
          <div className="disp text-[19px] font-semibold leading-none tracking-[-0.02em] text-white">Scorebridge</div>
          <div className="mt-[3px] text-[10.5px] tracking-[0.02em] text-on-side-dim">Build your way to college</div>
        </div>
      </div>

      {/* nav */}
      <nav className="mt-1.5 flex flex-col gap-[3px]">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition-colors ${
                isActive ? 'bg-brand text-white' : 'text-on-side hover:bg-sidebar-2 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className="grid h-5 w-5 flex-none place-items-center">
                  <Icon name={item.icon} size={20} />
                </span>
                <span className="flex-1 text-left">{item.label}</span>
                {item.to === '/homework' && pendingCount > 0 && !isActive && (
                  <span className="grid h-[19px] min-w-[19px] place-items-center rounded-[5px] bg-reward px-1.5 text-[10.5px] font-medium text-[#1C1F4A]">
                    {pendingCount}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* level card */}
      <div className="mt-auto pt-4">
        <div className="rounded-lg bg-sidebar-2 p-[13px]">
          <div className="text-[13px] font-semibold text-white">Level {li.name}</div>
          <div className="text-[11px] text-on-side-dim">
            {li.toNext} XP to {li.nextName}
          </div>
          <div className="mt-[11px] h-1.5 overflow-hidden rounded-[5px] bg-white/10">
            <div
              className="h-full rounded-[5px] transition-[width] duration-700"
              style={{ width: li.pctStr, background: 'linear-gradient(90deg,#F5B301,#FFD46A)' }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
