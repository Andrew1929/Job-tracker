import { ApplicationsChart } from "@/components/dashboard/ApplicationsChart";
import { RecentApplications } from "@/components/dashboard/RecentApplications";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { UpcomingInterviews } from "@/components/dashboard/UpcomingInterviews";
import { WeeklyGoal } from "@/components/dashboard/WeeklyGoal";

export function DashboardContent() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        Dashboard
      </h1>

      <StatsCards />

      <div className="grid gap-6 xl:grid-cols-3">
        <ApplicationsChart className="xl:col-span-2" />
        <UpcomingInterviews />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <RecentApplications className="xl:col-span-2" />
        <WeeklyGoal />
      </div>
    </div>
  );
}
