import assert from "node:assert/strict";
import test, { afterEach, describe } from "node:test";

import { mapJobsToCalendarEvents } from "@/lib/calendar/map-calendar-events";
import { formatDateOnlyShort } from "@/lib/date/date-only";
import type { Job } from "@/types/jobs.types";

import { mapUpcomingInterviews } from "./map-dashboard.ts";

const originalTimezone = process.env.TZ;

afterEach(() => {
  process.env.TZ = originalTimezone;
});

function makeInterviewJob(id: string, nextActionDate: string | null): Job {
  return {
    id,
    title: "Senior Engineer",
    description: null,
    status: "INTERVIEWING",
    priority: "MEDIUM",
    source: null,
    location: null,
    remoteType: null,
    employmentType: null,
    salaryMin: null,
    salaryMax: null,
    salaryCurrency: null,
    appliedAt: null,
    nextActionDate,
    url: null,
    company: { id: "c1", name: "Acme", website: null },
    createdAt: "2026-07-01T10:00:00.000Z",
    updatedAt: "2026-07-01T10:00:00.000Z",
  };
}

describe("mapUpcomingInterviews", () => {
  test("keeps an action whose time has passed for the rest of the user's day", () => {
    // The action is at 09:00 Tokyo on Aug 5; "now" is 21:00 Tokyo the same day.
    // Comparing instants would drop it, comparing local days keeps it listed.
    process.env.TZ = "Asia/Tokyo";
    const job = makeInterviewJob("a", "2026-08-05T00:00:00.000Z");
    const now = new Date("2026-08-05T12:00:00.000Z");

    const result = mapUpcomingInterviews([job], now, 5);

    assert.equal(result.length, 1);
    assert.equal(result[0].date, "Aug 5");
  });

  test("excludes actions before today", () => {
    process.env.TZ = "UTC";
    const jobs = [
      makeInterviewJob("past", "2026-08-04T12:00:00.000Z"),
      makeInterviewJob("today", "2026-08-05T12:00:00.000Z"),
      makeInterviewJob("future", "2026-08-06T12:00:00.000Z"),
    ];

    const result = mapUpcomingInterviews(
      jobs,
      new Date("2026-08-05T09:00:00.000Z"),
      5,
    );

    assert.deepEqual(
      result.map((item) => item.id),
      ["today", "future"],
    );
  });

  test("sorts by date and respects the limit", () => {
    process.env.TZ = "UTC";
    const jobs = [
      makeInterviewJob("c", "2026-08-20T12:00:00.000Z"),
      makeInterviewJob("a", "2026-08-06T12:00:00.000Z"),
      makeInterviewJob("b", "2026-08-10T12:00:00.000Z"),
    ];

    const result = mapUpcomingInterviews(
      jobs,
      new Date("2026-08-05T09:00:00.000Z"),
      2,
    );

    assert.deepEqual(
      result.map((item) => item.id),
      ["a", "b"],
    );
  });

  test("ignores jobs that are not interviewing or have no date", () => {
    process.env.TZ = "UTC";
    const applied = {
      ...makeInterviewJob("applied", "2026-08-06T12:00:00.000Z"),
      status: "APPLIED" as const,
    };
    const undated = makeInterviewJob("undated", null);

    const result = mapUpcomingInterviews(
      [applied, undated],
      new Date("2026-08-05T09:00:00.000Z"),
      5,
    );

    assert.deepEqual(result, []);
  });

  test("shows the same date as the calendar in every timezone", () => {
    const job = makeInterviewJob("a", "2026-08-05T12:00:00.000Z");
    const now = new Date("2026-08-01T09:00:00.000Z");

    // 12:00 UTC is already Aug 6 in UTC+14, and still Aug 5 in UTC-11.
    const expectedByTimezone = {
      "Pacific/Kiritimati": "2026-08-06",
      UTC: "2026-08-05",
      "Pacific/Midway": "2026-08-05",
    };

    for (const [timeZone, expected] of Object.entries(expectedByTimezone)) {
      process.env.TZ = timeZone;

      const [widgetItem] = mapUpcomingInterviews([job], now, 5);
      const [calendarEvent] = mapJobsToCalendarEvents([job]);

      assert.equal(calendarEvent.dateKey, expected, `calendar in ${timeZone}`);
      assert.equal(
        widgetItem.date,
        formatDateOnlyShort(calendarEvent.dateKey),
        `widget disagreed with the calendar in ${timeZone}`,
      );
    }
  });
});
