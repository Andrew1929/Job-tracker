export function formatFullDate(date: Date, locale = "en-US"): string {
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

const EMPTY_DATE_PLACEHOLDER = "—";

export function formatDateValue(
  value: string | Date | null | undefined,
  locale = "en-US",
): string {
  if (!value) {
    return EMPTY_DATE_PLACEHOLDER;
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return EMPTY_DATE_PLACEHOLDER;
  }

  return formatFullDate(date, locale);
}
