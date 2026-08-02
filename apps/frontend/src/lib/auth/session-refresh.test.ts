import assert from "node:assert/strict";
import test, { describe } from "node:test";

import { createSessionRefresher } from "./session-refresh.ts";

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}

describe("createSessionRefresher", () => {
  test("shares one request between concurrent callers", async () => {
    let calls = 0;
    const pending = deferred<void>();
    const refresher = createSessionRefresher(() => {
      calls += 1;
      return pending.promise;
    });

    const results = Promise.all([
      refresher.refresh(),
      refresher.refresh(),
      refresher.refresh(),
    ]);

    pending.resolve();

    assert.deepEqual(await results, [true, true, true]);
    assert.equal(calls, 1, "the refresh token must only be rotated once");
  });

  test("reports failure without throwing to every caller", async () => {
    const refresher = createSessionRefresher(() =>
      Promise.reject(new Error("401")),
    );

    assert.equal(await refresher.refresh(), false);
  });

  test("allows a new attempt after the previous one settles", async () => {
    let calls = 0;
    const refresher = createSessionRefresher(() => {
      calls += 1;
      return Promise.resolve();
    });

    await refresher.refresh();
    await refresher.refresh();

    assert.equal(calls, 2);
  });

  test("does not cache a failed attempt", async () => {
    let calls = 0;
    const refresher = createSessionRefresher(() => {
      calls += 1;
      return calls === 1 ? Promise.reject(new Error("401")) : Promise.resolve();
    });

    assert.equal(await refresher.refresh(), false);
    assert.equal(await refresher.refresh(), true);
  });
});
