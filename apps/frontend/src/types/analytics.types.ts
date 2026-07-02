import type { TrendDirection } from "@/types/dashboard.types";
import type { JobStatus } from "@/types/job-status.types";

export type AnalyticsMetric = {
  id: string;
  title: string;
  value: string;
  trend: string;
  trendDirection: TrendDirection;
};

export type AnalyticsChartPoint = {
  label: string;
  applications: number;
  interviews: number;
};

export type StatusDistributionSegment = {
  status: JobStatus;
  percentage: number;
  color: string;
  legendClassName: string;
};

export type ConversionFunnelStage = {
  id: string;
  label: string;
  count: number;
  percentage: number;
};

export type AnalyticsInsight = {
  id: string;
  text: string;
};
