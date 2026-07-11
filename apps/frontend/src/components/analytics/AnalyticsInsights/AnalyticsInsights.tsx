import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { AnalyticsInsight } from "@/types/analytics.types";

type AnalyticsInsightsProps = {
  insights: AnalyticsInsight[];
  className?: string;
};

export function AnalyticsInsights({
  insights,
  className,
}: AnalyticsInsightsProps) {
  return (
    <Card className={cn("flex min-w-0 flex-col rounded-xl shadow-sm", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">Insights</CardTitle>
      </CardHeader>
      <CardContent className="flex min-w-0 flex-1 flex-col pt-0">
        {insights.length > 0 ? (
          <ul className="space-y-3 text-sm text-foreground">
            {insights.map((insight) => (
              <li key={insight.id} className="flex gap-2">
                <span className="text-muted-foreground" aria-hidden="true">
                  •
                </span>
                <span>{insight.text}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            Insights will appear once you have enough activity to analyze.
          </p>
        )}

        <div className="mt-auto pt-6 text-right">
          <Link
            href="#"
            className="rounded-sm text-sm font-medium text-primary hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            View full report &gt;
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
