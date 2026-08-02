type IdleTrackerOptions = {
  timeoutMs: number;
  /**
   * Activity arrives as a flood of pointer and scroll events. Recording one per
   * window is enough to keep the session alive and keeps the tracker off the
   * hot path of every mouse move.
   */
  throttleMs: number;
  onIdle: () => void;
  now?: () => number;
};

export type IdleTracker = {
  /** Records user activity; ignored while inside the throttle window. */
  notifyActivity: () => void;
  /** Whether the session has already passed the inactivity deadline. */
  isIdle: (nowMs?: number) => boolean;
  stop: () => void;
};

export function createIdleTracker({
  timeoutMs,
  throttleMs,
  onIdle,
  now = Date.now,
}: IdleTrackerOptions): IdleTracker {
  let lastActivityAt = now();
  let lastRecordedAt = lastActivityAt;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let stopped = false;

  const arm = () => {
    if (timer !== null) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      timer = null;
      onIdle();
    }, timeoutMs);
  };

  arm();

  return {
    notifyActivity: () => {
      if (stopped) {
        return;
      }

      const timestamp = now();
      if (timestamp - lastRecordedAt < throttleMs) {
        return;
      }

      lastRecordedAt = timestamp;
      lastActivityAt = timestamp;
      arm();
    },
    isIdle: (nowMs = now()) => nowMs - lastActivityAt >= timeoutMs,
    stop: () => {
      stopped = true;
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
    },
  };
}
