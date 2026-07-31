import assert from "node:assert/strict";
import test, { describe } from "node:test";

import { parseDateKey } from "./calendar-dates.ts";
import { formatCalendarRangeTitle } from "./format-calendar.ts";

function titleFor(dateKey: string, view: "month" | "week" | "day"): string {
  return formatCalendarRangeTitle(parseDateKey(dateKey), view);
}

describe("formatCalendarRangeTitle", () => {
  test("month view shows the month and year", () => {
    assert.equal(titleFor("2026-07-31", "month"), "July 2026");
  });

  test("day view shows the complete date", () => {
    assert.equal(titleFor("2026-07-31", "day"), "Friday, July 31, 2026");
  });

  test("week view repeats the month only when the week crosses one", () => {
    assert.equal(titleFor("2026-07-08", "week"), "July 6 – 12, 2026");
    assert.equal(titleFor("2026-07-31", "week"), "July 27 – August 2, 2026");
  });

  test("week view shows both years when the week crosses a year boundary", () => {
    assert.equal(
      titleFor("2026-12-31", "week"),
      "December 28, 2026 – January 3, 2027",
    );
  });

  test("titles are stable for any day within the same week", () => {
    const expected = titleFor("2026-07-27", "week");

    for (const day of ["28", "29", "30", "31"]) {
      assert.equal(titleFor(`2026-07-${day}`, "week"), expected);
    }
    assert.equal(titleFor("2026-08-02", "week"), expected);
  });
});
