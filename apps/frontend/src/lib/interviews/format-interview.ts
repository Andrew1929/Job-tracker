/**
 * Display-only formatting for interview values.
 *
 * `scheduledAt` and `completedAt` are stored instants (like a job's
 * `nextActionDate`), not calendar dates, so they are read through local
 * components — see the note at the top of `@/lib/date/date-time`. Nothing here
 * talks to the API or derives business state; these helpers only turn a stored
 * value into the string the UI prints.
 */

import { EMPTY_DATE_PLACEHOLDER } from "@/lib/date/date-only";

const DEFAULT_LOCALE = "en-US";

const MINUTES_PER_HOUR = 60;

function parseInstant(value: string | Date | null | undefined): Date | null {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Compact calendar date for dense rows, e.g. "Sep 25, 2026". */
export function formatInterviewDate(
  value: string | Date | null | undefined,
  locale = DEFAULT_LOCALE,
): string {
  const date = parseInstant(value);
  if (!date) {
    return EMPTY_DATE_PLACEHOLDER;
  }

  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

/** Time of day for the second line of a schedule cell, e.g. "2:00 PM". */
export function formatInterviewTime(
  value: string | Date | null | undefined,
  locale = DEFAULT_LOCALE,
): string {
  const date = parseInstant(value);
  if (!date) {
    return EMPTY_DATE_PLACEHOLDER;
  }

  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

/** Single-line schedule label for the drawer header, e.g. "Sep 25, 2026 · 2:00 PM". */
export function formatInterviewSchedule(
  value: string | Date | null | undefined,
  locale = DEFAULT_LOCALE,
): string {
  const date = parseInstant(value);
  if (!date) {
    return EMPTY_DATE_PLACEHOLDER;
  }

  return `${formatInterviewDate(date, locale)} · ${formatInterviewTime(date, locale)}`;
}

/** Minutes as "45 min", "1 h" or "1 h 30 min". */
export function formatInterviewDuration(minutes: number | null): string {
  if (minutes === null || !Number.isFinite(minutes) || minutes <= 0) {
    return EMPTY_DATE_PLACEHOLDER;
  }

  const hours = Math.floor(minutes / MINUTES_PER_HOUR);
  const remainder = minutes % MINUTES_PER_HOUR;

  if (hours === 0) {
    return `${remainder} min`;
  }

  return remainder === 0 ? `${hours} h` : `${hours} h ${remainder} min`;
}

/** Interviewer names as one readable line. */
export function formatInterviewers(interviewers: string[]): string {
  const names = interviewers.map((name) => name.trim()).filter(Boolean);
  return names.length > 0 ? names.join(", ") : EMPTY_DATE_PLACEHOLDER;
}

/** A 1–5 score as "4 / 5". */
export function formatInterviewScore(value: number | null, max = 5): string {
  return value === null ? EMPTY_DATE_PLACEHOLDER : `${value} / ${max}`;
}
