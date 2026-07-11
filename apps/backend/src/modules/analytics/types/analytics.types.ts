import { JobStatus, Prisma } from '../../../../generated/prisma/client';

export const ANALYTICS_JOB_SELECT = {
  id: true,
  status: true,
  appliedAt: true,
  createdAt: true,
} satisfies Prisma.JobSelect;

export const ANALYTICS_ACTIVITY_SELECT = {
  jobId: true,
  createdAt: true,
  toStatus: true,
} satisfies Prisma.JobActivitySelect;

export type AnalyticsJob = Prisma.JobGetPayload<{
  select: typeof ANALYTICS_JOB_SELECT;
}>;

export type AnalyticsActivity = Prisma.JobActivityGetPayload<{
  select: typeof ANALYTICS_ACTIVITY_SELECT;
}>;

export type TrendDirection = 'up' | 'down';

export interface MetricSummary {
  value: number;
  changePercent: number;
  trendDirection: TrendDirection;
}

export interface AnalyticsSummary {
  applications: MetricSummary;
  interviews: MetricSummary;
  offers: MetricSummary;
  acceptanceRate: MetricSummary;
}

export interface TimeSeriesPoint {
  label: string;
  applications: number;
  interviews: number;
}

export interface StatusDistributionSegment {
  status: JobStatus;
  count: number;
  percentage: number;
}

export interface StatusDistribution {
  total: number;
  segments: StatusDistributionSegment[];
}

export interface FunnelStage {
  stage: JobStatus;
  count: number;
  percentage: number;
}

export interface AnalyticsInsight {
  id: string;
  text: string;
}

export interface AnalyticsOverview {
  rangeStart: string;
  rangeEnd: string;
  summary: AnalyticsSummary;
  applicationsOverTime: TimeSeriesPoint[];
  statusDistribution: StatusDistribution;
  conversionFunnel: FunnelStage[];
  insights: AnalyticsInsight[];
}
