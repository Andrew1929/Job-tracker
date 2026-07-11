import { STATUS_CHART_STYLES } from "@/constants/analytics.constants";
import { JOB_STATUS_LABELS } from "@/constants/jobs.constants";
import type {
  AnalyticsMetric,
  AnalyticsSummary,
  AnalyticsTimeSeriesPoint,
  ConversionFunnelStage,
  MetricSummary,
  StatusDistribution,
} from "@/types/analytics.types";
import type { JobStatus } from "@/types/jobs.types";

export type StatusChartSegment = {
  status: JobStatus;
  count: number;
  percentage: number;
  color: string;
  legendClassName: string;
  label: string;
};

export type FunnelStageViewModel = {
  stage: JobStatus;
  label: string;
  count: number;
  percentage: number;
};

function formatTrend(metric: MetricSummary): string {
  const rounded = Math.round(Math.abs(metric.changePercent) * 10) / 10;

  if (metric.changePercent > 0) {
    return `+${rounded}%`;
  }

  if (metric.changePercent < 0) {
    return `-${rounded}%`;
  }

  return "0%";
}

function formatMetricValue(id: string, value: number): string {
  const rounded = Math.round(value * 10) / 10;

  if (id === "acceptance-rate") {
    return `${rounded}%`;
  }

  return String(rounded);
}

export function mapSummaryToMetrics(
  summary: AnalyticsSummary,
): AnalyticsMetric[] {
  return [
    {
      id: "applications",
      title: "Applications",
      value: formatMetricValue("applications", summary.applications.value),
      trend: formatTrend(summary.applications),
      trendDirection: summary.applications.trendDirection,
    },
    {
      id: "interviews",
      title: "Interviews",
      value: formatMetricValue("interviews", summary.interviews.value),
      trend: formatTrend(summary.interviews),
      trendDirection: summary.interviews.trendDirection,
    },
    {
      id: "offers",
      title: "Offers",
      value: formatMetricValue("offers", summary.offers.value),
      trend: formatTrend(summary.offers),
      trendDirection: summary.offers.trendDirection,
    },
    {
      id: "acceptance-rate",
      title: "Acceptance Rate",
      value: formatMetricValue("acceptance-rate", summary.acceptanceRate.value),
      trend: formatTrend(summary.acceptanceRate),
      trendDirection: summary.acceptanceRate.trendDirection,
    },
  ];
}

export function mapStatusDistribution(distribution: StatusDistribution): {
  total: number;
  segments: StatusChartSegment[];
} {
  return {
    total: distribution.total,
    segments: distribution.segments.map((segment) => ({
      ...segment,
      label: JOB_STATUS_LABELS[segment.status],
      ...STATUS_CHART_STYLES[segment.status],
    })),
  };
}

export function mapConversionFunnel(
  stages: ConversionFunnelStage[],
): FunnelStageViewModel[] {
  return stages.map((stage) => ({
    ...stage,
    label: JOB_STATUS_LABELS[stage.stage],
  }));
}

export function computeChartMax(points: AnalyticsTimeSeriesPoint[]): number {
  const peak = Math.max(
    0,
    ...points.flatMap((point) => [point.applications, point.interviews]),
  );

  if (peak === 0) {
    return 10;
  }

  const magnitude = 10 ** Math.floor(Math.log10(peak));
  return Math.ceil(peak / magnitude) * magnitude;
}

export function buildYAxisTicks(maxValue: number): number[] {
  const step = maxValue / 4;
  return Array.from({ length: 5 }, (_, index) => Math.round(index * step));
}
