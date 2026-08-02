import { InterviewType } from '../../../../generated/prisma/client';
import {
  formatLocalTime,
  getLocalDateKey,
} from '../../../common/utils/timezone.util';

export interface NotificationContent {
  title: string;
  message: string;
  actionUrl: string;
}

const jobDeepLink = (jobId: string): string => `/jobs/${jobId}`;
const CALENDAR_DEEP_LINK = '/calendar';

const INTERVIEW_TYPE_LABELS: Record<InterviewType, string> = {
  [InterviewType.PHONE_SCREEN]: 'phone screen',
  [InterviewType.TECHNICAL]: 'technical',
  [InterviewType.BEHAVIORAL]: 'behavioral',
  [InterviewType.SYSTEM_DESIGN]: 'system design',
  [InterviewType.ONSITE]: 'onsite',
  [InterviewType.HR]: 'HR',
  [InterviewType.FINAL]: 'final',
  [InterviewType.OTHER]: '',
};

function atCompany(companyName: string | null | undefined): string {
  return companyName ? ` at ${companyName}` : '';
}

function daysBetweenLocalDates(from: string, to: string): number {
  const parse = (key: string) => {
    const [year, month, day] = key.split('-').map(Number);
    return Date.UTC(year, month - 1, day);
  };
  return Math.round((parse(to) - parse(from)) / (24 * 60 * 60 * 1000));
}

/** Human phrase for a target date relative to now, in the user's timezone. */
function describeLocalDay(target: Date, now: Date, timeZone: string): string {
  const diff = daysBetweenLocalDates(
    getLocalDateKey(now, timeZone),
    getLocalDateKey(target, timeZone),
  );

  if (diff === 0) return 'today';
  if (diff === 1) return 'tomorrow';
  if (diff === -1) return 'yesterday';

  const formatted = new Intl.DateTimeFormat('en-US', {
    timeZone,
    month: 'short',
    day: 'numeric',
  }).format(target);

  return `on ${formatted}`;
}

export interface JobContentInput {
  id: string;
  title: string;
  companyName: string | null;
}

export interface InterviewContentInput {
  id: string;
  type: InterviewType;
  scheduledAt: Date;
  jobTitle: string;
  companyName: string | null;
}

export function buildNextActionUpcomingContent(
  job: JobContentInput,
  nextActionDate: Date,
  now: Date,
  timeZone: string,
): NotificationContent {
  const when = describeLocalDay(nextActionDate, now, timeZone);
  return {
    title: `Next action ${when}`,
    message: `Follow up on the ${job.title} application${atCompany(job.companyName)}.`,
    actionUrl: jobDeepLink(job.id),
  };
}

export function buildNextActionOverdueContent(
  job: JobContentInput,
): NotificationContent {
  return {
    title: 'Next action overdue',
    message: `Your next action for the ${job.title} application${atCompany(job.companyName)} is overdue.`,
    actionUrl: jobDeepLink(job.id),
  };
}

export function buildInterviewReminderContent(
  interview: InterviewContentInput,
  leadMinutes: number,
  now: Date,
  timeZone: string,
): NotificationContent {
  const typeLabel = INTERVIEW_TYPE_LABELS[interview.type];
  const typePrefix = typeLabel ? `${typeLabel} ` : '';

  if (leadMinutes >= 24 * 60) {
    const when = describeLocalDay(interview.scheduledAt, now, timeZone);
    const localTime = formatLocalTime(interview.scheduledAt, timeZone);
    return {
      title: `Interview ${when}`,
      message: `Your ${typePrefix}interview${atCompany(interview.companyName)} starts ${when} at ${localTime}.`,
      actionUrl: CALENDAR_DEEP_LINK,
    };
  }

  const hours = Math.round(leadMinutes / 60);
  const hoursLabel = hours === 1 ? '1 hour' : `${hours} hours`;
  return {
    title: `Interview in ${hoursLabel}`,
    message: `Your ${typePrefix}interview for ${interview.jobTitle} starts in ${hoursLabel}.`,
    actionUrl: CALENDAR_DEEP_LINK,
  };
}

export function buildInterviewFollowUpContent(
  interview: InterviewContentInput,
): NotificationContent {
  const target = interview.companyName ?? interview.jobTitle;
  return {
    title: 'Add interview notes',
    message: `Record your notes and feedback from the ${target} interview while the details are still fresh.`,
    actionUrl: CALENDAR_DEEP_LINK,
  };
}

export function buildStaleApplicationContent(
  job: JobContentInput,
  thresholdDays: number,
): NotificationContent {
  const target = job.companyName ?? job.title;
  return {
    title: 'Application may need follow-up',
    message: `There has been no activity on your ${target} application for ${thresholdDays} days.`,
    actionUrl: jobDeepLink(job.id),
  };
}
