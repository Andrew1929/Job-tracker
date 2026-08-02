export const REDIS_KEY_PREFIX = {
  AUTH_REFRESH: 'auth:refresh',
  ANALYTICS: 'analytics',
} as const;

export const AUTH_REFRESH_TOKEN_TTL_SECONDS = 30 * 24 * 60 * 60;
