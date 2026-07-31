import assert from "node:assert/strict";
import test, { afterEach, describe } from "node:test";

import type { Job } from "@/types/jobs.types";

import {
  groupEventsByDateKey,
  mapJobsToCalendarEvents,
} from "./map-calendar-events.ts";

const originalTimezone = process.env.TZ;

afterEach(() => {
  process.env.TZ = originalTimezone;
});

function makeJob(overrides: Partial<Job> & Pick<Job, "id">): Job {
  return {
    title: "Senior Engineer",
    description: null,
    status: "APPLIED",
    priority: "MEDIUM",
    source: null,
    location: null,
    remoteType: null,
    employmentType: null,
    salaryMin: null,
    salaryMax: null,
    salaryCurrency: null,
    appliedAt: null,
    nextActionDate: null,
    url: null,
    company: null,
    createdAt: "2026-07-01T10:00:00.000Z",
    updatedAt: "2026-07-01T10:00:00.000Z",
    ...overrides,
  };
}

describe("mapJobsToCalendarEvents", () => {
  test("returns nothing for an empty list", () => {
    assert.deepEqual(mapJobsToCalendarEvents([]), []);
  });

  test("maps a job with a scheduled action", () => {
    const events = mapJobsToCalendarEvents([
      makeJob({
        id: "job-1",
        title: "Platform Engineer",
        status: "INTERVIEWING",
        nextActionDate: "2026-08-05T00:00:00.000Z",
        company: { id: "c1", name: "Acme", website: null },
      }),
    ]);

    assert.equal(events.length, 1);
    assert.deepEqual(events[0], {
      id: "job-1",
      jobId: "job-1",
      title: "Platform Engineer",
      companyName: "Acme",
      status: "INTERVIEWING",
      dateKey: "2026-08-05",
    });
  });

  test("keeps jobs of every status, not just interviews", () => {
    const events = mapJobsToCalendarEvents([
      makeJob({ id: "a", status: "SAVED", nextActionDate: "2026-08-05T00:00:00.000Z" }),
      makeJob({ id: "b", status: "OFFER", nextActionDate: "2026-08-05T00:00:00.000Z" }),
    ]);

    assert.deepEqual(
      events.map((event) => event.status),
      ["SAVED", "OFFER"],
    );
  });

  test("drops jobs without a usable date instead of guessing one", () => {
    const events = mapJobsToCalendarEvents([
      makeJob({ id: "a", nextActionDate: null }),
      makeJob({ id: "b", nextActionDate: "" }),
      makeJob({ id: "c", nextActionDate: "not-a-date" }),
    ]);

    assert.deepEqual(events, []);
  });

  test("falls back to a null company name", () => {
    const [event] = mapJobsToCalendarEvents([
      makeJob({ id: "a", company: null, nextActionDate: "2026-08-05T00:00:00.000Z" }),
    ]);

    assert.equal(event.companyName, null);
  });

  test("sorts events returned out of chronological order", () => {
    const events = mapJobsToCalendarEvents([
      makeJob({ id: "c", nextActionDate: "2026-08-20T00:00:00.000Z" }),
      makeJob({ id: "a", nextActionDate: "2026-08-01T00:00:00.000Z" }),
      makeJob({ id: "b", nextActionDate: "2026-08-10T00:00:00.000Z" }),
    ]);

    assert.deepEqual(
      events.map((event) => event.dateKey),
      ["2026-08-01", "2026-08-10", "2026-08-20"],
    );
  });

  test("orders same-day events deterministically by title then id", () => {
    const jobs = [
      makeJob({ id: "z", title: "Beta", nextActionDate: "2026-08-05T00:00:00.000Z" }),
      makeJob({ id: "a", title: "Alpha", nextActionDate: "2026-08-05T00:00:00.000Z" }),
      makeJob({ id: "b", title: "Alpha", nextActionDate: "2026-08-05T00:00:00.000Z" }),
    ];

    const forward = mapJobsToCalendarEvents(jobs).map((event) => event.id);
    const reversed = mapJobsToCalendarEvents([...jobs].reverse()).map(
      (event) => event.id,
    );

    assert.deepEqual(forward, ["a", "b", "z"]);
    assert.deepEqual(forward, reversed, "order must not depend on input order");
  });

  test("keeps look-alike jobs apart by id", () => {
    const events = mapJobsToCalendarEvents([
      makeJob({ id: "first", title: "Same", nextActionDate: "2026-08-05T00:00:00.000Z" }),
      makeJob({ id: "second", title: "Same", nextActionDate: "2026-08-05T00:00:00.000Z" }),
    ]);

    const ids = events.map((event) => event.id);
    assert.equal(new Set(ids).size, ids.length);
  });

  test("places an event on the same date east and west of UTC", () => {
    const job = makeJob({ id: "a", nextActionDate: "2026-08-05T00:00:00.000Z" });

    for (const timeZone of ["Pacific/Kiritimati", "UTC", "Pacific/Midway"]) {
      process.env.TZ = timeZone;
      assert.equal(
        mapJobsToCalendarEvents([job])[0].dateKey,
        "2026-08-05",
        `shifted in ${timeZone}`,
      );
    }
  });
});

describe("groupEventsByDateKey", () => {
  test("returns an empty map for no events", () => {
    assert.equal(groupEventsByDateKey([]).size, 0);
  });

  test("collects several events under one date and preserves their order", () => {
    const events = mapJobsToCalendarEvents([
      makeJob({ id: "a", title: "Alpha", nextActionDate: "2026-08-05T00:00:00.000Z" }),
      makeJob({ id: "b", title: "Beta", nextActionDate: "2026-08-05T00:00:00.000Z" }),
      makeJob({ id: "c", title: "Gamma", nextActionDate: "2026-08-06T00:00:00.000Z" }),
    ]);

    const grouped = groupEventsByDateKey(events);

    assert.equal(grouped.size, 2);
    assert.deepEqual(
      grouped.get("2026-08-05")?.map((event) => event.id),
      ["a", "b"],
    );
    assert.deepEqual(
      grouped.get("2026-08-06")?.map((event) => event.id),
      ["c"],
    );
    assert.equal(grouped.get("2026-08-07"), undefined);
  });
});
