import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FunnelStageViewModel } from "@/lib/analytics/map-analytics";
import { cn } from "@/lib/utils";

type ConversionFunnelProps = {
  stages: FunnelStageViewModel[];
  className?: string;
};

export function ConversionFunnel({ stages, className }: ConversionFunnelProps) {
  return (
    <Card className={cn("min-w-0", className)}>
      <CardHeader className="pb-3">
        <CardTitle>Conversion Funnel</CardTitle>
      </CardHeader>
      <CardContent className="min-w-0 space-y-3 pt-0">
        {stages.map((stage) => (
          <div key={stage.stage} className="space-y-2">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-medium text-foreground">{stage.label}</span>
              <span className="shrink-0 text-muted-foreground">
                {stage.count}{" "}
                <span className="text-foreground">({stage.percentage}%)</span>
              </span>
            </div>
            <div className="h-8 overflow-hidden rounded-lg bg-violet-100">
              <div
                className="h-full rounded-lg bg-violet-400"
                style={{ width: `${stage.percentage}%` }}
                role="presentation"
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
