const EMPTY_PLACEHOLDER = "—";

function formatAmount(value: number, locale = "en-US"): string {
  return new Intl.NumberFormat(locale).format(value);
}

/**
 * Formats an optional salary range. Handles the cases where only one bound is
 * known and appends the currency code when available.
 */
export function formatSalaryRange(
  min: number | null,
  max: number | null,
  currency: string | null,
  locale = "en-US",
): string {
  if (min == null && max == null) {
    return EMPTY_PLACEHOLDER;
  }

  const suffix = currency ? ` ${currency}` : "";

  if (min != null && max != null) {
    return `${formatAmount(min, locale)} – ${formatAmount(max, locale)}${suffix}`;
  }

  const amount = (min ?? max) as number;
  const prefix = min != null ? "From " : "Up to ";

  return `${prefix}${formatAmount(amount, locale)}${suffix}`;
}
