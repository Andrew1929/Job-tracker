import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APPLICATIONS_OVER_TIME_DATA } from "@/constants/analytics.constants";
import { buildLinePath, buildLinePoints } from "@/lib/chart/line-path";
import { cn } from "@/lib/utils";

type ApplicationsOverTimeChartProps = {
  className?: string;
};

const CHART_HEIGHT = 240;
const CHART_WIDTH = 640;
const CHART_PADDING = { top: 16, right: 8, bottom: 32, left: 36 };
const Y_AXIS_TICKS = [0, 10, 20, 30, 40];
const MAX_VALUE = 40;

export function ApplicationsOverTimeChart({
  className,
}: ApplicationsOverTimeChartProps) {
  const labels = APPLICATIONS_OVER_TIME_DATA.map((point) => point.label);
  const applicationValues = APPLICATIONS_OVER_TIME_DATA.map(
    (point) => point.applications,
  );
  const interviewValues = APPLICATIONS_OVER_TIME_DATA.map(
    (point) => point.interviews,
  );

  const applicationsPath = buildLinePath(
    applicationValues,
    CHART_WIDTH,
    CHART_HEIGHT,
    CHART_PADDING,
    MAX_VALUE,
  );
  const interviewsPath = buildLinePath(
    interviewValues,
    CHART_WIDTH,
    CHART_HEIGHT,
    CHART_PADDING,
    MAX_VALUE,
  );
  const applicationPoints = buildLinePoints(
    applicationValues,
    labels,
    CHART_WIDTH,
    CHART_HEIGHT,
    CHART_PADDING,
    MAX_VALUE,
  );

  const innerHeight =
    CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom;

  return (
    <Card className={cn("rounded-xl shadow-sm", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">
          Applications Over Time
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            className="h-auto min-w-[320px] w-full"
            role="img"
            aria-label="Line chart showing applications and interviews over time"
          >
            {Y_AXIS_TICKS.map((tick) => {
              const y =
                CHART_PADDING.top +
                innerHeight -
                (tick / MAX_VALUE) * innerHeight;

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
              d={interviewsPath}
              fill="none"
              stroke="#38BDF8"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <path
              d={applicationsPath}
              fill="none"
              stroke="#7C3AED"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {applicationPoints.map((point) => (
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
