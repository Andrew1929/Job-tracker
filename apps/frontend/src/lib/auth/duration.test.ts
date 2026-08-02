import assert from "node:assert/strict";
import test, { describe } from "node:test";

import { parseDurationToMs } from "./duration.ts";

const FALLBACK_MS = 30 * 60 * 1000;

describe("parseDurationToMs", () => {
  test("parses each supported unit", () => {
    assert.equal(parseDurationToMs("30s", FALLBACK_MS), 30_000);
    assert.equal(parseDurationToMs("15m", FALLBACK_MS), 900_000);
    assert.equal(parseDurationToMs("1h", FALLBACK_MS), 3_600_000);
    assert.equal(parseDurationToMs("30d", FALLBACK_MS), 2_592_000_000);
  });

  test("reads a bare number as seconds", () => {
    assert.equal(parseDurationToMs("900", FALLBACK_MS), 900_000);
  });

  test("falls back rather than throwing on unusable configuration", () => {
    assert.equal(parseDurationToMs(undefined, FALLBACK_MS), FALLBACK_MS);
    assert.equal(parseDurationToMs("", FALLBACK_MS), FALLBACK_MS);
    assert.equal(parseDurationToMs("half an hour", FALLBACK_MS), FALLBACK_MS);
    assert.equal(parseDurationToMs("-5m", FALLBACK_MS), FALLBACK_MS);
  });
});
