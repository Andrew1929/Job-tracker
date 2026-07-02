import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ANALYTICS_INSIGHTS } from "@/constants/analytics.constants";
import { cn } from "@/lib/utils";

type AnalyticsInsightsProps = {
  className?: string;
};

export function AnalyticsInsights({ className }: AnalyticsInsightsProps) {
  return (
    <Card className={cn("rounded-xl shadow-sm", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">Insights</CardTitle>
      </CardHeader>
      <CardContent className="flex h-full flex-col pt-0">
        <ul className="space-y-3 text-sm text-foreground">
          {ANALYTICS_INSIGHTS.map((insight) => (
            <li key={insight.id} className="flex gap-2">
              <span className="text-muted-foreground" aria-hidden="true">
                •
              </span>
              <span>{insight.text}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-6 text-right">
          <Link
            href="#"
            className="text-sm font-medium text-primary hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
          >
            View full report &gt;
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
