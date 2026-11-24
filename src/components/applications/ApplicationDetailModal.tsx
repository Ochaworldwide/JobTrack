import {
  Briefcase,
  Calendar,
  DollarSign,
  ExternalLink,
  Globe,
  MapPin,
  Pencil,
  Trash2,
} from 'lucide-react';
import {
  APPLICATION_STATUSES,
  type ApplicationStatus,
  type JobApplication,
} from '../../types';
import { formatDate } from '../../utils/formatters';
import { Button } from '../common/Button';
import { CompanyAvatar } from '../common/CompanyAvatar';
import { Modal } from '../common/Modal';
import { Select } from '../common/Select';
import { StatusBadge } from '../common/StatusBadge';

interface ApplicationDetailModalProps {
  application: JobApplication | null;
  onClose: () => void;
  onEdit: (app: JobApplication) => void;
  onDelete: (app: JobApplication) => void;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
}

export function ApplicationDetailModal({
  application,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
}: ApplicationDetailModalProps) {
  if (!application) return null;

  return (
    <Modal
      isOpen={Boolean(application)}
      onClose={onClose}
      title="Application Details"
      size="lg"
      footer={
        <div className="flex w-full items-center justify-between gap-3">
          <Button
            variant="ghost"
            className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/50"
            leftIcon={<Trash2 className="h-4 w-4" />}
            onClick={() => {
              onClose();
              onDelete(application);
            }}
          >
            Delete
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            <Button
              leftIcon={<Pencil className="h-4 w-4" />}
              onClick={() => {
                onClose();
                onEdit(application);
              }}
            >
              Edit Application
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="flex items-start gap-3.5">
            <CompanyAvatar companyName={application.companyName} size="lg" />
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {application.jobTitle}
              </h3>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {application.companyName}
              </p>
              <div className="mt-2">
                <StatusBadge status={application.status} />
              </div>
            </div>
          </div>

          <div className="w-full sm:w-44">
            <Select
              label="Update Status"
              value={application.status}
              onChange={(e) =>
                onStatusChange(application.id, e.target.value as ApplicationStatus)
              }
              options={APPLICATION_STATUSES.map((s) => ({ label: s, value: s }))}
            />
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:grid-cols-2 dark:border-slate-800 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5 text-sm">
            <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
            <span className="text-slate-500 dark:text-slate-400">Location:</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {application.location}
            </span>
          </div>
          <div className="flex items-center gap-2.5 text-sm">
            <Briefcase className="h-4 w-4 shrink-0 text-slate-400" />
            <span className="text-slate-500 dark:text-slate-400">Type:</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {application.employmentType}
            </span>
          </div>
          <div className="flex items-center gap-2.5 text-sm">
            <Calendar className="h-4 w-4 shrink-0 text-slate-400" />
            <span className="text-slate-500 dark:text-slate-400">Applied:</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {formatDate(application.applicationDate)}
            </span>
          </div>
          <div className="flex items-center gap-2.5 text-sm">
            <DollarSign className="h-4 w-4 shrink-0 text-slate-400" />
            <span className="text-slate-500 dark:text-slate-400">Salary:</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {application.salaryRange || 'Not specified'}
            </span>
          </div>
        </div>

        {/* External Links */}
        {(application.companyWebsite || application.jobPostingUrl) && (
          <div className="flex flex-wrap gap-3">
            {application.companyWebsite && (
              <a
                href={application.companyWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <Globe className="h-3.5 w-3.5 text-slate-400" />
                Company Website
                <ExternalLink className="h-3 w-3 text-slate-400" />
              </a>
            )}
            {application.jobPostingUrl && (
              <a
                href={application.jobPostingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                View Job Posting
              </a>
            )}
          </div>
        )}

        {/* Job Description */}
        {application.jobDescription && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Job Description
            </h4>
            <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {application.jobDescription}
            </p>
          </div>
        )}

        {/* Notes */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Notes
          </h4>
          <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {application.notes || 'No notes added yet.'}
          </p>
        </div>
      </div>
    </Modal>
  );
}

