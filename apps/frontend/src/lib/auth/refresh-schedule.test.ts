import assert from "node:assert/strict";
import test, { describe } from "node:test";

import { isRefreshDue, msUntilRefresh } from "./refresh-schedule.ts";

const NOW = Date.parse("2026-08-02T10:00:00.000Z");
const LEAD_MS = 60 * 1000;

describe("msUntilRefresh", () => {
  test("schedules a refresh one lead time before expiry", () => {
    const expiry = NOW + 15 * 60 * 1000;

    assert.equal(msUntilRefresh(expiry, NOW, LEAD_MS), 14 * 60 * 1000);
  });

  test("refreshes immediately inside the lead window", () => {
    const expiry = NOW + 30 * 1000;

    assert.equal(msUntilRefresh(expiry, NOW, LEAD_MS), 0);
  });

  test("never returns a negative delay for an expired token", () => {
    const expiry = NOW - 60 * 60 * 1000;

    assert.equal(msUntilRefresh(expiry, NOW, LEAD_MS), 0);
  });

  test("returns null when the expiry is unknown", () => {
    assert.equal(msUntilRefresh(null, NOW, LEAD_MS), null);
  });
});

describe("isRefreshDue", () => {
  test("is false while the token is comfortably valid", () => {
    assert.equal(isRefreshDue(NOW + 15 * 60 * 1000, NOW, LEAD_MS), false);
  });

  test("is true once the lead window is reached", () => {
    assert.equal(isRefreshDue(NOW + LEAD_MS, NOW, LEAD_MS), true);
  });

  test("is true for an already expired token", () => {
    assert.equal(isRefreshDue(NOW - 1, NOW, LEAD_MS), true);
  });

  test("is false when the expiry is unknown", () => {
    assert.equal(isRefreshDue(null, NOW, LEAD_MS), false);
  });
});
