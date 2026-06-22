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
