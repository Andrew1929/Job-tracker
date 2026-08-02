import assert from "node:assert/strict";
import test, { describe } from "node:test";

import { getAccessTokenExpiryMs } from "./access-token.ts";

function encodeSegment(value: object): string {
  return Buffer.from(JSON.stringify(value))
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function buildToken(claims: object): string {
  return `header.${encodeSegment(claims)}.signature`;
}

describe("getAccessTokenExpiryMs", () => {
  test("converts the exp claim from seconds to milliseconds", () => {
    const expSeconds = Math.floor(
      Date.parse("2026-08-02T10:15:00.000Z") / 1000,
    );

    assert.equal(
      getAccessTokenExpiryMs(buildToken({ sub: "user-1", exp: expSeconds })),
      expSeconds * 1000,
    );
  });

  test("returns null when the token carries no expiry", () => {
    assert.equal(getAccessTokenExpiryMs(buildToken({ sub: "user-1" })), null);
  });

  test("returns null for malformed input instead of throwing", () => {
    assert.equal(getAccessTokenExpiryMs(null), null);
    assert.equal(getAccessTokenExpiryMs(""), null);
    assert.equal(getAccessTokenExpiryMs("not-a-jwt"), null);
    assert.equal(getAccessTokenExpiryMs("header..signature"), null);
    assert.equal(getAccessTokenExpiryMs("header.%%%.signature"), null);
  });
});
