"use client";

import { useMemo, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  APPLICATIONS_CHART_DATA,
  CHART_PERIOD_OPTIONS,
} from "@/constants/dashboard.constants";
import { cn } from "@/lib/utils";

import type { ChartDataPoint } from "@/types/dashboard.types";

type ApplicationsChartProps = {
  data?: ChartDataPoint[];
  className?: string;
};

const CHART_HEIGHT = 240;
const CHART_PADDING = { top: 16, right: 8, bottom: 32, left: 36 };
const Y_AXIS_TICKS = [0, 10, 20, 30, 40];

function buildChartPath(
  data: ChartDataPoint[],
  width: number,
  height: number,
): string {
  const innerWidth = width - CHART_PADDING.left - CHART_PADDING.right;
  const innerHeight = height - CHART_PADDING.top - CHART_PADDING.bottom;
  const maxValue = 40;

  const points = data.map((point, index) => {
    const x =
      CHART_PADDING.left +
      (index / Math.max(data.length - 1, 1)) * innerWidth;
    const y =
      CHART_PADDING.top +
      innerHeight -
      (point.value / maxValue) * innerHeight;
    return { x, y };
  });

  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
}

function buildChartPoints(
  data: ChartDataPoint[],
  width: number,
  height: number,
) {
  const innerWidth = width - CHART_PADDING.left - CHART_PADDING.right;
  const innerHeight = height - CHART_PADDING.top - CHART_PADDING.bottom;
  const maxValue = 40;

  return data.map((point, index) => ({
    x:
      CHART_PADDING.left +
      (index / Math.max(data.length - 1, 1)) * innerWidth,
    y:
      CHART_PADDING.top +
      innerHeight -
      (point.value / maxValue) * innerHeight,
    label: point.label,
  }));
}

export function ApplicationsChart({
  data = APPLICATIONS_CHART_DATA,
  className,
}: ApplicationsChartProps) {
  const [period, setPeriod] = useState<string>(CHART_PERIOD_OPTIONS[0].value);
  const chartWidth = 640;

  const linePath = useMemo(
    () => buildChartPath(data, chartWidth, CHART_HEIGHT),
    [data],
  );

  const points = useMemo(
    () => buildChartPoints(data, chartWidth, CHART_HEIGHT),
    [data],
  );

  const innerHeight =
    CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom;

  return (
    <Card className={cn("rounded-xl shadow-sm", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base font-semibold">
          Applications Over Time
        </CardTitle>
        <select
          value={period}
          onChange={(event) => setPeriod(event.target.value)}
          aria-label="Chart time period"
          className="h-9 rounded-lg border border-input bg-background px-3 text-sm text-muted-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
        >
          {CHART_PERIOD_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartWidth} ${CHART_HEIGHT}`}
            className="h-auto min-w-[320px] w-full"
            role="img"
            aria-label="Line chart showing applications over time"
          >
            {Y_AXIS_TICKS.map((tick) => {
              const y =
                CHART_PADDING.top +
                innerHeight -
                (tick / 40) * innerHeight;
              return (
                <g key={tick}>
                  <line
                    x1={CHART_PADDING.left}
                    y1={y}
                    x2={chartWidth - CHART_PADDING.right}
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
