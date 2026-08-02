import assert from "node:assert/strict";
import test, { describe } from "node:test";

import { formatNotificationTime } from "./format-notification-time.ts";

describe("formatNotificationTime", () => {
  test("formats a valid ISO timestamp", () => {
    const formatted = formatNotificationTime("2026-08-02T14:30:00.000Z", "en-US");
    assert.match(formatted, /Aug/);
    assert.match(formatted, /2026/);
  });

  test("returns a placeholder for invalid input", () => {
    assert.equal(formatNotificationTime("not-a-date"), "—");
  });
});
