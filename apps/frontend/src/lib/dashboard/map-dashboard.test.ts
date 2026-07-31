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
  test("keeps an action scheduled for today late in the user's day", () => {
    const job = makeInterviewJob("a", "2026-08-05T00:00:00.000Z");
    // 21:00 local on Aug 5 in Tokyo is already Aug 5 12:00 UTC, well past the
    // stored UTC-midnight instant.
    process.env.TZ = "Asia/Tokyo";
    const now = new Date("2026-08-05T12:00:00.000Z");

    const result = mapUpcomingInterviews([job], now, 5);

    assert.equal(result.length, 1);
    assert.equal(result[0].date, "Aug 5");
  });

  test("excludes actions before today", () => {
    process.env.TZ = "UTC";
    const jobs = [
      makeInterviewJob("past", "2026-08-04T00:00:00.000Z"),
      makeInterviewJob("today", "2026-08-05T00:00:00.000Z"),
      makeInterviewJob("future", "2026-08-06T00:00:00.000Z"),
    ];

    const result = mapUpcomingInterviews(jobs, new Date("2026-08-05T09:00:00.000Z"), 5);

    assert.deepEqual(
      result.map((item) => item.id),
      ["today", "future"],
    );
  });

  test("sorts by date and respects the limit", () => {
    process.env.TZ = "UTC";
    const jobs = [
      makeInterviewJob("c", "2026-08-20T00:00:00.000Z"),
      makeInterviewJob("a", "2026-08-06T00:00:00.000Z"),
      makeInterviewJob("b", "2026-08-10T00:00:00.000Z"),
    ];

    const result = mapUpcomingInterviews(jobs, new Date("2026-08-05T09:00:00.000Z"), 2);

    assert.deepEqual(
      result.map((item) => item.id),
      ["a", "b"],
    );
  });

  test("ignores jobs that are not interviewing or have no date", () => {
    process.env.TZ = "UTC";
    const applied = { ...makeInterviewJob("applied", "2026-08-06T00:00:00.000Z"), status: "APPLIED" as const };
    const undated = makeInterviewJob("undated", null);

    const result = mapUpcomingInterviews(
      [applied, undated],
      new Date("2026-08-05T09:00:00.000Z"),
      5,
    );

    assert.deepEqual(result, []);
  });

  test("shows the same date as the calendar in every timezone", () => {
    const job = makeInterviewJob("a", "2026-08-05T00:00:00.000Z");
    const now = new Date("2026-08-01T09:00:00.000Z");

    for (const timeZone of ["Pacific/Kiritimati", "UTC", "Pacific/Midway"]) {
      process.env.TZ = timeZone;

      const [widgetItem] = mapUpcomingInterviews([job], now, 5);
      const [calendarEvent] = mapJobsToCalendarEvents([job]);

      assert.equal(calendarEvent.dateKey, "2026-08-05", `calendar in ${timeZone}`);
      assert.equal(
        widgetItem.date,
        formatDateOnlyShort(calendarEvent.dateKey),
        `widget disagreed with the calendar in ${timeZone}`,
      );
    }
  });
});
