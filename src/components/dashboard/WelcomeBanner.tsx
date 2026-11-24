import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { getTimeBasedGreeting } from '../../utils/formatters';
import { Button } from '../common/Button';

export function WelcomeBanner() {
  const { settings } = useApp();
  const navigate = useNavigate();
  const greeting = getTimeBasedGreeting();

  return (
    <section className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
          {greeting}, {settings.displayName}!
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Stay consistent with your applications — every submission and follow-up brings you closer to the right role.
        </p>
      </div>
      <div className="shrink-0">
        <Button
          onClick={() => navigate('/applications?new=true')}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Add Application
        </Button>
      </div>
    </section>
  );
}

