import assert from "node:assert/strict";
import test, { afterEach, describe } from "node:test";

import {
  dateOnlyKeyToIso,
  formatDateOnly,
  formatDateOnlyShort,
  isDateOnlyKey,
  toDateOnlyKey,
  toLocalDateOnlyKey,
} from "./date-only.ts";

/** Fixed offsets on both sides of UTC, plus UTC itself. */
const TIMEZONES = [
  "Pacific/Kiritimati", // UTC+14, furthest east
  "Asia/Tokyo", // UTC+9
  "UTC",
  "America/New_York", // UTC-4/-5
  "Pacific/Midway", // UTC-11, furthest west
];

const originalTimezone = process.env.TZ;

afterEach(() => {
  process.env.TZ = originalTimezone;
});

function withTimezone(timeZone: string, run: () => void): void {
  process.env.TZ = timeZone;
  run();
}

describe("toDateOnlyKey", () => {
  test("returns the stored calendar date in every timezone", () => {
    for (const timeZone of TIMEZONES) {
      withTimezone(timeZone, () => {
        assert.equal(
          toDateOnlyKey("2026-08-05T00:00:00.000Z"),
          "2026-08-05",
          `shifted in ${timeZone}`,
        );
      });
    }
  });

  test("does not shift across month, year or leap-day boundaries", () => {
    const cases = [
      ["2026-01-01T00:00:00.000Z", "2026-01-01"],
      ["2026-12-31T00:00:00.000Z", "2026-12-31"],
      ["2024-02-29T00:00:00.000Z", "2024-02-29"],
      ["2026-03-01T00:00:00.000Z", "2026-03-01"],
    ] as const;

    for (const timeZone of TIMEZONES) {
      withTimezone(timeZone, () => {
        for (const [value, expected] of cases) {
          assert.equal(toDateOnlyKey(value), expected, `${value} in ${timeZone}`);
        }
      });
    }
  });

  test("accepts a plain YYYY-MM-DD value unchanged", () => {
    withTimezone("America/New_York", () => {
      assert.equal(toDateOnlyKey("2026-08-05"), "2026-08-05");
    });
  });

  test("returns null for missing and unparseable values", () => {
    assert.equal(toDateOnlyKey(null), null);
    assert.equal(toDateOnlyKey(undefined), null);
    assert.equal(toDateOnlyKey(""), null);
    assert.equal(toDateOnlyKey("not-a-date"), null);
  });
});

describe("toLocalDateOnlyKey", () => {
  test("uses the user's wall-clock day, not the UTC day", () => {
    // 23:30 on Aug 5 in New York is already Aug 6 in UTC.
    const instant = new Date("2026-08-06T03:30:00.000Z");

    withTimezone("America/New_York", () => {
      assert.equal(toLocalDateOnlyKey(instant), "2026-08-05");
    });

    withTimezone("Asia/Tokyo", () => {
      assert.equal(toLocalDateOnlyKey(instant), "2026-08-06");
    });
  });
});

describe("dateOnlyKeyToIso", () => {
  test("encodes UTC midnight regardless of the runtime timezone", () => {
    for (const timeZone of TIMEZONES) {
      withTimezone(timeZone, () => {
        assert.equal(
          dateOnlyKeyToIso("2026-08-05"),
          "2026-08-05T00:00:00.000Z",
          `differed in ${timeZone}`,
        );
      });
    }
  });

  test("round-trips with toDateOnlyKey", () => {
    for (const timeZone of TIMEZONES) {
      withTimezone(timeZone, () => {
        assert.equal(toDateOnlyKey(dateOnlyKeyToIso("2026-01-01")), "2026-01-01");
        assert.equal(toDateOnlyKey(dateOnlyKeyToIso("2026-12-31")), "2026-12-31");
      });
    }
  });
});

describe("formatDateOnly", () => {
  test("displays the stored date in every timezone", () => {
    for (const timeZone of TIMEZONES) {
      withTimezone(timeZone, () => {
        assert.equal(
          formatDateOnly("2026-08-05T00:00:00.000Z"),
          "August 5, 2026",
          `shifted in ${timeZone}`,
        );
        assert.equal(formatDateOnlyShort("2026-08-05T00:00:00.000Z"), "Aug 5");
      });
    }
  });

  test("falls back to a placeholder for empty values", () => {
    assert.equal(formatDateOnly(null), "—");
    assert.equal(formatDateOnlyShort(undefined), "—");
  });
});

describe("isDateOnlyKey", () => {
  test("accepts only YYYY-MM-DD", () => {
    assert.equal(isDateOnlyKey("2026-08-05"), true);
    assert.equal(isDateOnlyKey("2026-8-5"), false);
    assert.equal(isDateOnlyKey("2026-08-05T00:00:00.000Z"), false);
    assert.equal(isDateOnlyKey(""), false);
  });
});
