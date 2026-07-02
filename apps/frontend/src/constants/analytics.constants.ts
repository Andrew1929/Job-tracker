import type {
  AnalyticsChartPoint,
  AnalyticsInsight,
  AnalyticsMetric,
  ConversionFunnelStage,
  StatusDistributionSegment,
} from "@/types/analytics.types";

export const ANALYTICS_METRICS: AnalyticsMetric[] = [
  {
    id: "applications",
    title: "Applications",
    value: "24",
    trend: "+ 12%",
    trendDirection: "up",
  },
  {
    id: "interviews",
    title: "Interviews",
    value: "5",
    trend: "+ 8%",
    trendDirection: "up",
  },
  {
    id: "offers",
    title: "Offers",
    value: "2",
    trend: "+ 100%",
    trendDirection: "up",
  },
  {
    id: "acceptance-rate",
    title: "Acceptance Rate",
    value: "8.3%",
    trend: "+ 5%",
    trendDirection: "up",
  },
];

export const APPLICATIONS_OVER_TIME_DATA: AnalyticsChartPoint[] = [
  { label: "May 1", applications: 12, interviews: 8 },
  { label: "May 8", applications: 18, interviews: 10 },
  { label: "May 15", applications: 15, interviews: 12 },
  { label: "May 22", applications: 28, interviews: 14 },
  { label: "May 29", applications: 32, interviews: 18 },
];

export const JOBS_BY_STATUS_SEGMENTS: StatusDistributionSegment[] = [
  {
    status: "Applied",
    percentage: 40,
    color: "#3B82F6",
    legendClassName: "bg-blue-500",
  },
  {
    status: "Screening",
    percentage: 20,
    color: "#38BDF8",
    legendClassName: "bg-sky-400",
  },
  {
    status: "Interview",
    percentage: 20,
    color: "#8B5CF6",
    legendClassName: "bg-violet-500",
  },
  {
    status: "Offer",
    percentage: 10,
    color: "#10B981",
    legendClassName: "bg-emerald-500",
  },
  {
    status: "Rejected",
    percentage: 10,
    color: "#EF4444",
    legendClassName: "bg-red-500",
  },
];

export const JOBS_BY_STATUS_TOTAL = 24;

export const CONVERSION_FUNNEL_STAGES: ConversionFunnelStage[] = [
  { id: "applied", label: "Applied", count: 24, percentage: 100 },
  { id: "screening", label: "Screening", count: 12, percentage: 50 },
  { id: "interview", label: "Interview", count: 5, percentage: 21 },
  { id: "offer", label: "Offer", count: 2, percentage: 8 },
];

export const ANALYTICS_INSIGHTS: AnalyticsInsight[] = [
  {
    id: "1",
    text: "Your interview rate is 21%, good job! 🎉",
  },
  {
    id: "2",
    text: "You have 3 interviews scheduled this week.",
  },
  {
    id: "3",
    text: "Your offer rate improved by 100% this month.",
  },
  {
    id: "4",
    text: "Applied volume is up 12% compared to last month.",
  },
];
