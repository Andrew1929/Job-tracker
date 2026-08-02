/**
 * Date-only job fields (`appliedAt`) are calendar dates, not instants. The job
 * form submits a `YYYY-MM-DD` value which is persisted as UTC midnight, so
 * reading those values through local-time accessors shifts them to the previous
 * day for every user behind UTC. Every consumer of a date-only field must go
 * through these helpers instead of `new Date(value).getDate()`.
 *
 * `nextActionDate` is NOT one of these: it is a scheduled instant that drives a
 * reminder, and belongs to `@/lib/date/date-time`. Genuine timestamps such as
 * `createdAt` keep using `@/lib/format/date`.
 */

const DATE_ONLY_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const EMPTY_DATE_PLACEHOLDER = "—";

export function isDateOnlyKey(value: string): boolean {
  return DATE_ONLY_KEY_PATTERN.test(value);
}

function parseDateOnly(value: string | Date): Date | null {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Extracts the `YYYY-MM-DD` calendar date a stored value represents, using UTC
 * components so the result is identical in every user timezone.
 */
export function toDateOnlyKey(
  value: string | Date | null | undefined,
): string | null {
  if (!value) {
    return null;
  }

  const date = parseDateOnly(value);
  if (!date) {
    return null;
  }

  const year = String(date.getUTCFullYear()).padStart(4, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * The calendar date an instant falls on for the user, from local components.
 * Use this for "now"-style values; use `toDateOnlyKey` for stored date-only
 * fields, which are anchored to UTC midnight rather than to a moment in time.
 */
export function toLocalDateOnlyKey(date: Date): string {
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function todayDateOnlyKey(): string {
  return toLocalDateOnlyKey(new Date());
}

/**
 * Converts a `YYYY-MM-DD` form value into the UTC-midnight instant the API
 * stores. Centralised so the write path never depends on the runtime timezone.
 */
export function dateOnlyKeyToIso(key: string): string {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toISOString();
}

/**
 * Formats a stored date-only value for display. Rendering in UTC keeps the
 * displayed day equal to the day the user picked.
 */
export function formatDateOnly(
  value: string | Date | null | undefined,
  locale = "en-US",
): string {
  const key = toDateOnlyKey(value);
  if (!key) {
    return EMPTY_DATE_PLACEHOLDER;
  }

  return new Intl.DateTimeFormat(locale, {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(key));
}

/**
 * Compact variant used in dense lists, e.g. "Aug 5".
 */
export function formatDateOnlyShort(
  value: string | Date | null | undefined,
  locale = "en-US",
): string {
  const key = toDateOnlyKey(value);
  if (!key) {
    return EMPTY_DATE_PLACEHOLDER;
  }

  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(key));
}
