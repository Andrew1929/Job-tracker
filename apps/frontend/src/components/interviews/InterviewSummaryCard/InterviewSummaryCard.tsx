import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { LucideIcon } from "lucide-react";

type InterviewSummaryCardProps = {
  label: string;
  value: number;
  icon: LucideIcon;
  iconBgClass: string;
  iconClass: string;
};

/**
 * Compact sibling of the dashboard `StatsCard`: same card shell, icon bubble
 * and type scale, without the trend line these counts have no basis for.
 */
export function InterviewSummaryCard({
  label,
  value,
  icon: Icon,
  iconBgClass,
  iconClass,
}: InterviewSummaryCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold tracking-tight text-foreground">
            {value}
          </p>
        </div>
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full",
            iconBgClass,
          )}
        >
          <Icon className={cn("size-5", iconClass)} aria-hidden="true" />
        </div>
      </CardContent>
    </Card>
  );
}
