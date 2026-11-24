import { useState } from 'react';
import { Bookmark, Plus } from 'lucide-react';
import { Button } from '../components/common/Button';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';
import { SavedJobCard } from '../components/saved-jobs/SavedJobCard';
import { SavedJobFormModal } from '../components/saved-jobs/SavedJobFormModal';
import { useApp } from '../context/AppContext';
import type { SavedJob } from '../types';

export function SavedJobs() {
  const {
    savedJobs,
    addSavedJob,
    updateSavedJob,
    deleteSavedJob,
    moveSavedJobToApplications,
  } = useApp();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<SavedJob | null>(null);
  const [deletingJob, setDeletingJob] = useState<SavedJob | null>(null);

  const handleOpenAdd = () => {
    setEditingJob(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (job: SavedJob) => {
    setEditingJob(job);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: Omit<SavedJob, 'id'>) => {
    if (editingJob) {
      updateSavedJob(editingJob.id, data);
    } else {
      addSavedJob(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Saved Jobs
          </h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            Keep interesting roles here until you are ready to apply.
          </p>
        </div>
        <Button onClick={handleOpenAdd} leftIcon={<Plus className="h-4 w-4" />}>
          Save Job
        </Button>
      </div>

      {savedJobs.length === 0 ? (
        <EmptyState
          icon={<Bookmark className="h-6 w-6" />}
          title="No saved jobs yet"
          description="Bookmark promising job postings and convert them into active applications in one click."
          action={
            <Button onClick={handleOpenAdd} leftIcon={<Plus className="h-4 w-4" />}>
              Save Your First Job
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {savedJobs.map((job) => (
            <SavedJobCard
              key={job.id}
              job={job}
              onEdit={handleOpenEdit}
              onDelete={(item) => setDeletingJob(item)}
              onMoveToApplications={(item) => moveSavedJobToApplications(item.id)}
            />
          ))}
        </div>
      )}

      <SavedJobFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingJob}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingJob)}
        onClose={() => setDeletingJob(null)}
        onConfirm={() => {
          if (deletingJob) {
            deleteSavedJob(deletingJob.id);
          }
        }}
        title="Remove Saved Job"
        message={
          deletingJob
            ? `Are you sure you want to remove "${deletingJob.jobTitle}" at ${deletingJob.companyName} from your saved jobs?`
            : ''
        }
        confirmLabel="Remove"
      />
    </div>
  );
}

