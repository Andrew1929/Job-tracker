/**
 * Reads the same duration format the backend accepts for token lifetimes, so a
 * value such as `30m` means the same thing on both sides of the stack.
 * A bare number is read as seconds.
 */

const DURATION_PATTERN = /^(\d+)(s|m|h|d)?$/;

const UNIT_TO_MS = {
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
} as const;

export function parseDurationToMs(
  value: string | undefined,
  fallbackMs: number,
): number {
  const match = value ? DURATION_PATTERN.exec(value.trim()) : null;

  if (!match) {
    return fallbackMs;
  }

  const [, amount, unit] = match;
  const unitMs = unit
    ? UNIT_TO_MS[unit as keyof typeof UNIT_TO_MS]
    : UNIT_TO_MS.s;

  return Number(amount) * unitMs;
}
