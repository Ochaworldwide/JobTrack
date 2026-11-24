import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  Calendar,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  User,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDate, formatTime, getCompanyInitials } from '../../utils/formatters';

interface TopNavProps {
  onOpenMobileMenu: () => void;
}

const ROUTE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/applications': 'All Applications',
  '/saved-jobs': 'Saved Jobs',
  '/interviews': 'Interviews',
  '/settings': 'Settings',
};

export function TopNav({ onOpenMobileMenu }: TopNavProps) {
  const { settings, toggleTheme, interviews, globalSearch, setGlobalSearch } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const pageTitle = ROUTE_TITLES[location.pathname] ?? 'JobTrack';

  const upcomingInterviews = interviews
    .filter((item) => !item.completed)
    .sort((a, b) =>
      `${a.interviewDate}T${a.interviewTime}`.localeCompare(
        `${b.interviewDate}T${b.interviewTime}`
      )
    )
    .slice(0, 4);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (location.pathname !== '/applications') {
      navigate('/applications');
    }
  };

  const userInitials = getCompanyInitials(settings.displayName || 'User');

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white/90 px-4 backdrop-blur-sm sm:px-6 dark:border-slate-800 dark:bg-slate-900/90">
      {/* Left: Mobile toggle + Page title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 lg:hidden dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="truncate text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          {pageTitle}
        </h1>
      </div>

      {/* Right: Search + Notifications + Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search applications..."
            aria-label="Search applications"
            className="h-9 w-56 lg:w-64 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-8 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-900"
          />
          {globalSearch && (
            <button
              type="button"
              onClick={() => setGlobalSearch('')}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </form>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => {
              setNotificationsOpen((prev) => !prev);
              setProfileOpen(false);
            }}
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
          >
            <Bell className="h-4 w-4" />
            {upcomingInterviews.length > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Upcoming Interviews
                </span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {upcomingInterviews.length}
                </span>
              </div>
              <div className="max-h-72 divide-y divide-slate-100 overflow-y-auto dark:divide-slate-800">
                {upcomingInterviews.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                    No upcoming interviews scheduled.
                  </p>
                ) : (
                  upcomingInterviews.map((interview) => (
                    <Link
                      key={interview.id}
                      to="/interviews"
                      onClick={() => setNotificationsOpen(false)}
                      className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60"
                    >
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-400">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                          {interview.companyName}
                        </p>
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                          {interview.jobTitle}
                        </p>
                        <p className="mt-1 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                          {formatDate(interview.interviewDate)} at{' '}
                          {formatTime(interview.interviewTime)}
                        </p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
              <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900">
                <Link
                  to="/interviews"
                  onClick={() => setNotificationsOpen(false)}
                  className="block text-center text-xs font-medium text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
                >
                  View all interviews
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => {
              setProfileOpen((prev) => !prev);
              setNotificationsOpen(false);
            }}
            aria-label="User menu"
            aria-expanded={profileOpen}
            className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white py-1 pl-1.5 pr-2.5 text-left transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 cursor-pointer"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-900 text-xs font-semibold text-white dark:bg-indigo-600">
              {userInitials}
            </span>
            <span className="hidden max-w-[120px] truncate text-sm font-medium text-slate-700 sm:block dark:text-slate-200">
              {settings.displayName}
            </span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-100 px-3.5 py-2.5 dark:border-slate-800">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {settings.displayName}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Job Seeker Workspace
                </p>
              </div>
              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    toggleTheme();
                    setProfileOpen(false);
                  }}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                >
                  {settings.theme === 'light' ? (
                    <>
                      <Moon className="h-4 w-4 text-slate-400" />
                      Switch to Dark Mode
                    </>
                  ) : (
                    <>
                      <Sun className="h-4 w-4 text-amber-400" />
                      Switch to Light Mode
                    </>
                  )}
                </button>
                <Link
                  to="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <Settings className="h-4 w-4 text-slate-400" />
                  Settings
                </Link>
                <Link
                  to="/applications"
                  onClick={() => setProfileOpen(false)}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <User className="h-4 w-4 text-slate-400" />
                  My Applications
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

