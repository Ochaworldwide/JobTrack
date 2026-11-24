import { Eye, Pencil, Trash2 } from 'lucide-react';
import {
  APPLICATION_STATUSES,
  type ApplicationStatus,
  type JobApplication,
} from '../../types';
import { formatDate } from '../../utils/formatters';
import { CompanyAvatar } from '../common/CompanyAvatar';
import { StatusBadge } from '../common/StatusBadge';
import { Table, type TableColumn } from '../common/Table';

interface ApplicationTableProps {
  applications: JobApplication[];
  onView: (app: JobApplication) => void;
  onEdit: (app: JobApplication) => void;
  onDelete: (app: JobApplication) => void;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
}

export function ApplicationTable({
  applications,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
}: ApplicationTableProps) {
  const columns: TableColumn<JobApplication>[] = [
    {
      key: 'company',
      header: 'Company',
      render: (app) => (
        <div className="flex items-center gap-3 min-w-[160px]">
          <CompanyAvatar companyName={app.companyName} size="sm" />
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {app.companyName}
          </span>
        </div>
      ),
    },
    {
      key: 'position',
      header: 'Job Position',
      render: (app) => (
        <div className="min-w-[160px]">
          <p className="font-medium text-slate-800 dark:text-slate-200">
            {app.jobTitle}
          </p>
          {app.salaryRange && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {app.salaryRange}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      render: (app) => (
        <span className="text-slate-600 dark:text-slate-300 whitespace-nowrap">
          {app.location}
        </span>
      ),
    },
    {
      key: 'type',
      header: 'Employment Type',
      render: (app) => (
        <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300 whitespace-nowrap">
          {app.employmentType}
        </span>
      ),
    },
    {
      key: 'date',
      header: 'Date Applied',
      render: (app) => (
        <span className="text-slate-600 dark:text-slate-400 whitespace-nowrap">
          {formatDate(app.applicationDate)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (app) => (
        <div
          className="relative inline-flex items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <StatusBadge status={app.status} />
          <select
            aria-label={`Change status for ${app.companyName} ${app.jobTitle}`}
            value={app.status}
            onChange={(e) =>
              onStatusChange(app.id, e.target.value as ApplicationStatus)
            }
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          >
            {APPLICATION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (app) => (
        <div
          className="flex items-center justify-end gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => onView(app)}
            aria-label={`View ${app.companyName} application`}
            title="View details"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(app)}
            aria-label={`Edit ${app.companyName} application`}
            title="Edit application"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800 dark:hover:text-indigo-400 cursor-pointer"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(app)}
            aria-label={`Delete ${app.companyName} application`}
            title="Delete application"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/60 dark:hover:text-rose-400 cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={applications}
      rowKey={(row) => row.id}
      onRowClick={onView}
    />
  );
}
