import {
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  Pencil,
  RotateCcw,
  Trash2,
  Video,
} from 'lucide-react';
import type { Interview } from '../../types';
import { formatDate, formatTime, normalizeUrl } from '../../utils/formatters';
import { Button } from '../common/Button';
import { CompanyAvatar } from '../common/CompanyAvatar';

interface InterviewCardProps {
  interview: Interview;
  onEdit: (interview: Interview) => void;
  onDelete: (interview: Interview) => void;
  onToggleCompleted: (id: string) => void;
}

export function InterviewCard({
  interview,
  onEdit,
  onDelete,
  onToggleCompleted,
}: InterviewCardProps) {
  const isOnline = interview.interviewType === 'Online';
  const meetingHref = isOnline ? normalizeUrl(interview.locationOrLink) : undefined;

  return (
    <article
      className={`rounded-xl border bg-white p-5 shadow-2xs transition-colors dark:bg-slate-900 ${
        interview.completed
          ? 'border-slate-200/80 opacity-85 dark:border-slate-800/80'
          : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700'
      }`}
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex items-start gap-3.5 min-w-0">
          <CompanyAvatar companyName={interview.companyName} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                {interview.companyName}
              </h3>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  isOnline
                    ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300'
                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                }`}
              >
                {isOnline ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                {interview.interviewType}
              </span>
              {interview.completed && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                  <CheckCircle2 className="h-3 w-3" />
                  Completed
                </span>
              )}
            </div>
            <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">
              {interview.jobTitle}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                {formatDate(interview.interviewDate)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                {formatTime(interview.interviewTime)}
              </span>
            </div>

            <div className="mt-2.5 text-xs">
              {isOnline && meetingHref ? (
                <a
                  href={meetingHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 break-all"
                >
                  {interview.locationOrLink}
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </a>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  {interview.locationOrLink}
                </span>
              )}
            </div>

            {interview.notes && (
              <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                {interview.notes}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-end">
          <Button
            size="sm"
            variant={interview.completed ? 'secondary' : 'primary'}
            onClick={() => onToggleCompleted(interview.id)}
            leftIcon={
              interview.completed ? (
                <RotateCcw className="h-3.5 w-3.5" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5" />
              )
            }
          >
            {interview.completed ? 'Mark Upcoming' : 'Mark Completed'}
          </Button>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(interview)}
              aria-label={`Edit interview with ${interview.companyName}`}
              title="Edit interview"
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800 dark:hover:text-indigo-400 cursor-pointer"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(interview)}
              aria-label={`Delete interview with ${interview.companyName}`}
              title="Delete interview"
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/60 dark:hover:text-rose-400 cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

