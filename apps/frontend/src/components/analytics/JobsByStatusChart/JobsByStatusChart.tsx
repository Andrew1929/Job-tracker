import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  JOBS_BY_STATUS_SEGMENTS,
  JOBS_BY_STATUS_TOTAL,
} from "@/constants/analytics.constants";
import { cn } from "@/lib/utils";

type JobsByStatusChartProps = {
  className?: string;
};

const CHART_SIZE = 180;
const STROKE_WIDTH = 28;
const RADIUS = (CHART_SIZE - STROKE_WIDTH) / 2;
const CENTER = CHART_SIZE / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function JobsByStatusChart({ className }: JobsByStatusChartProps) {
  let rotation = -90;

  return (
    <Card className={cn("rounded-xl shadow-sm", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">Jobs by Status</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="relative shrink-0">
            <svg
              width={CHART_SIZE}
              height={CHART_SIZE}
              viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}
              role="img"
              aria-label={`Donut chart showing ${JOBS_BY_STATUS_TOTAL} total jobs by status`}
            >
              {JOBS_BY_STATUS_SEGMENTS.map((segment) => {
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
              })}
            </svg>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-2xl font-bold text-foreground">
                {JOBS_BY_STATUS_TOTAL}
              </p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </div>

          <ul className="w-full space-y-3">
            {JOBS_BY_STATUS_SEGMENTS.map((segment) => (
              <li
                key={segment.status}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cn("size-3 rounded-sm", segment.legendClassName)}
                    aria-hidden="true"
                  />
                  <span className="text-foreground">{segment.status}</span>
                </div>
                <span className="text-muted-foreground">
                  {segment.percentage}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
