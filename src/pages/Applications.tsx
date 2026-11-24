import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Briefcase, Plus, SearchX } from 'lucide-react';
import { ApplicationDetailModal } from '../components/applications/ApplicationDetailModal';
import {
  ApplicationFilters,
  type SortOrder,
} from '../components/applications/ApplicationFilters';
import { ApplicationFormModal } from '../components/applications/ApplicationFormModal';
import { ApplicationTable } from '../components/applications/ApplicationTable';
import { Button } from '../components/common/Button';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';
import { useApp } from '../context/AppContext';
import type {
  ApplicationStatus,
  EmploymentType,
  JobApplication,
} from '../types';

export function Applications() {
  const {
    applications,
    addApplication,
    updateApplication,
    updateApplicationStatus,
    deleteApplication,
    globalSearch,
    setGlobalSearch,
  } = useApp();

  const [searchParams, setSearchParams] = useSearchParams();

  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | ''>('');
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState<EmploymentType | ''>('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  const [isFormOpen, setIsFormOpen] = useState(
    () => searchParams.get('new') === 'true'
  );
  const [editingApp, setEditingApp] = useState<JobApplication | null>(null);
  const [viewingAppId, setViewingAppId] = useState<string | null>(null);
  const [deletingApp, setDeletingApp] = useState<JobApplication | null>(null);

  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const viewingApp = useMemo(
    () => applications.find((a) => a.id === viewingAppId) ?? null,
    [applications, viewingAppId]
  );

  const filteredApplications = useMemo(() => {
    const query = globalSearch.trim().toLowerCase();

    return applications
      .filter((app) => {
        if (query) {
          const matchesCompany = app.companyName.toLowerCase().includes(query);
          const matchesTitle = app.jobTitle.toLowerCase().includes(query);
          if (!matchesCompany && !matchesTitle) return false;
        }
        if (statusFilter && app.status !== statusFilter) return false;
        if (employmentTypeFilter && app.employmentType !== employmentTypeFilter) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const cmp = a.applicationDate.localeCompare(b.applicationDate);
        return sortOrder === 'newest' ? -cmp : cmp;
      });
  }, [applications, globalSearch, statusFilter, employmentTypeFilter, sortOrder]);

  const hasActiveFilters = Boolean(
    globalSearch.trim() ||
      statusFilter ||
      employmentTypeFilter ||
      sortOrder !== 'newest'
  );

  const handleClearFilters = () => {
    setGlobalSearch('');
    setStatusFilter('');
    setEmploymentTypeFilter('');
    setSortOrder('newest');
  };

  const handleOpenAdd = () => {
    setEditingApp(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (app: JobApplication) => {
    setEditingApp(app);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (
    data: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    if (editingApp) {
      updateApplication(editingApp.id, data);
    } else {
      addApplication(data);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            All Applications
          </h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            Showing {filteredApplications.length} of {applications.length}{' '}
            {applications.length === 1 ? 'application' : 'applications'} — click any status badge to update it inline.
          </p>
        </div>
        <Button onClick={handleOpenAdd} leftIcon={<Plus className="h-4 w-4" />}>
          Add Application
        </Button>
      </div>

      {/* Filters */}
      <ApplicationFilters
        search={globalSearch}
        onSearchChange={setGlobalSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        employmentTypeFilter={employmentTypeFilter}
        onEmploymentTypeFilterChange={setEmploymentTypeFilter}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Table or Empty States */}
      {applications.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="h-6 w-6" />}
          title="No applications tracked yet"
          description="Start building your job search pipeline by adding your first application."
          action={
            <Button onClick={handleOpenAdd} leftIcon={<Plus className="h-4 w-4" />}>
              Add Your First Application
            </Button>
          }
        />
      ) : filteredApplications.length === 0 ? (
        <EmptyState
          icon={<SearchX className="h-6 w-6" />}
          title="No matching applications"
          description="Try adjusting your search term or clearing one of the active filters."
          action={
            <Button variant="secondary" onClick={handleClearFilters}>
              Clear All Filters
            </Button>
          }
        />
      ) : (
        <ApplicationTable
          applications={filteredApplications}
          onView={(app) => setViewingAppId(app.id)}
          onEdit={handleOpenEdit}
          onDelete={(app) => setDeletingApp(app)}
          onStatusChange={updateApplicationStatus}
        />
      )}

      {/* Modals */}
      <ApplicationFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingApp}
      />

      <ApplicationDetailModal
        application={viewingApp}
        onClose={() => setViewingAppId(null)}
        onEdit={handleOpenEdit}
        onDelete={(app) => setDeletingApp(app)}
        onStatusChange={updateApplicationStatus}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingApp)}
        onClose={() => setDeletingApp(null)}
        onConfirm={() => {
          if (deletingApp) {
            deleteApplication(deletingApp.id);
          }
        }}
        title="Delete Application"
        message={
          deletingApp
            ? `Are you sure you want to delete your application for ${deletingApp.jobTitle} at ${deletingApp.companyName}? This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
      />
    </div>
  );
}
