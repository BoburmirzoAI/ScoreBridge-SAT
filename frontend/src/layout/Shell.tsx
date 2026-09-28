import { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { BottomTabs } from './BottomTabs';
import { Celebration } from '../components/Celebration';
import { useStore } from '../store';

/** App layout: sidebar (desktop) + top bar + scrolling main + bottom tabs (mobile). */
export function Shell() {
  const theme = useStore((s) => s.theme);
  const { pathname } = useLocation();

  // apply persisted theme to <html>
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // scroll to top on route change
  useEffect(() => {
    const main = document.getElementById('sb-main');
    if (main) main.scrollTop = 0;
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-bg text-text">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main id="sb-main" className="flex-1 overflow-auto p-4 sm:p-[26px]">
          <Outlet />
          <footer className="mx-auto mt-10 max-w-[1160px] border-t border-border-2 pt-5 text-center text-[11.5px] leading-relaxed text-faint">
            <div>
              Scorebridge — Build your way to college. ·{' '}
              <Link to="/design-system" className="text-brand">Design system</Link>
            </div>
            <div className="mt-1">SAT is a registered trademark of the College Board, which is not affiliated with Scorebridge.</div>
          </footer>
        </main>
        <BottomTabs />
      </div>
      <Celebration />
    </div>
  );
}

export default Shell;
