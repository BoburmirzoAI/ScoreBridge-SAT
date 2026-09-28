import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../icons';
import { useStore } from '../store';
import { useCountdown } from '../hooks';
import { Search } from './Search';
import { Avatar } from '../components/Avatar';
import { notifications, scores } from '../data';
import { cdShort } from '../utils';

const TEST_DAY = new Date(scores.testDate).getTime();

export function Topbar() {
  const navigate = useNavigate();
  const { theme, toggleTheme, xp, streak, notifUnread, markAllRead, resetDemo } = useStore();
  const { now } = useCountdown(TEST_DAY);
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const closeAll = () => {
    setNotifOpen(false);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-[15] flex items-center gap-3.5 border-b border-border-2 px-4 py-3 backdrop-blur-md sm:px-[26px]" style={{ background: 'color-mix(in srgb, var(--bg) 82%, transparent)' }}>
      <Search />
      <div className="flex-1" />

      {/* test-day countdown */}
      <div className="hidden items-center gap-1.5 text-[12.5px] font-medium text-dim md:flex" title="Countdown to test day">
        <Icon name="clock" size={13} />
        <span className="disp text-text">Test day in {cdShort(TEST_DAY, now)}</span>
      </div>

      {/* XP chip */}
      <div className="hidden items-center gap-2 rounded-[5px] bg-reward-soft py-1.5 pl-2.5 pr-3 text-[13px] font-medium sm:flex" title="Total XP">
        <span className="grid place-items-center text-reward">
          <Icon name="spark" size={15} />
        </span>
        <span className="text-heading">{Math.round(xp).toLocaleString()}</span>
        <span className="text-[11.5px] font-medium text-dim">XP</span>
      </div>

      {/* streak chip */}
      <div className="hidden items-center gap-1.5 rounded-[5px] border border-border bg-surface py-1.5 pl-2 pr-3 text-[13px] font-medium sm:flex" title="Day streak">
        <span className="grid place-items-center text-reward">
          <Icon name="brick" size={16} />
        </span>
        <span>{streak}</span>
      </div>

      {/* theme toggle */}
      <button
        onClick={toggleTheme}
        title="Toggle theme"
        className="grid h-[38px] w-[38px] place-items-center rounded-md border border-border bg-surface text-dim hover:border-brand hover:text-brand"
      >
        <Icon name={theme === 'light' ? 'moon' : 'sun'} size={18} />
      </button>

      {/* notifications */}
      <div className="relative">
        <button
          onClick={() => {
            setNotifOpen((o) => !o);
            setMenuOpen(false);
          }}
          title="Notifications"
          className="relative grid h-[38px] w-[38px] place-items-center rounded-md border border-border bg-surface text-dim hover:border-brand hover:text-brand"
        >
          <Icon name="bell" size={19} />
          {notifUnread && <span className="absolute right-[9px] top-2 h-2 w-2 rounded-full border-2 border-surface bg-st-over" />}
        </button>
        {notifOpen && (
          <>
            <button className="fixed inset-0 z-30 cursor-default" onClick={closeAll} aria-hidden tabIndex={-1} />
            <div className="animate-fade absolute right-0 top-12 z-40 w-[340px] overflow-hidden rounded-lg border border-border bg-surface shadow-soft">
              <div className="flex items-center justify-between border-b border-border-2 px-4 py-3.5">
                <strong className="disp text-[15px] text-heading">Notifications</strong>
                <button onClick={markAllRead} className="text-xs font-semibold text-brand">
                  Mark all read
                </button>
              </div>
              <div className="max-h-[360px] overflow-auto">
                {notifications.map((n, i) => (
                  <div key={i} className="flex gap-[11px] border-b border-border-2 px-4 py-3" style={{ background: n.unread ? 'var(--brand-soft)' : 'transparent' }}>
                    <span className="grid h-[34px] w-[34px] flex-none place-items-center rounded-md bg-surface-2" style={{ color: n.iconColor }}>
                      <Icon name={n.icon} size={17} />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[13px] text-text">
                        <strong className="font-semibold text-heading">{n.title}</strong> {n.body}
                      </div>
                      <div className="mt-[3px] text-[11px] text-faint">{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* avatar + menu */}
      <div className="relative">
        <button
          onClick={() => {
            setMenuOpen((o) => !o);
            setNotifOpen(false);
          }}
          title="Profile menu"
          className="grid place-items-center rounded-md"
        >
          <Avatar size={38} />
        </button>
        {menuOpen && (
          <>
            <button className="fixed inset-0 z-30 cursor-default" onClick={closeAll} aria-hidden tabIndex={-1} />
            <div className="animate-fade absolute right-0 top-12 z-40 w-[200px] overflow-hidden rounded-lg border border-border bg-surface py-1.5 shadow-soft">
              {[
                { label: 'Profile', fn: () => navigate('/profile') },
                { label: 'Design system', fn: () => navigate('/design-system') },
                { label: 'Reset demo data', fn: resetDemo },
              ].map((it) => (
                <button
                  key={it.label}
                  onClick={() => {
                    it.fn();
                    closeAll();
                  }}
                  className="block w-full px-4 py-2 text-left text-[13.5px] text-text hover:bg-surface-2"
                >
                  {it.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </header>
  );
}

export default Topbar;
