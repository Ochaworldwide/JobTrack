import type { ApplicationStatus } from '../../types';

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  Wishlist:
    'bg-slate-100 text-slate-700 ring-slate-200/80 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700',
  Applied:
    'bg-blue-50 text-blue-700 ring-blue-200/80 dark:bg-blue-950/60 dark:text-blue-300 dark:ring-blue-800/70',
  'Under Review':
    'bg-amber-50 text-amber-700 ring-amber-200/80 dark:bg-amber-950/60 dark:text-amber-300 dark:ring-amber-800/70',
  Interview:
    'bg-indigo-50 text-indigo-700 ring-indigo-200/80 dark:bg-indigo-950/60 dark:text-indigo-300 dark:ring-indigo-800/70',
  Offer:
    'bg-emerald-50 text-emerald-700 ring-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-300 dark:ring-emerald-800/70',
  Rejected:
    'bg-rose-50 text-rose-700 ring-rose-200/80 dark:bg-rose-950/60 dark:text-rose-300 dark:ring-rose-800/70',
};

const DOT_STYLES: Record<ApplicationStatus, string> = {
  Wishlist: 'bg-slate-400',
  Applied: 'bg-blue-500',
  'Under Review': 'bg-amber-500',
  Interview: 'bg-indigo-500',
  Offer: 'bg-emerald-500',
  Rejected: 'bg-rose-500',
};

interface StatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset whitespace-nowrap ${STATUS_STYLES[status]} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${DOT_STYLES[status]}`} aria-hidden="true" />
      {status}
    </span>
  );
}

