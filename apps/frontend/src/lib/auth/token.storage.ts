import { AUTH_TOKEN_STORAGE_KEYS } from "@/constants/auth.constants";

function getStorageItem(key: string): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(key);
}

function setStorageItem(key: string, value: string): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, value);
}

function removeStorageItem(key: string): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(key);
}

export function getAccessToken(): string | null {
  return getStorageItem(AUTH_TOKEN_STORAGE_KEYS.accessToken);
}

export function getRefreshToken(): string | null {
  return getStorageItem(AUTH_TOKEN_STORAGE_KEYS.refreshToken);
}

export function hasAccessToken(): boolean {
  return Boolean(getAccessToken());
}

export function setAuthTokens(accessToken: string, refreshToken: string): void {
  setStorageItem(AUTH_TOKEN_STORAGE_KEYS.accessToken, accessToken);
  setStorageItem(AUTH_TOKEN_STORAGE_KEYS.refreshToken, refreshToken);
}

export function clearAuthTokens(): void {
  removeStorageItem(AUTH_TOKEN_STORAGE_KEYS.accessToken);
  removeStorageItem(AUTH_TOKEN_STORAGE_KEYS.refreshToken);
}
