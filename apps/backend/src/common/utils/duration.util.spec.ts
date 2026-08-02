import { parseDurationToMs } from './duration.util';

describe('parseDurationToMs', () => {
  it.each([
    ['30s', 30_000],
    ['15m', 900_000],
    ['1h', 3_600_000],
    ['30d', 2_592_000_000],
  ])('parses %s', (value, expected) => {
    expect(parseDurationToMs(value)).toBe(expected);
  });

  it('reads a bare number as seconds, matching the JWT convention', () => {
    expect(parseDurationToMs('900')).toBe(900_000);
  });

  it('tolerates surrounding whitespace from environment files', () => {
    expect(parseDurationToMs(' 15m ')).toBe(900_000);
  });

  it.each(['', '15 minutes', '15x', 'm15', '-5m'])(
    'rejects the unsupported value %p',
    (value) => {
      expect(() => parseDurationToMs(value)).toThrow(/Unsupported duration/);
    },
  );
});
