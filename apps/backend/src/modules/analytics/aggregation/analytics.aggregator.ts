import { JobStatus } from '../../../../generated/prisma/client';
import {
  ANALYTICS_BUCKET_DAYS,
  ANALYTICS_WINDOW_DAYS,
} from '../constants/analytics.constants';
import {
  AnalyticsActivity,
  AnalyticsInsight,
  AnalyticsJob,
  AnalyticsOverview,
  AnalyticsSummary,
  FunnelStage,
  MetricSummary,
  StatusDistribution,
  TimeSeriesPoint,
} from '../types/analytics.types';

const DAY_MS = 24 * 60 * 60 * 1000;
const PERCENT = 100;

interface AnalyticsInput {
  jobs: AnalyticsJob[];
  activities: AnalyticsActivity[];
  now: Date;
}

interface DateRange {
  start: Date;
  end: Date;
}

export function buildAnalyticsOverview(
  input: AnalyticsInput,
): AnalyticsOverview {
  const { jobs, activities, now } = input;

  const current = windowEndingAt(now, ANALYTICS_WINDOW_DAYS);
  const previous = windowEndingAt(current.start, ANALYTICS_WINDOW_DAYS);

  const applicationDates = collectApplicationDates(jobs);
  const interviewDates = collectTransitionDates(
    activities,
    JobStatus.INTERVIEWING,
  );
  const offerDates = collectTransitionDates(activities, JobStatus.OFFER);

  const summary = buildSummary(
    applicationDates,
    interviewDates,
    offerDates,
    current,
    previous,
  );

  return {
    rangeStart: current.start.toISOString(),
    rangeEnd: current.end.toISOString(),
    summary,
    applicationsOverTime: buildTimeSeries(
      applicationDates,
      interviewDates,
      current,
    ),
    statusDistribution: buildStatusDistribution(jobs),
    conversionFunnel: buildConversionFunnel(jobs, activities),
    insights: buildInsights(summary),
  };
}

function buildSummary(
  applicationDates: Date[],
  interviewDates: Date[],
  offerDates: Date[],
  current: DateRange,
  previous: DateRange,
): AnalyticsSummary {
  const applicationsCurrent = countWithin(applicationDates, current);
  const applicationsPrevious = countWithin(applicationDates, previous);
  const offersCurrent = countWithin(offerDates, current);
  const offersPrevious = countWithin(offerDates, previous);

  return {
    applications: toMetric(applicationsCurrent, applicationsPrevious),
    interviews: toMetric(
      countWithin(interviewDates, current),
      countWithin(interviewDates, previous),
    ),
    offers: toMetric(offersCurrent, offersPrevious),
    acceptanceRate: toMetric(
      acceptanceRate(offersCurrent, applicationsCurrent),
      acceptanceRate(offersPrevious, applicationsPrevious),
    ),
  };
}

function buildTimeSeries(
  applicationDates: Date[],
  interviewDates: Date[],
  range: DateRange,
): TimeSeriesPoint[] {
  const points: TimeSeriesPoint[] = [];

  for (
    let start = range.start.getTime();
    start < range.end.getTime();
    start += ANALYTICS_BUCKET_DAYS * DAY_MS
  ) {
    const bucket: DateRange = {
      start: new Date(start),
      end: new Date(
        Math.min(start + ANALYTICS_BUCKET_DAYS * DAY_MS, range.end.getTime()),
      ),
    };

    points.push({
      label: formatBucketLabel(bucket.start),
      applications: countWithin(applicationDates, bucket),
      interviews: countWithin(interviewDates, bucket),
    });
  }

  return points;
}

function buildStatusDistribution(jobs: AnalyticsJob[]): StatusDistribution {
  const counts = new Map<JobStatus, number>();

  for (const job of jobs) {
    counts.set(job.status, (counts.get(job.status) ?? 0) + 1);
  }

  const total = jobs.length;
  const segments = orderedStatuses()
    .filter((status) => counts.has(status))
    .map((status) => {
      const count = counts.get(status) ?? 0;
      return { status, count, percentage: ratioToPercent(count, total) };
    });

  return { total, segments };
}

const SCREENED_STATUSES = new Set<JobStatus>([
  JobStatus.SCREENING,
  JobStatus.INTERVIEWING,
  JobStatus.OFFER,
  JobStatus.ACCEPTED,
]);
const INTERVIEWED_STATUSES = new Set<JobStatus>([
  JobStatus.INTERVIEWING,
  JobStatus.OFFER,
  JobStatus.ACCEPTED,
]);
const OFFERED_STATUSES = new Set<JobStatus>([
  JobStatus.OFFER,
  JobStatus.ACCEPTED,
]);

function buildConversionFunnel(
  jobs: AnalyticsJob[],
  activities: AnalyticsActivity[],
): FunnelStage[] {
  const appliedIds = new Set<string>();
  const screenedIds = new Set<string>();
  const interviewedIds = new Set<string>();
  const offeredIds = new Set<string>();

  for (const job of jobs) {
    if (job.status !== JobStatus.SAVED) {
      appliedIds.add(job.id);
    }
    if (SCREENED_STATUSES.has(job.status)) {
      screenedIds.add(job.id);
    }
    if (INTERVIEWED_STATUSES.has(job.status)) {
      interviewedIds.add(job.id);
    }
    if (OFFERED_STATUSES.has(job.status)) {
      offeredIds.add(job.id);
    }
  }

  for (const activity of activities) {
    if (activity.toStatus === JobStatus.SCREENING) {
      screenedIds.add(activity.jobId);
    }
    if (activity.toStatus === JobStatus.INTERVIEWING) {
      interviewedIds.add(activity.jobId);
    }
    if (
      activity.toStatus === JobStatus.OFFER ||
      activity.toStatus === JobStatus.ACCEPTED
    ) {
      offeredIds.add(activity.jobId);
    }
  }

  // Keep the funnel monotonic: reaching a later stage implies the earlier ones.
  addAll(interviewedIds, offeredIds);
  addAll(screenedIds, interviewedIds);
  addAll(appliedIds, screenedIds);

  const appliedCount = appliedIds.size;

  return [
    funnelStage(JobStatus.APPLIED, appliedCount, appliedCount),
    funnelStage(JobStatus.SCREENING, screenedIds.size, appliedCount),
    funnelStage(JobStatus.INTERVIEWING, interviewedIds.size, appliedCount),
    funnelStage(JobStatus.OFFER, offeredIds.size, appliedCount),
  ];
}

function addAll(target: Set<string>, source: Set<string>): void {
  for (const id of source) {
    target.add(id);
  }
}

function buildInsights(summary: AnalyticsSummary): AnalyticsInsight[] {
  const insights: AnalyticsInsight[] = [];

  if (summary.applications.value > 0) {
    const rate = ratioToPercent(
      summary.interviews.value,
      summary.applications.value,
    );
    insights.push(
      text(
        `Your interview rate is ${rate}% over the last ${ANALYTICS_WINDOW_DAYS} days.`,
      ),
    );
  }

  if (summary.applications.changePercent !== 0) {
    const direction =
      summary.applications.trendDirection === 'up' ? 'up' : 'down';
    insights.push(
      text(
        `Applications are ${direction} ${Math.abs(summary.applications.changePercent)}% vs the previous ${ANALYTICS_WINDOW_DAYS} days.`,
      ),
    );
  }

  if (summary.offers.value > 0 && summary.offers.changePercent > 0) {
    insights.push(
      text(`Offers are up ${summary.offers.changePercent}% this period.`),
    );
  }

  if (summary.acceptanceRate.value > 0) {
    insights.push(
      text(`Your acceptance rate is ${summary.acceptanceRate.value}%.`),
    );
  }

  return insights.map((insight, index) => ({
    ...insight,
    id: String(index + 1),
  }));
}

function collectApplicationDates(jobs: AnalyticsJob[]): Date[] {
  return jobs
    .filter((job) => job.status !== JobStatus.SAVED)
    .map((job) => job.appliedAt ?? job.createdAt);
}

function collectTransitionDates(
  activities: AnalyticsActivity[],
  target: JobStatus,
): Date[] {
  return activities
    .filter((activity) => activity.toStatus === target)
    .map((activity) => activity.createdAt);
}

function windowEndingAt(end: Date, days: number): DateRange {
  return { start: new Date(end.getTime() - days * DAY_MS), end };
}

function countWithin(dates: Date[], range: DateRange): number {
  const start = range.start.getTime();
  const end = range.end.getTime();

  return dates.reduce((count, date) => {
    const time = date.getTime();
    return time >= start && time < end ? count + 1 : count;
  }, 0);
}

function acceptanceRate(offers: number, applications: number): number {
  return applications === 0 ? 0 : round((offers / applications) * PERCENT);
}

function toMetric(current: number, previous: number): MetricSummary {
  const changePercent = changeBetween(current, previous);

  return {
    value: round(current),
    changePercent,
    trendDirection: changePercent >= 0 ? 'up' : 'down',
  };
}

function changeBetween(current: number, previous: number): number {
  if (previous === 0) {
    return current > 0 ? PERCENT : 0;
  }
  return round(((current - previous) / previous) * PERCENT);
}

function ratioToPercent(part: number, total: number): number {
  return total === 0 ? 0 : round((part / total) * PERCENT);
}

function funnelStage(
  stage: JobStatus,
  count: number,
  base: number,
): FunnelStage {
  return {
    stage,
    count,
    percentage: base === 0 ? 0 : ratioToPercent(count, base),
  };
}

function orderedStatuses(): JobStatus[] {
  return [
    JobStatus.SAVED,
    JobStatus.APPLIED,
    JobStatus.SCREENING,
    JobStatus.INTERVIEWING,
    JobStatus.OFFER,
    JobStatus.ACCEPTED,
    JobStatus.REJECTED,
    JobStatus.WITHDRAWN,
  ];
}

function formatBucketLabel(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function round(value: number): number {
  return Math.round(value * 10) / 10;
}

function text(value: string): AnalyticsInsight {
  return { id: '', text: value };
}
