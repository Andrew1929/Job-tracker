import {
  formatLocalTime,
  getLocalDateKey,
  getLocalHour,
  isValidTimeZone,
  resolveTimeZone,
} from './timezone.util';

describe('timezone.util', () => {
  it('accepts valid IANA zones and rejects invalid ones', () => {
    expect(isValidTimeZone('Europe/Warsaw')).toBe(true);
    expect(isValidTimeZone('UTC')).toBe(true);
    expect(isValidTimeZone('Not/AZone')).toBe(false);
    expect(isValidTimeZone('')).toBe(false);
  });

  it('falls back to UTC for invalid or missing zones', () => {
    expect(resolveTimeZone(undefined)).toBe('UTC');
    expect(resolveTimeZone('Not/AZone')).toBe('UTC');
    expect(resolveTimeZone('America/New_York')).toBe('America/New_York');
  });

  it('reports the local wall-clock hour for a zone', () => {
    const instant = new Date('2026-08-10T00:30:00.000Z');
    expect(getLocalHour(instant, 'UTC')).toBe(0);
    // Etc/GMT-5 is UTC+5, so 00:30 UTC is 05:30 local.
    expect(getLocalHour(instant, 'Etc/GMT-5')).toBe(5);
  });

  it('produces a stable local date key', () => {
    const instant = new Date('2026-08-10T23:30:00.000Z');
    expect(getLocalDateKey(instant, 'UTC')).toBe('2026-08-10');
    // UTC+5 pushes the same instant into the next local day.
    expect(getLocalDateKey(instant, 'Etc/GMT-5')).toBe('2026-08-11');
  });

  it('formats the local time as HH:mm', () => {
    const instant = new Date('2026-08-10T12:00:00.000Z');
    expect(formatLocalTime(instant, 'UTC')).toBe('12:00');
    expect(formatLocalTime(instant, 'Etc/GMT-2')).toBe('14:00');
  });
});
