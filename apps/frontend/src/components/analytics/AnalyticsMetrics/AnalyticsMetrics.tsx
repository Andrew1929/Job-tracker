import { AnalyticsMetricCard } from "@/components/analytics/AnalyticsMetricCard";

import type { AnalyticsMetric } from "@/types/analytics.types";

type AnalyticsMetricsProps = {
  metrics: AnalyticsMetric[];
};

export function AnalyticsMetrics({ metrics }: AnalyticsMetricsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <AnalyticsMetricCard key={metric.id} metric={metric} />
      ))}
    </div>
  );
}
