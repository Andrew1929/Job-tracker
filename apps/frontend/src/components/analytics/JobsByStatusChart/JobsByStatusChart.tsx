import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StatusChartSegment } from "@/lib/analytics/map-analytics";
import { cn } from "@/lib/utils";

type JobsByStatusChartProps = {
  total: number;
  segments: StatusChartSegment[];
  className?: string;
};

const CHART_SIZE = 180;
const STROKE_WIDTH = 28;
const RADIUS = (CHART_SIZE - STROKE_WIDTH) / 2;
const CENTER = CHART_SIZE / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const EMPTY_RING_COLOR = "#E2E8F0";

export function JobsByStatusChart({
  total,
  segments,
  className,
}: JobsByStatusChartProps) {
  let rotation = -90;

  return (
    <Card className={cn("min-w-0 rounded-xl shadow-sm", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">Jobs by Status</CardTitle>
      </CardHeader>
      <CardContent className="min-w-0 pt-0">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="relative shrink-0">
            <svg
              width={CHART_SIZE}
              height={CHART_SIZE}
              viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}
              role="img"
              aria-label={`Donut chart showing ${total} total jobs by status`}
            >
              {segments.length === 0 ? (
                <circle
                  cx={CENTER}
                  cy={CENTER}
                  r={RADIUS}
                  fill="none"
                  stroke={EMPTY_RING_COLOR}
                  strokeWidth={STROKE_WIDTH}
                />
              ) : (
                segments.map((segment) => {
                  const dash = (segment.percentage / 100) * CIRCUMFERENCE;
                  const circle = (
                    <circle
                      key={segment.status}
                      cx={CENTER}
                      cy={CENTER}
                      r={RADIUS}
                      fill="none"
                      stroke={segment.color}
                      strokeWidth={STROKE_WIDTH}
                      strokeDasharray={`${dash} ${CIRCUMFERENCE - dash}`}
                      transform={`rotate(${rotation} ${CENTER} ${CENTER})`}
                    />
                  );

                  rotation += (segment.percentage / 100) * 360;

                  return circle;
                })
              )}
            </svg>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-2xl font-bold text-foreground">{total}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </div>

          {segments.length > 0 ? (
            <ul className="min-w-0 flex-1 space-y-3">
              {segments.map((segment) => (
                <li
                  key={segment.status}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className={cn(
                        "size-3 shrink-0 rounded-sm",
                        segment.legendClassName,
                      )}
                      aria-hidden="true"
                    />
                    <span className="truncate text-foreground">
                      {segment.label}
                    </span>
                  </div>
                  <span className="shrink-0 text-muted-foreground">
                    {segment.percentage}%
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              No jobs to display yet.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
