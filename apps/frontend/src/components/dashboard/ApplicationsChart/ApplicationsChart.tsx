import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildYAxisTicks, niceAxisMax } from "@/lib/analytics/map-analytics";
import { buildLinePath, buildLinePoints } from "@/lib/chart/line-path";
import { cn } from "@/lib/utils";

import type { ChartDataPoint } from "@/types/dashboard.types";

type ApplicationsChartProps = {
  data: ChartDataPoint[];
  className?: string;
};

const CHART_HEIGHT = 240;
const CHART_WIDTH = 640;
const CHART_PADDING = { top: 16, right: 8, bottom: 32, left: 36 };

export function ApplicationsChart({ data, className }: ApplicationsChartProps) {
  const labels = data.map((point) => point.label);
  const values = data.map((point) => point.value);
  const maxValue = niceAxisMax(Math.max(0, ...values));
  const yAxisTicks = buildYAxisTicks(maxValue);

  const linePath = buildLinePath(
    values,
    CHART_WIDTH,
    CHART_HEIGHT,
    CHART_PADDING,
    maxValue,
  );
  const points = buildLinePoints(
    values,
    labels,
    CHART_WIDTH,
    CHART_HEIGHT,
    CHART_PADDING,
    maxValue,
  );

  const innerHeight = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom;

  return (
    <Card className={cn("min-w-0 rounded-xl shadow-sm", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">
          Applications Over Time
        </CardTitle>
      </CardHeader>
      <CardContent className="min-w-0 pt-0">
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            className="h-auto min-w-[320px] w-full"
            role="img"
            aria-label="Line chart showing applications over time"
          >
            {yAxisTicks.map((tick) => {
              const y =
                CHART_PADDING.top +
                innerHeight -
                (tick / maxValue) * innerHeight;
              return (
                <g key={tick}>
                  <line
                    x1={CHART_PADDING.left}
                    y1={y}
                    x2={CHART_WIDTH - CHART_PADDING.right}
                    y2={y}
                    stroke="#E2E8F0"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={CHART_PADDING.left - 8}
                    y={y + 4}
                    textAnchor="end"
                    className="fill-muted-foreground text-[11px]"
                  >
                    {tick}
                  </text>
                </g>
              );
            })}

            <path
              d={linePath}
              fill="none"
              stroke="#7C3AED"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {points.map((point) => (
              <g key={point.label}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={5}
                  fill="#FFFFFF"
                  stroke="#7C3AED"
                  strokeWidth={2}
                />
                <text
                  x={point.x}
                  y={CHART_HEIGHT - 8}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[11px]"
                >
                  {point.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
