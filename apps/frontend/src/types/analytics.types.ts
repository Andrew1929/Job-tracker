import type { JobStatus } from "@/types/jobs.types";

export type TrendDirection = "up" | "down";

export type MetricSummary = {
  value: number;
  changePercent: number;
  trendDirection: TrendDirection;
};

export type AnalyticsSummary = {
  applications: MetricSummary;
  interviews: MetricSummary;
  offers: MetricSummary;
  acceptanceRate: MetricSummary;
};

export type AnalyticsTimeSeriesPoint = {
  label: string;
  applications: number;
  interviews: number;
};

export type StatusDistributionSegment = {
  status: JobStatus;
  count: number;
  percentage: number;
};

export type StatusDistribution = {
  total: number;
  segments: StatusDistributionSegment[];
};

export type ConversionFunnelStage = {
  stage: JobStatus;
  count: number;
  percentage: number;
};

export type AnalyticsInsight = {
  id: string;
  text: string;
};

export type AnalyticsOverview = {
  rangeStart: string;
  rangeEnd: string;
  summary: AnalyticsSummary;
  applicationsOverTime: AnalyticsTimeSeriesPoint[];
  statusDistribution: StatusDistribution;
  conversionFunnel: ConversionFunnelStage[];
  insights: AnalyticsInsight[];
};

// View-model consumed by the metric cards.
export type AnalyticsMetric = {
  id: string;
  title: string;
  value: string;
  trend: string;
  trendDirection: TrendDirection;
};
