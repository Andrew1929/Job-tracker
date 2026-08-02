import assert from "node:assert/strict";
import test, { describe, mock } from "node:test";

import { createSessionLifecycle } from "./session-lifecycle.ts";

const MINUTE = 60 * 1000;
const ACCESS_TOKEN_LIFETIME_MS = 15 * MINUTE;
const IDLE_TIMEOUT_MS = 30 * MINUTE;
const THROTTLE_MS = 5000;

/** Lets queued promise callbacks run between fake-timer ticks. */
function flush(): Promise<void> {
  return new Promise((resolve) => setImmediate(resolve));
}

type Harness = {
  refreshCount: number;
  expiredCount: number;
  visible: boolean;
};

function setup(options: { refreshSucceeds?: boolean } = {}) {
  mock.timers.enable({ apis: ["setTimeout", "Date"] });

  const state: Harness = {
    refreshCount: 0,
    expiredCount: 0,
    visible: true,
  };

  // The token is reissued on every successful refresh, exactly as the stored
  // pair is replaced in the browser.
  let expiryMs = Date.now() + ACCESS_TOKEN_LIFETIME_MS;

  const lifecycle = createSessionLifecycle({
    getExpiryMs: () => expiryMs,
    refresh: () => {
      state.refreshCount += 1;

      if (options.refreshSucceeds === false) {
        return Promise.resolve(false);
      }

      expiryMs = Date.now() + ACCESS_TOKEN_LIFETIME_MS;
      return Promise.resolve(true);
    },
    onExpired: () => {
      state.expiredCount += 1;
    },
    isVisible: () => state.visible,
    idleTimeoutMs: IDLE_TIMEOUT_MS,
    activityThrottleMs: THROTTLE_MS,
  });

  return { lifecycle, state };
}

/** Advances the clock while reporting activity, as an engaged user would. */
async function useAppFor(
  lifecycle: { notifyActivity: () => void },
  totalMs: number,
): Promise<void> {
  const step = MINUTE;

  for (let elapsed = 0; elapsed < totalMs; elapsed += step) {
    mock.timers.tick(step);
    lifecycle.notifyActivity();
    await flush();
  }
}

describe("createSessionLifecycle", () => {
  test("refreshes an active session before the access token expires", async (t) => {
    const { lifecycle, state } = setup();
    t.after(() => {
      lifecycle.stop();
      mock.timers.reset();
    });

    await useAppFor(lifecycle, 14 * MINUTE);

    assert.equal(
      state.refreshCount,
      1,
      "refreshed one lead time before expiry",
    );
    assert.equal(state.expiredCount, 0);
  });

  test("keeps an active user signed in well past the token lifetime", async (t) => {
    const { lifecycle, state } = setup();
    t.after(() => {
      lifecycle.stop();
      mock.timers.reset();
    });

    await useAppFor(lifecycle, 29 * MINUTE);

    assert.equal(
      state.expiredCount,
      0,
      "an active user must not be signed out",
    );
    assert.equal(state.refreshCount, 2, "one refresh per token lifetime");
  });

  test("signs out after the inactivity timeout", async (t) => {
    const { lifecycle, state } = setup();
    t.after(() => {
      lifecycle.stop();
      mock.timers.reset();
    });

    mock.timers.tick(IDLE_TIMEOUT_MS);
    await flush();

    assert.equal(state.expiredCount, 1);
  });

  test("stops refreshing once the session has expired", async (t) => {
    const { lifecycle, state } = setup();
    t.after(() => {
      lifecycle.stop();
      mock.timers.reset();
    });

    mock.timers.tick(IDLE_TIMEOUT_MS);
    await flush();
    const refreshesAtExpiry = state.refreshCount;

    mock.timers.tick(4 * IDLE_TIMEOUT_MS);
    await flush();

    assert.equal(state.refreshCount, refreshesAtExpiry);
    assert.equal(state.expiredCount, 1, "the session ends exactly once");
  });

  test("ends the session when the refresh is rejected", async (t) => {
    const { lifecycle, state } = setup({ refreshSucceeds: false });
    t.after(() => {
      lifecycle.stop();
      mock.timers.reset();
    });

    await useAppFor(lifecycle, 14 * MINUTE);

    assert.equal(state.refreshCount, 1);
    assert.equal(state.expiredCount, 1);
  });

  test("does not refresh while the tab is hidden", async (t) => {
    const { lifecycle, state } = setup();
    t.after(() => {
      lifecycle.stop();
      mock.timers.reset();
    });

    state.visible = false;
    mock.timers.tick(14 * MINUTE);
    await flush();

    assert.equal(state.refreshCount, 0);
  });

  test("refreshes an overdue token when the tab becomes visible", async (t) => {
    const { lifecycle, state } = setup();
    t.after(() => {
      lifecycle.stop();
      mock.timers.reset();
    });

    state.visible = false;
    mock.timers.tick(14 * MINUTE);
    await flush();

    state.visible = true;
    lifecycle.handleVisible();
    await flush();

    assert.equal(state.refreshCount, 1);
    assert.equal(state.expiredCount, 0);
  });

  test("expires a tab that returns after the inactivity timeout", async (t) => {
    const { lifecycle, state } = setup();
    t.after(() => {
      lifecycle.stop();
      mock.timers.reset();
    });

    state.visible = false;
    mock.timers.tick(IDLE_TIMEOUT_MS);
    await flush();

    assert.equal(state.expiredCount, 1);
    assert.equal(state.refreshCount, 0, "an abandoned tab must not refresh");
  });

  test("stop cancels every pending timer", async (t) => {
    const { lifecycle, state } = setup();
    t.after(() => mock.timers.reset());

    lifecycle.stop();
    mock.timers.tick(4 * IDLE_TIMEOUT_MS);
    await flush();

    assert.equal(state.refreshCount, 0);
    assert.equal(state.expiredCount, 0);
  });
});
