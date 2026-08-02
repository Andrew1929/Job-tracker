import { createIdleTracker } from "@/lib/auth/idle-tracker";
import { isRefreshDue, msUntilRefresh } from "@/lib/auth/refresh-schedule";

type SessionLifecycleOptions = {
  /** Expiry of the currently stored access token, or null when unknown. */
  getExpiryMs: () => number | null;
  /** Rotates the token pair; resolves to whether the session survived. */
  refresh: () => Promise<boolean>;
  /** Called once when the session must end. The lifecycle stops itself first. */
  onExpired: () => void;
  isVisible: () => boolean;
  idleTimeoutMs: number;
  activityThrottleMs: number;
  now?: () => number;
};

export type SessionLifecycle = {
  notifyActivity: () => void;
  /** Call when the tab becomes visible again. */
  handleVisible: () => void;
  stop: () => void;
};

/**
 * Keeps an active session alive across short-lived access tokens.
 *
 * The token is replaced shortly before it expires rather than being made
 * longer, so an active user is never interrupted while an abandoned session
 * still stops refreshing and expires on schedule. Kept free of browser APIs so
 * the policy can be tested directly; the provider only feeds it DOM events.
 */
export function createSessionLifecycle({
  getExpiryMs,
  refresh,
  onExpired,
  isVisible,
  idleTimeoutMs,
  activityThrottleMs,
  now = Date.now,
}: SessionLifecycleOptions): SessionLifecycle {
  let refreshTimer: ReturnType<typeof setTimeout> | null = null;
  let stopped = false;

  const clearRefreshTimer = () => {
    if (refreshTimer !== null) {
      clearTimeout(refreshTimer);
      refreshTimer = null;
    }
  };

  const stop = () => {
    stopped = true;
    clearRefreshTimer();
    idleTracker.stop();
  };

  const expire = () => {
    if (stopped) {
      return;
    }

    stop();
    onExpired();
  };

  const scheduleRefresh = () => {
    clearRefreshTimer();

    if (stopped) {
      return;
    }

    const delay = msUntilRefresh(getExpiryMs(), now());
    if (delay === null) {
      return;
    }

    refreshTimer = setTimeout(() => {
      refreshTimer = null;
      void runRefresh();
    }, delay);
  };

  const runRefresh = async () => {
    if (stopped) {
      return;
    }

    if (idleTracker.isIdle()) {
      expire();
      return;
    }

    // A hidden tab does no work; `handleVisible` resumes it on return.
    if (!isVisible()) {
      return;
    }

    const isSessionAlive = await refresh();

    if (stopped) {
      return;
    }

    if (!isSessionAlive) {
      expire();
      return;
    }

    scheduleRefresh();
  };

  const idleTracker = createIdleTracker({
    timeoutMs: idleTimeoutMs,
    throttleMs: activityThrottleMs,
    onIdle: expire,
    now,
  });

  scheduleRefresh();

  return {
    notifyActivity: () => idleTracker.notifyActivity(),
    handleVisible: () => {
      if (stopped) {
        return;
      }

      idleTracker.notifyActivity();

      if (isRefreshDue(getExpiryMs(), now())) {
        void runRefresh();
        return;
      }

      scheduleRefresh();
    },
    stop,
  };
}
