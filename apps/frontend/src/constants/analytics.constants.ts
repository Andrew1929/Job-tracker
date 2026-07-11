import type { JobStatus } from "@/types/jobs.types";

export const ANALYTICS_API_PATHS = {
  overview: "/api/analytics/overview",
} as const;

type StatusChartStyle = {
  color: string;
  legendClassName: string;
};

// Presentation config for the status donut chart. Every backend `JobStatus`
// must have a colour so real distribution data always renders.
export const STATUS_CHART_STYLES: Record<JobStatus, StatusChartStyle> = {
  SAVED: { color: "#94A3B8", legendClassName: "bg-slate-400" },
  APPLIED: { color: "#3B82F6", legendClassName: "bg-blue-500" },
  SCREENING: { color: "#6366F1", legendClassName: "bg-indigo-500" },
  INTERVIEWING: { color: "#8B5CF6", legendClassName: "bg-violet-500" },
  OFFER: { color: "#10B981", legendClassName: "bg-emerald-500" },
  ACCEPTED: { color: "#22C55E", legendClassName: "bg-green-500" },
  REJECTED: { color: "#EF4444", legendClassName: "bg-red-500" },
  WITHDRAWN: { color: "#F59E0B", legendClassName: "bg-amber-500" },
};
