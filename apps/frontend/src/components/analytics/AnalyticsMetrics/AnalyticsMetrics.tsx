import { AnalyticsMetricCard } from "@/components/analytics/AnalyticsMetricCard";
import { ANALYTICS_METRICS } from "@/constants/analytics.constants";

export function AnalyticsMetrics() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {ANALYTICS_METRICS.map((metric) => (
        <AnalyticsMetricCard key={metric.id} metric={metric} />
      ))}
    </div>
  );
}
