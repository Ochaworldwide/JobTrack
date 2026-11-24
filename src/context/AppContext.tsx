import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type {
  ApplicationStatus,
  Interview,
  JobApplication,
  SavedJob,
  ToastMessage,
  ToastVariant,
  UserSettings,
} from '../types';
import { generateId, getTodayDateString } from '../utils/formatters';
import {
  createInitialApplications,
  createInitialInterviews,
  createInitialSavedJobs,
  DEFAULT_USER_SETTINGS,
} from '../utils/sampleData';

const STORAGE_KEYS = {
  INITIALIZED: 'jobtrack_initialized_v1',
  APPLICATIONS: 'jobtrack_applications',
  SAVED_JOBS: 'jobtrack_saved_jobs',
  INTERVIEWS: 'jobtrack_interviews',
  SETTINGS: 'jobtrack_settings',
} as const;

type NewApplicationInput = Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>;
type UpdateApplicationInput = Partial<Omit<JobApplication, 'id' | 'createdAt'>>;
type NewSavedJobInput = Omit<SavedJob, 'id' | 'dateSaved'> & { dateSaved?: string };
type NewInterviewInput = Omit<Interview, 'id' | 'createdAt' | 'completed'> & {
  completed?: boolean;
};

interface AppContextValue {
  applications: JobApplication[];
  savedJobs: SavedJob[];
  interviews: Interview[];
  settings: UserSettings;
  toasts: ToastMessage[];
  globalSearch: string;
  setGlobalSearch: (query: string) => void;
  addApplication: (data: NewApplicationInput) => JobApplication;
  updateApplication: (id: string, data: UpdateApplicationInput) => void;
  updateApplicationStatus: (id: string, status: ApplicationStatus) => void;
  deleteApplication: (id: string) => void;
  addSavedJob: (data: NewSavedJobInput) => SavedJob;
  updateSavedJob: (id: string, data: Partial<Omit<SavedJob, 'id'>>) => void;
  deleteSavedJob: (id: string) => void;
  moveSavedJobToApplications: (id: string) => JobApplication | null;
  addInterview: (data: NewInterviewInput) => Interview;
  updateInterview: (id: string, data: Partial<Omit<Interview, 'id' | 'createdAt'>>) => void;
  toggleInterviewCompleted: (id: string) => void;
  deleteInterview: (id: string) => void;
  updateSettings: (data: Partial<UserSettings>) => void;
  toggleTheme: () => void;
  clearAllData: () => void;
  resetPreferences: () => void;
  showToast: (message: string, variant?: ToastVariant) => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

function getSeededInitialData<T>(storageKey: string, factory: () => T): T {
  if (typeof window === 'undefined') return factory();
  const isInitialized = window.localStorage.getItem(STORAGE_KEYS.INITIALIZED);
  if (!isInitialized) {
    return factory();
  }
  const raw = window.localStorage.getItem(storageKey);
  if (raw !== null) {
    try {
      return JSON.parse(raw) as T;
    } catch {
      return factory();
    }
  }
  return factory();
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useLocalStorage<JobApplication[]>(
    STORAGE_KEYS.APPLICATIONS,
    getSeededInitialData(STORAGE_KEYS.APPLICATIONS, createInitialApplications)
  );

  const [savedJobs, setSavedJobs] = useLocalStorage<SavedJob[]>(
    STORAGE_KEYS.SAVED_JOBS,
    getSeededInitialData(STORAGE_KEYS.SAVED_JOBS, createInitialSavedJobs)
  );

  const [interviews, setInterviews] = useLocalStorage<Interview[]>(
    STORAGE_KEYS.INTERVIEWS,
    getSeededInitialData(STORAGE_KEYS.INTERVIEWS, createInitialInterviews)
  );

  const [settings, setSettings] = useLocalStorage<UserSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_USER_SETTINGS
  );

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [globalSearch, setGlobalSearch] = useState('');

  // Persist initial seed once on first launch
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
      window.localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
      window.localStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(savedJobs));
      window.localStorage.setItem(STORAGE_KEYS.INTERVIEWS, JSON.stringify(interviews));
      window.localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      window.localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    }
  }, [applications, interviews, savedJobs, settings]);

  // Sync dark mode class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.theme]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, variant: ToastVariant = 'success') => {
    const id = generateId();
    setToasts((prev) => [...prev, { id, message, variant }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const addApplication = useCallback(
    (data: NewApplicationInput): JobApplication => {
      const now = new Date().toISOString();
      const newApp: JobApplication = {
        ...data,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };
      setApplications((prev) => [newApp, ...prev]);
      showToast(`Added application for ${data.companyName}`);
      return newApp;
    },
    [setApplications, showToast]
  );

  const updateApplication = useCallback(
    (id: string, data: UpdateApplicationInput) => {
      setApplications((prev) =>
        prev.map((app) =>
          app.id === id
            ? { ...app, ...data, updatedAt: new Date().toISOString() }
            : app
        )
      );
      showToast('Application updated');
    },
    [setApplications, showToast]
  );

  const updateApplicationStatus = useCallback(
    (id: string, status: ApplicationStatus) => {
      setApplications((prev) =>
        prev.map((app) =>
          app.id === id
            ? { ...app, status, updatedAt: new Date().toISOString() }
            : app
        )
      );
      showToast(`Status updated to ${status}`);
    },
    [setApplications, showToast]
  );

  const deleteApplication = useCallback(
    (id: string) => {
      setApplications((prev) => prev.filter((app) => app.id !== id));
      showToast('Application deleted', 'info');
    },
    [setApplications, showToast]
  );

  const addSavedJob = useCallback(
    (data: NewSavedJobInput): SavedJob => {
      const newJob: SavedJob = {
        ...data,
        id: generateId(),
        dateSaved: data.dateSaved || getTodayDateString(),
      };
      setSavedJobs((prev) => [newJob, ...prev]);
      showToast(`Saved ${data.jobTitle} at ${data.companyName}`);
      return newJob;
    },
    [setSavedJobs, showToast]
  );

  const updateSavedJob = useCallback(
    (id: string, data: Partial<Omit<SavedJob, 'id'>>) => {
      setSavedJobs((prev) =>
        prev.map((job) => (job.id === id ? { ...job, ...data } : job))
      );
      showToast('Saved job updated');
    },
    [setSavedJobs, showToast]
  );

  const deleteSavedJob = useCallback(
    (id: string) => {
      setSavedJobs((prev) => prev.filter((job) => job.id !== id));
      showToast('Saved job removed', 'info');
    },
    [setSavedJobs, showToast]
  );

  const moveSavedJobToApplications = useCallback(
    (id: string): JobApplication | null => {
      const target = savedJobs.find((job) => job.id === id);
      if (!target) return null;

      const now = new Date().toISOString();
      const createdApp: JobApplication = {
        id: generateId(),
        companyName: target.companyName,
        jobTitle: target.jobTitle,
        location: target.location,
        employmentType: target.employmentType,
        jobPostingUrl: target.jobPostingUrl,
        applicationDate: getTodayDateString(),
        status: 'Applied',
        notes: target.notes,
        createdAt: now,
        updatedAt: now,
      };

      setApplications((prev) => [createdApp, ...prev]);
      setSavedJobs((prev) => prev.filter((job) => job.id !== id));
      showToast(`Moved ${target.companyName} to Applications`);
      return createdApp;
    },
    [savedJobs, setApplications, setSavedJobs, showToast]
  );

  const addInterview = useCallback(
    (data: NewInterviewInput): Interview => {
      const newInterview: Interview = {
        ...data,
        id: generateId(),
        completed: data.completed ?? false,
        createdAt: new Date().toISOString(),
      };
      setInterviews((prev) => [newInterview, ...prev]);
      showToast(`Interview scheduled with ${data.companyName}`);
      return newInterview;
    },
    [setInterviews, showToast]
  );

  const updateInterview = useCallback(
    (id: string, data: Partial<Omit<Interview, 'id' | 'createdAt'>>) => {
      setInterviews((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...data } : item))
      );
      showToast('Interview updated');
    },
    [setInterviews, showToast]
  );

  const toggleInterviewCompleted = useCallback(
    (id: string) => {
      const target = interviews.find((item) => item.id === id);
      if (!target) return;
      const nextCompleted = !target.completed;
      setInterviews((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, completed: nextCompleted } : item
        )
      );
      showToast(
        nextCompleted
          ? `Marked ${target.companyName} interview as completed`
          : `Moved ${target.companyName} interview back to upcoming`,
        'info'
      );
    },
    [interviews, setInterviews, showToast]
  );

  const deleteInterview = useCallback(
    (id: string) => {
      setInterviews((prev) => prev.filter((item) => item.id !== id));
      showToast('Interview deleted', 'info');
    },
    [setInterviews, showToast]
  );

  const updateSettings = useCallback(
    (data: Partial<UserSettings>) => {
      setSettings((prev) => ({ ...prev, ...data }));
    },
    [setSettings]
  );

  const toggleTheme = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light',
    }));
  }, [setSettings]);

  const clearAllData = useCallback(() => {
    setApplications([]);
    setSavedJobs([]);
    setInterviews([]);
    setGlobalSearch('');
    showToast('All application data has been cleared', 'info');
  }, [setApplications, setInterviews, setSavedJobs, showToast]);

  const resetPreferences = useCallback(() => {
    setSettings(DEFAULT_USER_SETTINGS);
    showToast('Preferences reset to defaults', 'info');
  }, [setSettings, showToast]);

  const value = useMemo<AppContextValue>(
    () => ({
      applications,
      savedJobs,
      interviews,
      settings,
      toasts,
      globalSearch,
      setGlobalSearch,
      addApplication,
      updateApplication,
      updateApplicationStatus,
      deleteApplication,
      addSavedJob,
      updateSavedJob,
      deleteSavedJob,
      moveSavedJobToApplications,
      addInterview,
      updateInterview,
      toggleInterviewCompleted,
      deleteInterview,
      updateSettings,
      toggleTheme,
      clearAllData,
      resetPreferences,
      showToast,
      dismissToast,
    }),
    [
      applications,
      savedJobs,
      interviews,
      settings,
      toasts,
      globalSearch,
      addApplication,
      updateApplication,
      updateApplicationStatus,
      deleteApplication,
      addSavedJob,
      updateSavedJob,
      deleteSavedJob,
      moveSavedJobToApplications,
      addInterview,
      updateInterview,
      toggleInterviewCompleted,
      deleteInterview,
      updateSettings,
      toggleTheme,
      clearAllData,
      resetPreferences,
      showToast,
      dismissToast,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return ctx;
}
