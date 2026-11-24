import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock, MapPin, Video } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDate, formatTime } from '../../utils/formatters';

export function UpcomingInterviews() {
  const { interviews } = useApp();

  const upcoming = useMemo(() => {
    return interviews
      .filter((item) => !item.completed)
      .sort((a, b) =>
        `${a.interviewDate}T${a.interviewTime}`.localeCompare(
          `${b.interviewDate}T${b.interviewTime}`
        )
      )
      .slice(0, 4);
  }, [interviews]);

  return (
    <section className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Upcoming Interviews
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Next scheduled sessions
          </p>
        </div>
        <Link
          to="/interviews"
          className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Manage
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {upcoming.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800">
            <Calendar className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
            No upcoming interviews
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Scheduled interviews will appear here automatically.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {upcoming.map((item) => (
            <li
              key={item.id}
              className="px-6 py-4 transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {item.companyName}
                  </p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {item.jobTitle}
                  </p>
                </div>
                <span
                  className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    item.interviewType === 'Online'
                      ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300'
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                  }`}
                >
                  {item.interviewType === 'Online' ? (
                    <Video className="h-3 w-3" />
                  ) : (
                    <MapPin className="h-3 w-3" />
                  )}
                  {item.interviewType}
                </span>
              </div>

              <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  {formatDate(item.interviewDate)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  {formatTime(item.interviewTime)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

