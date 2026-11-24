import { useMemo, useState } from 'react';
import { Calendar, Plus } from 'lucide-react';
import { Button } from '../components/common/Button';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';
import { InterviewCard } from '../components/interviews/InterviewCard';
import { InterviewFormModal } from '../components/interviews/InterviewFormModal';
import { useApp } from '../context/AppContext';
import type { Interview } from '../types';
import { isInterviewPast } from '../utils/formatters';

export function Interviews() {
  const {
    interviews,
    addInterview,
    updateInterview,
    toggleInterviewCompleted,
    deleteInterview,
  } = useApp();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingInterview, setEditingInterview] = useState<Interview | null>(null);
  const [deletingInterview, setDeletingInterview] = useState<Interview | null>(null);

  const { upcoming, past } = useMemo(() => {
    const upcomingList: Interview[] = [];
    const pastList: Interview[] = [];

    for (const item of interviews) {
      if (item.completed || isInterviewPast(item.interviewDate, item.interviewTime)) {
        pastList.push(item);
      } else {
        upcomingList.push(item);
      }
    }

    upcomingList.sort((a, b) =>
      `${a.interviewDate}T${a.interviewTime}`.localeCompare(
        `${b.interviewDate}T${b.interviewTime}`
      )
    );

    pastList.sort((a, b) =>
      `${b.interviewDate}T${b.interviewTime}`.localeCompare(
        `${a.interviewDate}T${a.interviewTime}`
      )
    );

    return { upcoming: upcomingList, past: pastList };
  }, [interviews]);

  const handleOpenAdd = () => {
    setEditingInterview(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: Interview) => {
    setEditingInterview(item);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (
    data: Omit<Interview, 'id' | 'createdAt' | 'completed'>
  ) => {
    if (editingInterview) {
      updateInterview(editingInterview.id, data);
    } else {
      addInterview(data);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Interviews
          </h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            Schedule interviews, keep meeting details handy, and track completed rounds.
          </p>
        </div>
        <Button onClick={handleOpenAdd} leftIcon={<Plus className="h-4 w-4" />}>
          Schedule Interview
        </Button>
      </div>

      {interviews.length === 0 ? (
        <EmptyState
          icon={<Calendar className="h-6 w-6" />}
          title="No interviews scheduled"
          description="Add your upcoming phone screens, technical pairings, or on-site panels to stay prepared."
          action={
            <Button onClick={handleOpenAdd} leftIcon={<Plus className="h-4 w-4" />}>
              Schedule Your First Interview
            </Button>
          }
        />
      ) : (
        <div className="space-y-8">
          {/* Upcoming Section */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Upcoming Interviews
              </h3>
              <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                {upcoming.length}
              </span>
            </div>

            {upcoming.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-white px-6 py-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
                You have no upcoming interviews scheduled.
              </div>
            ) : (
              <div className="space-y-3">
                {upcoming.map((item) => (
                  <InterviewCard
                    key={item.id}
                    interview={item}
                    onEdit={handleOpenEdit}
                    onDelete={(target) => setDeletingInterview(target)}
                    onToggleCompleted={toggleInterviewCompleted}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Past / Completed Section */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Past &amp; Completed
              </h3>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {past.length}
              </span>
            </div>

            {past.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-white px-6 py-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
                Completed or past interviews will appear here.
              </div>
            ) : (
              <div className="space-y-3">
                {past.map((item) => (
                  <InterviewCard
                    key={item.id}
                    interview={item}
                    onEdit={handleOpenEdit}
                    onDelete={(target) => setDeletingInterview(target)}
                    onToggleCompleted={toggleInterviewCompleted}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      <InterviewFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingInterview}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingInterview)}
        onClose={() => setDeletingInterview(null)}
        onConfirm={() => {
          if (deletingInterview) {
            deleteInterview(deletingInterview.id);
          }
        }}
        title="Delete Interview"
        message={
          deletingInterview
            ? `Are you sure you want to delete the interview with ${deletingInterview.companyName} for ${deletingInterview.jobTitle}?`
            : ''
        }
        confirmLabel="Delete"
      />
    </div>
  );
}

