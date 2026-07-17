import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { DashboardStat } from "@/types/dashboard.types";

type StatsCardProps = {
  data: DashboardStat;
  icon: LucideIcon;
  iconBgClass: string;
  iconClass: string;
};

export function StatsCard({
  data,
  icon: Icon,
  iconBgClass,
  iconClass,
}: StatsCardProps) {
  const isPositive = data.trendDirection === "up";

  return (
    <Card className="rounded-xl shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">
              {data.title}
            </p>
            <p className="text-3xl font-bold tracking-tight text-foreground">
              {data.value}
            </p>
            <p
              className={cn(
                "text-xs font-medium",
                isPositive ? "text-emerald-600" : "text-red-500",
              )}
            >
              {data.trend}
            </p>
          </div>
          <div
            className={cn(
              "flex size-11 items-center justify-center rounded-full",
              iconBgClass,
            )}
          >
            <Icon className={cn("size-5", iconClass)} aria-hidden="true" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
