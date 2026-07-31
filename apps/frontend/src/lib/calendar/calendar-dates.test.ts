import assert from "node:assert/strict";
import test, { describe } from "node:test";

import {
  addMonths,
  buildMonthDays,
  buildWeekDays,
  getVisibleRange,
  parseDateKey,
  shiftDate,
  startOfWeek,
} from "./calendar-dates.ts";

const NO_TODAY = "";

function localDate(key: string): Date {
  return parseDateKey(key);
}

function keysOf(days: { dateKey: string }[]): string[] {
  return days.map((day) => day.dateKey);
}

describe("buildMonthDays", () => {
  test("starts on Monday and covers the whole month", () => {
    // August 2026 starts on a Saturday.
    const days = buildMonthDays(localDate("2026-08-15"), NO_TODAY);

    assert.equal(days[0].dateKey, "2026-07-27");
    assert.equal(days.at(-1)?.dateKey, "2026-09-06");
    assert.ok(days.some((day) => day.dateKey === "2026-08-01"));
    assert.ok(days.some((day) => day.dateKey === "2026-08-31"));
  });

  test("always renders whole weeks", () => {
    for (let month = 0; month < 12; month += 1) {
      const days = buildMonthDays(new Date(2026, month, 1), NO_TODAY);
      assert.equal(days.length % 7, 0, `month ${month} is not whole weeks`);
    }
  });

  test("uses four rows for a February that starts on a Monday", () => {
    // February 2027 has 28 days and starts on a Monday.
    const days = buildMonthDays(localDate("2027-02-10"), NO_TODAY);

    assert.equal(days.length, 28);
    assert.ok(days.every((day) => day.isCurrentMonth));
  });

  test("uses six rows when a 31-day month starts on a Sunday", () => {
    // August 2027 starts on a Sunday, so it needs six rows.
    const days = buildMonthDays(localDate("2027-08-10"), NO_TODAY);

    assert.equal(days.length, 42);
  });

  test("includes February 29 in a leap year and skips it otherwise", () => {
    const leap = keysOf(buildMonthDays(localDate("2024-02-10"), NO_TODAY));
    const nonLeap = keysOf(buildMonthDays(localDate("2026-02-10"), NO_TODAY));

    assert.ok(leap.includes("2024-02-29"));
    assert.ok(!nonLeap.includes("2026-02-29"));
  });

  test("produces unique keys, including leading and trailing days", () => {
    // December 2026 has leading November days and trailing January days that
    // repeat the same day-of-month numbers as the current month.
    const days = buildMonthDays(localDate("2026-12-15"), NO_TODAY);
    const keys = keysOf(days);

    assert.equal(new Set(keys).size, keys.length);

    const dayNumbers = days.map((day) => day.dayNumber);
    assert.ok(
      new Set(dayNumbers).size < dayNumbers.length,
      "expected repeated day numbers, which is why keys must be full dates",
    );
  });

  test("marks only the matching day as today", () => {
    const days = buildMonthDays(localDate("2026-08-15"), "2026-08-15");
    const todays = days.filter((day) => day.isToday);

    assert.equal(todays.length, 1);
    assert.equal(todays[0].dateKey, "2026-08-15");
  });
});

describe("buildWeekDays", () => {
  test("returns seven consecutive days starting on Monday", () => {
    const days = buildWeekDays(localDate("2026-07-31"), NO_TODAY);

    assert.deepEqual(keysOf(days), [
      "2026-07-27",
      "2026-07-28",
      "2026-07-29",
      "2026-07-30",
      "2026-07-31",
      "2026-08-01",
      "2026-08-02",
    ]);
  });

  test("spans a year boundary", () => {
    const days = buildWeekDays(localDate("2026-12-31"), NO_TODAY);

    assert.equal(days[0].dateKey, "2026-12-28");
    assert.equal(days.at(-1)?.dateKey, "2027-01-03");
  });

  test("treats Sunday as the last day of the week", () => {
    assert.equal(
      startOfWeek(localDate("2026-08-02")).getDate(),
      27,
      "Sunday should belong to the preceding Monday's week",
    );
  });
});

describe("getVisibleRange", () => {
  test("covers exactly the rendered month grid", () => {
    const range = getVisibleRange(localDate("2026-08-15"), "month");
    const days = buildMonthDays(localDate("2026-08-15"), NO_TODAY);

    assert.equal(range.startKey, days[0].dateKey);
    assert.equal(range.endKey, days.at(-1)?.dateKey);
  });

  test("covers exactly the rendered week", () => {
    const range = getVisibleRange(localDate("2026-07-31"), "week");

    assert.equal(range.startKey, "2026-07-27");
    assert.equal(range.endKey, "2026-08-02");
  });

  test("covers a single day", () => {
    const range = getVisibleRange(localDate("2026-07-31"), "day");

    assert.equal(range.startKey, "2026-07-31");
    assert.equal(range.endKey, "2026-07-31");
  });
});

describe("shiftDate", () => {
  test("moves whole months and clamps overflowing day numbers", () => {
    assert.equal(
      shiftDate(localDate("2026-01-31"), "month", 1).getMonth(),
      1,
      "January 31 + 1 month should land in February, not March",
    );
    assert.equal(shiftDate(localDate("2026-01-31"), "month", 1).getDate(), 28);
  });

  test("crosses year boundaries in month view", () => {
    const back = shiftDate(localDate("2026-01-15"), "month", -1);
    const forward = shiftDate(localDate("2026-12-15"), "month", 1);

    assert.equal(back.getFullYear(), 2025);
    assert.equal(back.getMonth(), 11);
    assert.equal(forward.getFullYear(), 2027);
    assert.equal(forward.getMonth(), 0);
  });

  test("moves seven days in week view", () => {
    const next = shiftDate(localDate("2026-07-31"), "week", 1);
    const previous = shiftDate(localDate("2026-07-31"), "week", -1);

    assert.equal(next.getDate(), 7);
    assert.equal(next.getMonth(), 7);
    assert.equal(previous.getDate(), 24);
  });

  test("moves one day in day view, across month and year boundaries", () => {
    const backOverMonth = shiftDate(localDate("2026-08-01"), "day", -1);
    const forwardOverYear = shiftDate(localDate("2026-12-31"), "day", 1);

    assert.equal(backOverMonth.getMonth(), 6);
    assert.equal(backOverMonth.getDate(), 31);
    assert.equal(forwardOverYear.getFullYear(), 2027);
    assert.equal(forwardOverYear.getDate(), 1);
  });

  test("handles a leap day", () => {
    assert.equal(shiftDate(localDate("2024-02-28"), "day", 1).getDate(), 29);
    assert.equal(shiftDate(localDate("2026-02-28"), "day", 1).getMonth(), 2);
  });
});

describe("addMonths", () => {
  test("keeps the day number when the target month is long enough", () => {
    const result = addMonths(localDate("2026-03-15"), 2);

    assert.equal(result.getMonth(), 4);
    assert.equal(result.getDate(), 15);
  });
});
