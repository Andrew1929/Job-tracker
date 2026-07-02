import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CONVERSION_FUNNEL_STAGES } from "@/constants/analytics.constants";
import { cn } from "@/lib/utils";

type ConversionFunnelProps = {
  className?: string;
};

export function ConversionFunnel({ className }: ConversionFunnelProps) {
  return (
    <Card className={cn("rounded-xl shadow-sm", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">
          Conversion Funnel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {CONVERSION_FUNNEL_STAGES.map((stage) => (
          <div key={stage.id} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">{stage.label}</span>
              <span className="text-muted-foreground">
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
