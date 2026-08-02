import assert from "node:assert/strict";
import test, { describe, mock } from "node:test";

import { createIdleTracker } from "./idle-tracker.ts";

const TIMEOUT_MS = 30 * 60 * 1000;
const THROTTLE_MS = 5000;

function setup(onIdle: () => void) {
  mock.timers.enable({ apis: ["setTimeout", "Date"] });

  return createIdleTracker({
    timeoutMs: TIMEOUT_MS,
    throttleMs: THROTTLE_MS,
    onIdle,
  });
}

describe("createIdleTracker", () => {
  test("reports idle once the timeout elapses without activity", (t) => {
    let idleCount = 0;
    const tracker = setup(() => {
      idleCount += 1;
    });
    t.after(() => {
      tracker.stop();
      mock.timers.reset();
    });

    mock.timers.tick(TIMEOUT_MS - 1);
    assert.equal(idleCount, 0);

    mock.timers.tick(1);
    assert.equal(idleCount, 1);
    assert.equal(tracker.isIdle(), true);
  });

  test("activity resets the inactivity deadline", (t) => {
    let idleCount = 0;
    const tracker = setup(() => {
      idleCount += 1;
    });
    t.after(() => {
      tracker.stop();
      mock.timers.reset();
    });

    mock.timers.tick(TIMEOUT_MS - 1000);
    tracker.notifyActivity();

    mock.timers.tick(TIMEOUT_MS - 1);
    assert.equal(idleCount, 0, "the deadline should have moved");

    mock.timers.tick(1);
    assert.equal(idleCount, 1);
  });

  test("throttles bursts of activity into a single recorded event", (t) => {
    const tracker = setup(() => {});
    t.after(() => {
      tracker.stop();
      mock.timers.reset();
    });

    // A burst inside the throttle window must not move the deadline, otherwise
    // every mouse move would re-arm the timer.
    mock.timers.tick(1000);
    for (let index = 0; index < 50; index += 1) {
      tracker.notifyActivity();
    }

    mock.timers.tick(TIMEOUT_MS - 1000);
    assert.equal(
      tracker.isIdle(),
      true,
      "the throttled burst should not have extended the session",
    );
  });

  test("records activity again once the throttle window passes", (t) => {
    const tracker = setup(() => {});
    t.after(() => {
      tracker.stop();
      mock.timers.reset();
    });

    mock.timers.tick(THROTTLE_MS);
    tracker.notifyActivity();

    mock.timers.tick(TIMEOUT_MS - 1);
    assert.equal(tracker.isIdle(), false);
  });

  test("stop cancels the pending timer and ignores later activity", (t) => {
    let idleCount = 0;
    const tracker = setup(() => {
      idleCount += 1;
    });
    t.after(() => mock.timers.reset());

    tracker.stop();
    mock.timers.tick(TIMEOUT_MS * 2);

    assert.equal(idleCount, 0);
  });
});
