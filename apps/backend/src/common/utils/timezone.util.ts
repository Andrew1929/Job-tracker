/**
 * Timezone helpers built on the platform `Intl` APIs so no additional date
 * dependency is introduced. All persistence and queue scheduling use UTC; these
 * helpers exist purely to render and reason about a user's local wall-clock time
 * for display strings and local-time delivery windows.
 */

const UTC_TIME_ZONE = 'UTC';

export function isValidTimeZone(timeZone: string): boolean {
  if (!timeZone) {
    return false;
  }

  try {
    new Intl.DateTimeFormat('en-US', { timeZone });
    return true;
  } catch {
    return false;
  }
}

export function resolveTimeZone(timeZone: string | null | undefined): string {
  return timeZone && isValidTimeZone(timeZone) ? timeZone : UTC_TIME_ZONE;
}

interface ZonedParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

function getZonedParts(date: Date, timeZone: string): ZonedParts {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  const parts = formatter.formatToParts(date);
  const lookup = (type: Intl.DateTimeFormatPartTypes): number =>
    Number(parts.find((part) => part.type === type)?.value ?? '0');

  return {
    year: lookup('year'),
    month: lookup('month'),
    day: lookup('day'),
    // `hour: '2-digit'` with hour12:false can yield '24' at midnight; normalize.
    hour: lookup('hour') % 24,
    minute: lookup('minute'),
  };
}

/** Local hour (0-23) for the instant in the given timezone. */
export function getLocalHour(date: Date, timeZone: string): number {
  return getZonedParts(date, resolveTimeZone(timeZone)).hour;
}

/** Stable `YYYY-MM-DD` key for the instant in the given timezone. */
export function getLocalDateKey(date: Date, timeZone: string): string {
  const { year, month, day } = getZonedParts(date, resolveTimeZone(timeZone));
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${year}-${pad(month)}-${pad(day)}`;
}

/** `HH:mm` wall-clock time for the instant in the given timezone. */
export function formatLocalTime(date: Date, timeZone: string): string {
  const { hour, minute } = getZonedParts(date, resolveTimeZone(timeZone));
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${pad(hour)}:${pad(minute)}`;
}
