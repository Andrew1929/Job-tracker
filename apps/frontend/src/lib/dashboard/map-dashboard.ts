import {
  formatDateOnly,
  formatDateOnlyShort,
  toLocalDateOnlyKey,
} from "@/lib/date/date-only";
import { toLocalDateKey } from "@/lib/date/date-time";
import { formatDateValue } from "@/lib/format/date";
import type {
  AnalyticsSummary,
  AnalyticsTimeSeriesPoint,
  MetricSummary,
} from "@/types/analytics.types";
import type {
  ChartDataPoint,
  DashboardStat,
  RecentApplication,
  UpcomingInterview,
} from "@/types/dashboard.types";
import type { Job } from "@/types/jobs.types";

// Deterministic avatar palette so a given company always gets the same colour.
const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-orange-500",
  "bg-indigo-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-rose-500",
  "bg-sky-600",
  "bg-amber-500",
] as const;

const FALLBACK_COMPANY = {
  company: "—",
  companyInitial: "?",
  companyColor: "bg-slate-400",
} as const;

type CompanyAvatar = {
  company: string;
  companyInitial: string;
  companyColor: string;
};

function resolveCompanyAvatar(job: Job): CompanyAvatar {
  const name = job.company?.name?.trim();
  if (!name) {
    return { ...FALLBACK_COMPANY };
  }

  let hash = 0;
  for (let index = 0; index < name.length; index += 1) {
    hash = (hash * 31 + name.charCodeAt(index)) | 0;
  }

  return {
    company: name,
    companyInitial: name.charAt(0).toUpperCase(),
    companyColor: AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length],
  };
}

function formatStatTrend(metric: MetricSummary): string {
  const rounded = Math.round(Math.abs(metric.changePercent) * 10) / 10;

  if (metric.changePercent > 0) {
    return `+${rounded}% from last month`;
  }

  if (metric.changePercent < 0) {
    return `-${rounded}% from last month`;
  }

  return "No change from last month";
}

function formatCount(value: number): string {
  return String(Math.round(value));
}

function formatPercent(value: number): string {
  return `${Math.round(value * 10) / 10}%`;
}

export function mapSummaryToDashboardStats(
  summary: AnalyticsSummary,
): DashboardStat[] {
  return [
    {
      id: "applications",
      title: "Applications",
      value: formatCount(summary.applications.value),
      trend: formatStatTrend(summary.applications),
      trendDirection: summary.applications.trendDirection,
    },
    {
      id: "interviews",
      title: "Interviews",
      value: formatCount(summary.interviews.value),
      trend: formatStatTrend(summary.interviews),
      trendDirection: summary.interviews.trendDirection,
    },
    {
      id: "offers",
      title: "Offers",
      value: formatCount(summary.offers.value),
      trend: formatStatTrend(summary.offers),
      trendDirection: summary.offers.trendDirection,
    },
    {
      id: "acceptance-rate",
      title: "Acceptance Rate",
      value: formatPercent(summary.acceptanceRate.value),
      trend: formatStatTrend(summary.acceptanceRate),
      trendDirection: summary.acceptanceRate.trendDirection,
    },
  ];
}

export function mapApplicationsSeries(
  points: AnalyticsTimeSeriesPoint[],
): ChartDataPoint[] {
  return points.map((point) => ({
    label: point.label,
    value: point.applications,
  }));
}

// Most-recent applications first. `jobs` is expected pre-sorted by createdAt
// desc (the shared default jobs query), so we only drop not-yet-applied jobs.
export function mapRecentApplications(
  jobs: Job[],
  limit: number,
): RecentApplication[] {
  return jobs
    .filter((job) => job.status !== "SAVED")
    .slice(0, limit)
    .map((job) => ({
      id: job.id,
      ...resolveCompanyAvatar(job),
      role: job.title,
      status: job.status,
      // `appliedAt` is a calendar date, `createdAt` a real timestamp.
      date: job.appliedAt
        ? formatDateOnly(job.appliedAt)
        : formatDateValue(job.createdAt),
    }));
}

type ScheduledInterview = {
  job: Job;
  dateKey: string;
};

/**
 * "Upcoming" compares local days rather than instants, so an action stays listed
 * for the rest of the user's day instead of disappearing the moment its time
 * passes. Both sides of the comparison use local components.
 */
function toScheduledInterview(job: Job, todayKey: string): ScheduledInterview[] {
  if (job.status !== "INTERVIEWING") {
    return [];
  }

  const dateKey = toLocalDateKey(job.nextActionDate);
  return dateKey && dateKey >= todayKey ? [{ job, dateKey }] : [];
}

export function mapUpcomingInterviews(
  jobs: Job[],
  now: Date,
  limit: number,
): UpcomingInterview[] {
  const todayKey = toLocalDateOnlyKey(now);

  return jobs
    .flatMap((job) => toScheduledInterview(job, todayKey))
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey))
    .slice(0, limit)
    .map(({ job, dateKey }) => ({
      id: job.id,
      ...resolveCompanyAvatar(job),
      role: job.title,
      date: formatDateOnlyShort(dateKey),
    }));
}
