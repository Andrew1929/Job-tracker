import assert from "node:assert/strict";
import test, { describe } from "node:test";

import { buildYAxisTicks, niceAxisMax } from "./map-analytics.ts";

describe("buildYAxisTicks", () => {
  test("never repeats a tick, which previously produced duplicate React keys", () => {
    for (let maxValue = 1; maxValue <= 200; maxValue += 1) {
      const ticks = buildYAxisTicks(maxValue);
      assert.equal(
        new Set(ticks).size,
        ticks.length,
        `duplicate ticks for max ${maxValue}: ${ticks.join(", ")}`,
      );
    }
  });

  test("is strictly increasing and spans zero to the maximum", () => {
    for (const maxValue of [1, 2, 3, 4, 5, 10, 40, 100]) {
      const ticks = buildYAxisTicks(maxValue);

      assert.equal(ticks[0], 0);
      assert.equal(ticks.at(-1), maxValue);
      for (let index = 1; index < ticks.length; index += 1) {
        assert.ok(
          ticks[index] > ticks[index - 1],
          `not increasing for max ${maxValue}: ${ticks.join(", ")}`,
        );
      }
    }
  });

  test("collapses to as many segments as a small maximum allows", () => {
    assert.deepEqual(buildYAxisTicks(1), [0, 1]);
    assert.deepEqual(buildYAxisTicks(2), [0, 1, 2]);
    assert.deepEqual(buildYAxisTicks(3), [0, 1, 2, 3]);
    assert.deepEqual(buildYAxisTicks(4), [0, 1, 2, 3, 4]);
  });

  test("produces distinct ticks for every axis maximum the charts can request", () => {
    for (let peak = 0; peak <= 500; peak += 1) {
      const ticks = buildYAxisTicks(niceAxisMax(peak));
      assert.equal(new Set(ticks).size, ticks.length, `peak ${peak}`);
    }
  });
});
