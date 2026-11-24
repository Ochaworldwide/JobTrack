import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { ToastVariant } from '../../types';

const VARIANT_STYLES: Record<
  ToastVariant,
  { container: string; icon: typeof CheckCircle2 }
> = {
  success: {
    container:
      'border-emerald-200 bg-white text-slate-900 dark:border-emerald-900/70 dark:bg-slate-900 dark:text-slate-100',
    icon: CheckCircle2,
  },
  error: {
    container:
      'border-rose-200 bg-white text-slate-900 dark:border-rose-900/70 dark:bg-slate-900 dark:text-slate-100',
    icon: XCircle,
  },
  info: {
    container:
      'border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100',
    icon: Info,
  },
};

const ICON_COLORS: Record<ToastVariant, string> = {
  success: 'text-emerald-500',
  error: 'text-rose-500',
  info: 'text-indigo-500',
};

export function ToastContainer() {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex max-w-sm flex-col gap-2"
      role="status"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const config = VARIANT_STYLES[toast.variant];
        const Icon = config.icon;
        return (
          <div
            key={toast.id}
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg transition-all ${config.container}`}
          >
            <Icon className={`h-4 w-4 shrink-0 ${ICON_COLORS[toast.variant]}`} />
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

