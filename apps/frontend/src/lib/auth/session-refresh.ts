import { refreshAuthTokens } from "@/services/auth.service";

export type SessionRefresher = {
  /**
   * Resolves to whether the session is still alive. Concurrent callers share
   * one request: several requests failing with 401 at the same time must not
   * each rotate the refresh token, which would invalidate the others.
   */
  refresh: () => Promise<boolean>;
};

export function createSessionRefresher(
  refreshTokens: () => Promise<void>,
): SessionRefresher {
  let inFlight: Promise<boolean> | null = null;

  return {
    refresh: () => {
      inFlight ??= refreshTokens()
        .then(() => true)
        .catch(() => false)
        .finally(() => {
          inFlight = null;
        });

      return inFlight;
    },
  };
}

export const sessionRefresher = createSessionRefresher(refreshAuthTokens);
