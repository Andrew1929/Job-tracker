import { parseDurationToMs } from "@/lib/auth/duration";

export const APP_NAME = "JobTracker";

export const APP_TAGLINE = {
  line1: "Track your job search.",
  line2: "Stay organized. Get hired.",
} as const;

export const AUTH_ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
} as const;

export const AUTH_TOKEN_STORAGE_KEYS = {
  accessToken: "job_tracker_access_token",
  refreshToken: "job_tracker_refresh_token",
} as const;

export const AUTH_API_PATHS = {
  login: "/api/auth/login",
  register: "/api/auth/register",
  logout: "/api/auth/logout",
  me: "/api/auth/me",
  refresh: "/api/auth/refresh",
} as const;

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

/** Marks a login redirect caused by an expired session rather than a sign-out. */
export const SESSION_EXPIRED_PARAM = "session";
export const SESSION_EXPIRED_VALUE = "expired";

export const AUTH_SESSION = {
  /**
   * Access tokens are deliberately short-lived. The session stays alive by
   * refreshing them ahead of expiry rather than by extending the token.
   */
  refreshLeadMs: 60 * 1000,
  idleTimeoutMs: parseDurationToMs(
    process.env.NEXT_PUBLIC_AUTH_IDLE_TIMEOUT,
    30 * 60 * 1000,
  ),
  /** One recorded activity per window is enough to keep the session alive. */
  activityThrottleMs: 5 * 1000,
} as const;

export const AUTH_ACTIVITY_EVENTS = [
  "pointerdown",
  "keydown",
  "scroll",
  "touchstart",
  "wheel",
] as const;
