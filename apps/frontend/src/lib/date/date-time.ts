/**
 * `nextActionDate` is a scheduled instant, not a calendar date: the backend
 * schedules a BullMQ reminder relative to it, so the time of day is meaningful.
 * It is entered with `<input type="datetime-local">`, stored as UTC, and read
 * back through the user's local timezone.
 *
 * This is deliberately the opposite of `@/lib/date/date-only`, which anchors
 * genuine calendar dates such as `appliedAt` to UTC midnight. Reading an instant
 * through the date-only helpers would report the UTC day and shift the value to
 * a neighbouring day for anyone whose local day differs from UTC.
 */

import { toLocalDateOnlyKey } from "@/lib/date/date-only";

const DATE_TIME_LOCAL_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

export const EMPTY_DATE_TIME_PLACEHOLDER = "—";

function parseInstant(value: string | Date | null | undefined): Date | null {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Matches the `YYYY-MM-DDTHH:mm` value `<input type="datetime-local">` submits. */
export function isDateTimeLocalKey(value: string): boolean {
  return DATE_TIME_LOCAL_KEY_PATTERN.test(value);
}

/**
 * Renders a stored instant as the local `YYYY-MM-DDTHH:mm` the datetime input
 * expects, so editing a job shows the time the user originally picked.
 */
export function toDateTimeLocalKey(
  value: string | Date | null | undefined,
): string | null {
  const date = parseInstant(value);
  if (!date) {
    return null;
  }

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${toLocalDateOnlyKey(date)}T${hours}:${minutes}`;
}

/**
 * Converts a `YYYY-MM-DDTHH:mm` form value into the UTC instant the API stores.
 * The parts are fed to the `Date` constructor individually because parsing the
 * string directly is only reliably local-time in newer engines.
 */
export function dateTimeLocalKeyToIso(key: string): string {
  const [datePart, timePart] = key.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes] = timePart.split(":").map(Number);

  return new Date(year, month - 1, day, hours, minutes).toISOString();
}

/**
 * The `YYYY-MM-DD` local day an instant falls on. Calendar grids and dashboard
 * lists are built from local wall-clock days, so grouping must use local
 * components rather than the UTC ones `toDateOnlyKey` reports.
 */
export function toLocalDateKey(
  value: string | Date | null | undefined,
): string | null {
  const date = parseInstant(value);
  return date ? toLocalDateOnlyKey(date) : null;
}

/** First instant of a local day, as the inclusive lower bound of an API range. */
export function localDayStartToIso(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0).toISOString();
}

/**
 * Last instant of a local day, as the inclusive upper bound of an API range.
 * Without this a job scheduled during the final day of a range would fall
 * outside a bound anchored to the start of that day.
 */
export function localDayEndToIso(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day, 23, 59, 59, 999).toISOString();
}

/** Formats a stored instant as a local date and time, e.g. "August 5, 2026 at 2:30 PM". */
export function formatDateTime(
  value: string | Date | null | undefined,
  locale = "en-US",
): string {
  const date = parseInstant(value);
  if (!date) {
    return EMPTY_DATE_TIME_PLACEHOLDER;
  }

  return new Intl.DateTimeFormat(locale, {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}
