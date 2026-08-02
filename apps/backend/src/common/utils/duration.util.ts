/**
 * Parses the duration strings the JWT configuration already accepts, so the
 * token lifetime and anything derived from it (cookie max-age, Redis TTL) read
 * the same environment value instead of repeating a hardcoded number.
 *
 * A bare number means seconds, matching how `jsonwebtoken` reads `expiresIn`.
 */

const DURATION_PATTERN = /^(\d+)(s|m|h|d)?$/;

const UNIT_TO_MS = {
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
} as const;

export function parseDurationToMs(value: string): number {
  const match = DURATION_PATTERN.exec(value.trim());

  if (!match) {
    throw new Error(
      `Unsupported duration "${value}". Use seconds or a value such as 30s, 15m, 1h or 30d.`,
    );
  }

  const [, amount, unit] = match;
  return (
    Number(amount) *
    (unit ? UNIT_TO_MS[unit as keyof typeof UNIT_TO_MS] : UNIT_TO_MS.s)
  );
}
