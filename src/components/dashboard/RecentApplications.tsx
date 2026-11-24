import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/formatters';
import { CompanyAvatar } from '../common/CompanyAvatar';
import { StatusBadge } from '../common/StatusBadge';

export function RecentApplications() {
  const { applications } = useApp();

  const recentApps = useMemo(() => {
    return [...applications]
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, 5);
  }, [applications]);

  return (
    <section className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Recent Applications
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Your 5 most recently updated applications
          </p>
        </div>
        <Link
          to="/applications"
          className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {recentApps.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800">
            <Briefcase className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
            No applications yet
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Add your first job application to start tracking progress.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {recentApps.map((app) => (
            <li
              key={app.id}
              className="flex flex-col gap-3 px-6 py-3.5 transition-colors hover:bg-slate-50/70 sm:flex-row sm:items-center sm:justify-between dark:hover:bg-slate-800/40"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <CompanyAvatar companyName={app.companyName} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {app.companyName}
                  </p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {app.jobTitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  {formatDate(app.applicationDate)}
                </span>
                <StatusBadge status={app.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

