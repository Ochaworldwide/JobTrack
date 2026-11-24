import {
  ArrowRightCircle,
  Briefcase,
  Calendar,
  ExternalLink,
  MapPin,
  Pencil,
  Trash2,
} from 'lucide-react';
import type { SavedJob } from '../../types';
import { formatDate } from '../../utils/formatters';
import { Button } from '../common/Button';
import { CompanyAvatar } from '../common/CompanyAvatar';

interface SavedJobCardProps {
  job: SavedJob;
  onEdit: (job: SavedJob) => void;
  onDelete: (job: SavedJob) => void;
  onMoveToApplications: (job: SavedJob) => void;
}

export function SavedJobCard({
  job,
  onEdit,
  onDelete,
  onMoveToApplications,
}: SavedJobCardProps) {
  return (
    <article className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-2xs transition-colors hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <CompanyAvatar companyName={job.companyName} />
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                {job.jobTitle}
              </h3>
              <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">
                {job.companyName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => onEdit(job)}
              aria-label={`Edit saved job ${job.jobTitle}`}
              title="Edit saved job"
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800 dark:hover:text-indigo-400 cursor-pointer"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(job)}
              aria-label={`Delete saved job ${job.jobTitle}`}
              title="Delete saved job"
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/60 dark:hover:text-rose-400 cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            {job.location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5 text-slate-400" />
            {job.employmentType}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            Saved {formatDate(job.dateSaved)}
          </span>
        </div>

        {job.notes && (
          <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            {job.notes}
          </p>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
        {job.jobPostingUrl ? (
          <a
            href={job.jobPostingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
          >
            View Posting
            <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <span className="text-xs text-slate-400">No posting link</span>
        )}

        <Button
          size="sm"
          onClick={() => onMoveToApplications(job)}
          leftIcon={<ArrowRightCircle className="h-3.5 w-3.5" />}
        >
          Move to Applications
        </Button>
      </div>
    </article>
  );
}

