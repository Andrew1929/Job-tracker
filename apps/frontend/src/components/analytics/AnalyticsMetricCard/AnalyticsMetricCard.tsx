import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { AnalyticsMetric } from "@/types/analytics.types";

type AnalyticsMetricCardProps = {
  metric: AnalyticsMetric;
};

export function AnalyticsMetricCard({ metric }: AnalyticsMetricCardProps) {
  const isPositive = metric.trendDirection === "up";

  return (
    <Card className="rounded-xl shadow-sm">
      <CardContent className="space-y-2 p-6">
        <p className="text-sm font-medium text-muted-foreground">
          {metric.title}
        </p>
        <p className="text-3xl font-bold tracking-tight text-foreground">
          {metric.value}
        </p>
        <p
          className={cn(
            "text-xs font-medium",
            isPositive ? "text-emerald-600" : "text-red-500",
          )}
        >
          {metric.trend}
        </p>
      </CardContent>
    </Card>
  );
}
