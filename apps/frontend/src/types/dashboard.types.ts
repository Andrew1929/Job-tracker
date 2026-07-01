import type { JobStatus } from "@/types/job-status.types";

export type TrendDirection = "up" | "down";

export type StatCardData = {
  id: string;
  title: string;
  value: number;
  trend: string;
  trendDirection: TrendDirection;
  iconBgClass: string;
  iconClass: string;
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

export type ApplicationStatus = Extract<
  JobStatus,
  "Interview" | "Applied" | "Offer"
>;

export type RecentApplication = {
  id: string;
  company: string;
  companyInitial: string;
  companyColor: string;
  role: string;
  status: ApplicationStatus;
  date: string;
};

export type WeeklyGoalData = {
  current: number;
  target: number;
};
