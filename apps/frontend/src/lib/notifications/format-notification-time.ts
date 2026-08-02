/**
 * Formats a notification timestamp for display. Uses the browser locale and
 * timezone; the backend stores UTC and clients render locally.
 */
export function formatNotificationTime(
  value: string | Date,
  locale = "en-US",
): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}
