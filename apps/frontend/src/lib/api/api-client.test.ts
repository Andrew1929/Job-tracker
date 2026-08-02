import assert from "node:assert/strict";
import test, { beforeEach, describe } from "node:test";

import { AUTH_TOKEN_STORAGE_KEYS } from "@/constants/auth.constants";

import { apiRequest, ApiError } from "./api-client.ts";

type FetchCall = { url: string; method: string };

const store = new Map<string, string>();
let sessionEndedCount = 0;
let calls: FetchCall[] = [];

/**
 * `token.storage` and the session events read the browser globals lazily, so a
 * minimal stub is enough to exercise the real refresh-and-retry path.
 */
function installBrowserGlobals(): void {
  const localStorage = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, value),
    removeItem: (key: string) => store.delete(key),
  };

  Object.assign(globalThis, {
    window: {
      localStorage,
      dispatchEvent: () => {
        sessionEndedCount += 1;
        return true;
      },
    },
    localStorage,
  });
}

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/** Replies to each call in order, recording what was requested. */
function mockFetch(responses: (() => Response)[]): void {
  let index = 0;

  globalThis.fetch = ((url: string, init?: RequestInit) => {
    calls.push({ url, method: init?.method ?? "GET" });
    const next = responses[index] ?? responses[responses.length - 1];
    index += 1;
    return Promise.resolve(next());
  }) as typeof fetch;
}

const unauthorized = () => jsonResponse(401, { message: "Unauthorized" });
const rotatedTokens = () =>
  jsonResponse(200, {
    accessToken: "new-access-token",
    refreshToken: "new-refresh-token",
  });

function isRefreshCall(call: FetchCall): boolean {
  return call.url.includes("/api/auth/refresh");
}

describe("apiRequest session handling", () => {
  beforeEach(() => {
    store.clear();
    store.set(AUTH_TOKEN_STORAGE_KEYS.accessToken, "expired-access-token");
    store.set(AUTH_TOKEN_STORAGE_KEYS.refreshToken, "valid-refresh-token");
    calls = [];
    sessionEndedCount = 0;
    installBrowserGlobals();
  });

  test("refreshes once and retries the original request", async () => {
    mockFetch([
      unauthorized,
      rotatedTokens,
      () => jsonResponse(200, { items: [] }),
    ]);

    const result = await apiRequest<{ items: unknown[] }>("/api/jobs");

    assert.deepEqual(result, { items: [] });
    assert.equal(calls.length, 3);
    assert.equal(isRefreshCall(calls[1]), true);
    assert.equal(
      store.get(AUTH_TOKEN_STORAGE_KEYS.accessToken),
      "new-access-token",
      "the rotated pair must be persisted before the retry",
    );
  });

  test("retries at most once and surfaces a repeated 401", async () => {
    mockFetch([unauthorized, rotatedTokens, unauthorized]);

    await assert.rejects(
      apiRequest("/api/jobs"),
      (error: unknown) => error instanceof ApiError && error.statusCode === 401,
    );

    assert.equal(calls.length, 3, "no second refresh-and-retry round");
    assert.equal(calls.filter(isRefreshCall).length, 1);
  });

  test("shares a single refresh across concurrent failures", async () => {
    mockFetch([
      unauthorized,
      unauthorized,
      rotatedTokens,
      () => jsonResponse(200, { ok: true }),
    ]);

    await Promise.all([apiRequest("/api/jobs"), apiRequest("/api/analytics")]);

    assert.equal(
      calls.filter(isRefreshCall).length,
      1,
      "a second rotation would invalidate the first",
    );
  });

  test("ends the session when the refresh is rejected", async () => {
    mockFetch([unauthorized, unauthorized]);

    await assert.rejects(apiRequest("/api/jobs"));

    assert.equal(store.has(AUTH_TOKEN_STORAGE_KEYS.accessToken), false);
    assert.equal(store.has(AUTH_TOKEN_STORAGE_KEYS.refreshToken), false);
    assert.equal(sessionEndedCount, 1);
  });

  test("never tries to refresh the auth endpoints themselves", async () => {
    mockFetch([unauthorized]);

    await assert.rejects(apiRequest("/api/auth/login", { method: "POST" }));

    assert.equal(calls.length, 1);
    assert.equal(sessionEndedCount, 0);
  });

  test("leaves non-authentication failures untouched", async () => {
    mockFetch([() => jsonResponse(403, { message: "Forbidden" })]);

    await assert.rejects(
      apiRequest("/api/jobs"),
      (error: unknown) => error instanceof ApiError && error.statusCode === 403,
    );

    assert.equal(calls.length, 1);
    assert.equal(sessionEndedCount, 0);
  });
});
