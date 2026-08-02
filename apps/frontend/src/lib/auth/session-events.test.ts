import assert from "node:assert/strict";
import test, { describe } from "node:test";

import { AUTH_TOKEN_STORAGE_KEYS } from "@/constants/auth.constants";

import { isSessionEndedStorageEvent } from "./session-events.ts";

describe("isSessionEndedStorageEvent", () => {
  test("reacts to another tab clearing the access token", () => {
    assert.equal(
      isSessionEndedStorageEvent({
        key: AUTH_TOKEN_STORAGE_KEYS.accessToken,
        newValue: null,
      }),
      true,
    );
  });

  test("ignores another tab storing a refreshed access token", () => {
    assert.equal(
      isSessionEndedStorageEvent({
        key: AUTH_TOKEN_STORAGE_KEYS.accessToken,
        newValue: "a-new-token",
      }),
      false,
    );
  });

  test("ignores unrelated storage keys", () => {
    assert.equal(
      isSessionEndedStorageEvent({ key: "theme", newValue: null }),
      false,
    );
  });
});
