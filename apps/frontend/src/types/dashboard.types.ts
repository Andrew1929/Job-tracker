import type { TrendDirection } from "@/types/analytics.types";
import type { JobStatus } from "@/types/jobs.types";

export type DashboardStatId =
  | "applications"
  | "interviews"
  | "offers"
  | "acceptance-rate";

export type DashboardStat = {
  id: DashboardStatId;
  title: string;
  value: string;
  trend: string;
  trendDirection: TrendDirection;
};

export type ChartDataPoint = {
  label: string;
  value: number;
};

export type UpcomingInterview = {
  id: string;
  company: string;
  companyInitial: string;
  companyColor: string;
  role: string;
  dateTime: string;
};

export type RecentApplication = {
  id: string;
  company: string;
  companyInitial: string;
  companyColor: string;
  role: string;
  status: JobStatus;
  date: string;
};
