import { ActivityChart } from '../components/dashboard/ActivityChart';
import { RecentApplications } from '../components/dashboard/RecentApplications';
import { StatsGrid } from '../components/dashboard/StatsGrid';
import { UpcomingInterviews } from '../components/dashboard/UpcomingInterviews';
import { WelcomeBanner } from '../components/dashboard/WelcomeBanner';

export function Dashboard() {
  return (
    <div className="space-y-6">
      <WelcomeBanner />
      <StatsGrid />
      <ActivityChart />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentApplications />
        </div>
        <div>
          <UpcomingInterviews />
        </div>
      </div>
    </div>
  );
}

