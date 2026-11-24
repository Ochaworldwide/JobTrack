import { useState, type FormEvent } from 'react';
import { Moon, RotateCcw, Save, Sun, Trash2 } from 'lucide-react';
import { Button } from '../components/common/Button';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Input } from '../components/common/Input';
import { useApp } from '../context/AppContext';

export function Settings() {
  const {
    settings,
    updateSettings,
    clearAllData,
    resetPreferences,
    showToast,
    applications,
    savedJobs,
    interviews,
  } = useApp();

  const [draftName, setDraftName] = useState<string | null>(null);
  const [nameError, setNameError] = useState('');
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const displayName = draftName ?? settings.displayName;

  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = displayName.trim();
    if (!trimmed) {
      setNameError('Display name cannot be empty.');
      return;
    }
    setNameError('');
    updateSettings({ displayName: trimmed });
    setDraftName(null);
    showToast('Display name updated');
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Settings
        </h2>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
          Manage your profile, appearance, and locally stored workspace data.
        </p>
      </div>

      {/* Profile Section */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          Profile
        </h3>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
          Your display name is shown in the dashboard greeting and navigation bar.
        </p>

        <form onSubmit={handleSaveProfile} className="mt-5 max-w-md space-y-4">
          <Input
            label="Display Name"
            required
            placeholder="Enter your name"
            value={displayName}
            onChange={(e) => {
              setDraftName(e.target.value);
              if (nameError) setNameError('');
            }}
            error={nameError}
          />
          <Button type="submit" leftIcon={<Save className="h-4 w-4" />}>
            Save Name
          </Button>
        </form>
      </section>

      {/* Appearance Section */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          Appearance
        </h3>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
          Choose between light and dark themes for JobTrack.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => updateSettings({ theme: 'light' })}
            className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all cursor-pointer ${
              settings.theme === 'light'
                ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900 dark:border-indigo-500 dark:bg-slate-800/80 dark:ring-indigo-500'
                : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50'
            }`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
              <Sun className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Light Mode
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Clean white workspace
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => updateSettings({ theme: 'dark' })}
            className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all cursor-pointer ${
              settings.theme === 'dark'
                ? 'border-indigo-500 bg-slate-800/80 ring-1 ring-indigo-500'
                : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50'
            }`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Moon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Dark Mode
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Reduced eye strain in low light
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* Data & Preferences */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          Data &amp; Preferences
        </h3>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
          Currently storing {applications.length} applications, {savedJobs.length} saved
          jobs, and {interviews.length} interviews in LocalStorage.
        </p>

        <div className="mt-5 divide-y divide-slate-100 dark:divide-slate-800">
          <div className="flex flex-col justify-between gap-3 py-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Reset Application Preferences
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Restore default display name, theme, and sidebar settings. Your saved records remain intact.
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => setConfirmResetOpen(true)}
              leftIcon={<RotateCcw className="h-4 w-4" />}
              className="shrink-0"
            >
              Reset Preferences
            </Button>
          </div>

          <div className="flex flex-col justify-between gap-3 pt-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-rose-600 dark:text-rose-400">
                Clear All Application Data
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Permanently remove all applications, saved jobs, and scheduled interviews from this browser.
              </p>
            </div>
            <Button
              variant="danger"
              onClick={() => setConfirmClearOpen(true)}
              leftIcon={<Trash2 className="h-4 w-4" />}
              className="shrink-0"
            >
              Clear All Data
            </Button>
          </div>
        </div>
      </section>

      <ConfirmDialog
        isOpen={confirmResetOpen}
        onClose={() => setConfirmResetOpen(false)}
        onConfirm={() => {
          resetPreferences();
          setDraftName(null);
        }}
        title="Reset Preferences"
        message="This will restore the default display name, light theme, and sidebar layout. Your job applications and interviews will not be deleted."
        confirmLabel="Reset Preferences"
        variant="primary"
      />

      <ConfirmDialog
        isOpen={confirmClearOpen}
        onClose={() => setConfirmClearOpen(false)}
        onConfirm={clearAllData}
        title="Clear All Application Data"
        message="Are you sure you want to permanently delete all job applications, saved jobs, and interviews? This action cannot be undone."
        confirmLabel="Clear Everything"
        variant="danger"
      />
    </div>
  );
}
