import assert from "node:assert/strict";
import test, { afterEach, describe } from "node:test";

import {
  dateTimeLocalKeyToIso,
  formatDateTime,
  isDateTimeLocalKey,
  localDayEndToIso,
  localDayStartToIso,
  toDateTimeLocalKey,
  toLocalDateKey,
} from "./date-time.ts";

const originalTimezone = process.env.TZ;

const TIMEZONES = ["Pacific/Kiritimati", "Europe/Kyiv", "UTC", "Pacific/Midway"];

afterEach(() => {
  process.env.TZ = originalTimezone;
});

describe("isDateTimeLocalKey", () => {
  test("accepts only YYYY-MM-DDTHH:mm", () => {
    assert.equal(isDateTimeLocalKey("2026-08-05T14:30"), true);
    assert.equal(isDateTimeLocalKey("2026-08-05T00:00"), true);

    assert.equal(isDateTimeLocalKey("2026-08-05"), false);
    assert.equal(isDateTimeLocalKey("2026-08-05T14:30:00"), false);
    assert.equal(isDateTimeLocalKey("2026-08-05 14:30"), false);
    assert.equal(isDateTimeLocalKey(""), false);
  });
});

describe("dateTimeLocalKeyToIso", () => {
  test("interprets the form value in the user's timezone", () => {
    process.env.TZ = "Europe/Kyiv"; // UTC+3 in August
    assert.equal(
      dateTimeLocalKeyToIso("2026-08-05T14:30"),
      "2026-08-05T11:30:00.000Z",
    );

    process.env.TZ = "UTC";
    assert.equal(
      dateTimeLocalKeyToIso("2026-08-05T14:30"),
      "2026-08-05T14:30:00.000Z",
    );
  });

  test("round-trips with toDateTimeLocalKey in every timezone", () => {
    for (const timeZone of TIMEZONES) {
      process.env.TZ = timeZone;
      const key = "2026-08-05T14:30";

      assert.equal(
        toDateTimeLocalKey(dateTimeLocalKeyToIso(key)),
        key,
        `round-trip failed in ${timeZone}`,
      );
    }
  });

  test("keeps a time near midnight on the day the user picked", () => {
    process.env.TZ = "Europe/Kyiv";
    // 01:00 local is the previous day in UTC, which must not leak into the form.
    const iso = dateTimeLocalKeyToIso("2026-08-05T01:00");

    assert.equal(iso, "2026-08-04T22:00:00.000Z");
    assert.equal(toDateTimeLocalKey(iso), "2026-08-05T01:00");
  });
});

describe("toDateTimeLocalKey", () => {
  test("returns null for missing and unparseable values", () => {
    assert.equal(toDateTimeLocalKey(null), null);
    assert.equal(toDateTimeLocalKey(undefined), null);
    assert.equal(toDateTimeLocalKey(""), null);
    assert.equal(toDateTimeLocalKey("not-a-date"), null);
  });
});

describe("toLocalDateKey", () => {
  test("reports the local day, which can differ from the UTC day", () => {
    const instant = "2026-08-05T22:00:00.000Z";

    process.env.TZ = "Pacific/Kiritimati"; // UTC+14
    assert.equal(toLocalDateKey(instant), "2026-08-06");

    process.env.TZ = "UTC";
    assert.equal(toLocalDateKey(instant), "2026-08-05");

    process.env.TZ = "Pacific/Midway"; // UTC-11
    assert.equal(toLocalDateKey(instant), "2026-08-05");
  });

  test("returns null for missing and unparseable values", () => {
    assert.equal(toLocalDateKey(null), null);
    assert.equal(toLocalDateKey("not-a-date"), null);
  });
});

describe("local day range bounds", () => {
  test("span the whole local day", () => {
    process.env.TZ = "Europe/Kyiv";

    assert.equal(localDayStartToIso("2026-08-05"), "2026-08-04T21:00:00.000Z");
    assert.equal(localDayEndToIso("2026-08-05"), "2026-08-05T20:59:59.999Z");
  });

  test("contain every instant of that local day in every timezone", () => {
    for (const timeZone of TIMEZONES) {
      process.env.TZ = timeZone;

      const start = new Date(localDayStartToIso("2026-08-05")).getTime();
      const end = new Date(localDayEndToIso("2026-08-05")).getTime();

      for (const time of ["00:00", "09:00", "23:59"]) {
        const instant = new Date(
          dateTimeLocalKeyToIso(`2026-08-05T${time}`),
        ).getTime();

        assert.ok(
          instant >= start && instant <= end,
          `${time} fell outside the range in ${timeZone}`,
        );
      }
    }
  });
});

describe("formatDateTime", () => {
  test("renders the date and time in the user's timezone", () => {
    process.env.TZ = "UTC";
    assert.equal(
      formatDateTime("2026-08-05T14:30:00.000Z"),
      "August 5, 2026 at 2:30 PM",
    );
  });

  test("falls back to a placeholder for empty and invalid values", () => {
    assert.equal(formatDateTime(null), "—");
    assert.equal(formatDateTime(undefined), "—");
    assert.equal(formatDateTime("not-a-date"), "—");
  });
});
