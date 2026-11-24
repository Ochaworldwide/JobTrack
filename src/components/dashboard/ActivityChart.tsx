import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ChartPoint {
  label: string;
  applications: number;
}

function getWeekStart(date: Date): Date {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = copy.getDay();
  copy.setDate(copy.getDate() - day);
  return copy;
}

function formatWeekLabel(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function ActivityChart() {
  const { applications, settings } = useApp();
  const isDark = settings.theme === 'dark';

  const chartData = useMemo<ChartPoint[]>(() => {
    const today = new Date();
    const currentWeekStart = getWeekStart(today);
    const weeks: { start: Date; end: Date; label: string; count: number }[] = [];

    for (let i = 5; i >= 0; i -= 1) {
      const start = new Date(currentWeekStart);
      start.setDate(start.getDate() - i * 7);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      weeks.push({
        start,
        end,
        label: formatWeekLabel(start),
        count: 0,
      });
    }

    for (const app of applications) {
      const [y, m, d] = app.applicationDate.split('-').map(Number);
      if (!y || !m || !d) continue;
      const appDate = new Date(y, m - 1, d);
      for (const bucket of weeks) {
        if (appDate >= bucket.start && appDate <= bucket.end) {
          bucket.count += 1;
          break;
        }
      }
    }

    return weeks.map((w) => ({
      label: w.label,
      applications: w.count,
    }));
  }, [applications]);

  const strokeColor = isDark ? '#818cf8' : '#0f172a';
  const fillStart = isDark ? 'rgba(129, 140, 248, 0.28)' : 'rgba(15, 23, 42, 0.14)';
  const fillEnd = isDark ? 'rgba(129, 140, 248, 0.02)' : 'rgba(15, 23, 42, 0.01)';
  const gridColor = isDark ? '#1e293b' : '#e2e8f0';
  const tickColor = isDark ? '#94a3b8' : '#64748b';

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Application Activity
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Applications submitted per week over the last 6 weeks
          </p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          <BarChart3 className="h-4 w-4" />
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="applicationsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={fillStart} stopOpacity={1} />
                <stop offset="95%" stopColor={fillEnd} stopOpacity={1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: tickColor, fontSize: 12 }}
              dy={8}
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fill: tickColor, fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#0f172a' : '#ffffff',
                borderColor: isDark ? '#334155' : '#e2e8f0',
                borderRadius: '0.75rem',
                fontSize: '0.8rem',
                color: isDark ? '#f8fafc' : '#0f172a',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
              }}
              labelFormatter={(label) => `Week of ${label}`}
            />
            <Area
              type="monotone"
              dataKey="applications"
              name="Applications"
              stroke={strokeColor}
              strokeWidth={2.2}
              fill="url(#applicationsFill)"
              activeDot={{ r: 5, strokeWidth: 0, fill: strokeColor }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
