import { AnalyticsInsights } from "@/components/analytics/AnalyticsInsights";
import { AnalyticsMetrics } from "@/components/analytics/AnalyticsMetrics";
import { ApplicationsOverTimeChart } from "@/components/analytics/ApplicationsOverTimeChart";
import { ConversionFunnel } from "@/components/analytics/ConversionFunnel";
import { JobsByStatusChart } from "@/components/analytics/JobsByStatusChart";

export function AnalyticsContent() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        Analytics
      </h1>

      <AnalyticsMetrics />

      <div className="grid gap-6 xl:grid-cols-3">
        <ApplicationsOverTimeChart className="xl:col-span-2" />
        <JobsByStatusChart />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <ConversionFunnel className="xl:col-span-2" />
        <AnalyticsInsights />
      </div>
    </div>
  );
}
