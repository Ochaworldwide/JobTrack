import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Bookmark,
  Briefcase,
  Calendar,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/applications', label: 'All Applications', icon: Briefcase, end: false },
  { to: '/saved-jobs', label: 'Saved Jobs', icon: Bookmark, end: false },
  { to: '/interviews', label: 'Interviews', icon: Calendar, end: false },
  { to: '/settings', label: 'Settings', icon: Settings, end: false },
];

export function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  const { settings, updateSettings, applications, savedJobs, interviews } = useApp();
  const collapsed = settings.sidebarCollapsed;

  const upcomingInterviewsCount = interviews.filter((i) => !i.completed).length;

  const getBadgeCount = (path: string): number | null => {
    if (path === '/applications') return applications.length;
    if (path === '/saved-jobs') return savedJobs.length;
    if (path === '/interviews') return upcomingInterviewsCount;
    return null;
  };

  useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseMobile();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen, onCloseMobile]);

  const toggleCollapse = () => {
    updateSettings({ sidebarCollapsed: !collapsed });
  };

  const renderNavContent = (isCollapsed: boolean, isMobile = false) => (
    <div className="flex h-full flex-col">
      {/* Brand Header */}
      <div
        className={`flex h-16 shrink-0 items-center border-b border-slate-200 dark:border-slate-800 ${
          isCollapsed ? 'justify-center px-2' : 'justify-between px-4'
        }`}
      >
        <NavLink
          to="/"
          onClick={isMobile ? onCloseMobile : undefined}
          className="flex items-center gap-2.5 focus:outline-none"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white shadow-xs dark:bg-indigo-600">
            <Briefcase className="h-4 w-4" />
          </div>
          {!isCollapsed && (
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              JobTrack
            </span>
          )}
        </NavLink>

        {isMobile ? (
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close navigation menu"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        ) : !isCollapsed ? (
          <button
            type="button"
            onClick={toggleCollapse}
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {/* Navigation Links */}
      <nav
        aria-label="Main navigation"
        className="flex-1 space-y-1 overflow-y-auto px-3 py-4"
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const count = getBadgeCount(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={isMobile ? onCloseMobile : undefined}
              title={isCollapsed ? item.label : undefined}
              className={({ isActive }) =>
                `group flex items-center rounded-lg text-sm font-medium transition-colors ${
                  isCollapsed
                    ? 'justify-center p-2.5'
                    : 'justify-between px-3 py-2.5'
                } ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-2xs dark:bg-indigo-600 dark:text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-slate-100'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        isActive
                          ? 'text-white'
                          : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300'
                      }`}
                    />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </span>
                  {!isCollapsed && count !== null && count > 0 && (
                    <span
                      className={`ml-2 inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-medium ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Expand button when desktop sidebar is collapsed */}
      {!isMobile && isCollapsed && (
        <div className="border-t border-slate-200 p-3 dark:border-slate-800 flex justify-center">
          <button
            type="button"
            onClick={toggleCollapse}
            aria-label="Expand sidebar"
            title="Expand sidebar"
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer"
          >
            <PanelLeftOpen className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex lg:flex-col lg:shrink-0 border-r border-slate-200 bg-white transition-[width] duration-200  dark:border-slate-800 dark:bg-slate-900 sticky top-0 left-0 h-screen ${
          collapsed ? 'lg:w-[72px]' : 'lg:w-64'
        }`}
      >
        {renderNavContent(collapsed, false)}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-[1px]"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="relative z-10 flex w-72 max-w-[82vw] flex-col bg-white shadow-xl dark:bg-slate-900">
            {renderNavContent(false, true)}
          </aside>
        </div>
      )}
    </>
  );
}

