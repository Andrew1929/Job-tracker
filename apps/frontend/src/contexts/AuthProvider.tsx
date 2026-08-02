"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

import {
  AUTH_ACTIVITY_EVENTS,
  AUTH_ROUTES,
  AUTH_SESSION,
  SESSION_EXPIRED_PARAM,
  SESSION_EXPIRED_VALUE,
} from "@/constants/auth.constants";
import { getAccessTokenExpiryMs } from "@/lib/auth/access-token";
import { isRefreshDue } from "@/lib/auth/refresh-schedule";
import {
  isSessionEndedStorageEvent,
  SESSION_ENDED_EVENT,
} from "@/lib/auth/session-events";
import { createSessionLifecycle } from "@/lib/auth/session-lifecycle";
import { sessionRefresher } from "@/lib/auth/session-refresh";
import {
  clearAuthTokens,
  getAccessToken,
  hasAccessToken,
} from "@/lib/auth/token.storage";
import * as authService from "@/services/auth.service";
import type { LoginInput, RegisterInput, User } from "@/types/auth.types";

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

const SESSION_EXPIRED_ROUTE = `${AUTH_ROUTES.login}?${SESSION_EXPIRED_PARAM}=${SESSION_EXPIRED_VALUE}`;

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = Boolean(user);

  const initializeSession = useCallback(async () => {
    if (!hasAccessToken()) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    // A page load after the access token expired is still a live session as
    // long as the refresh token holds, so restore it before giving up.
    if (isRefreshDue(getAccessTokenExpiryMs(getAccessToken()), Date.now())) {
      const isSessionAlive = await sessionRefresher.refresh();

      if (!isSessionAlive) {
        clearAuthTokens();
        setUser(null);
        setIsLoading(false);
        return;
      }
    }

    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch {
      await authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void initializeSession();
  }, [initializeSession]);

  /** Drops the local session. `expired` separates a timeout from a sign-out. */
  const endSession = useCallback(
    (expired: boolean) => {
      clearAuthTokens();
      setUser(null);
      router.replace(expired ? SESSION_EXPIRED_ROUTE : AUTH_ROUTES.login);
    },
    [router],
  );

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const lifecycle = createSessionLifecycle({
      getExpiryMs: () => getAccessTokenExpiryMs(getAccessToken()),
      refresh: () => sessionRefresher.refresh(),
      onExpired: () => endSession(true),
      isVisible: () => document.visibilityState === "visible",
      idleTimeoutMs: AUTH_SESSION.idleTimeoutMs,
      activityThrottleMs: AUTH_SESSION.activityThrottleMs,
    });

    const handleActivity = () => lifecycle.notifyActivity();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        lifecycle.handleVisible();
      }
    };

    // Another tab cleared the tokens: follow it out without claiming to know
    // whether it was a sign-out or an expiry.
    const handleStorage = (event: StorageEvent) => {
      if (isSessionEndedStorageEvent(event)) {
        endSession(false);
      }
    };

    const handleSessionEnded = () => endSession(true);

    AUTH_ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, handleActivity, { passive: true });
    });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("storage", handleStorage);
    window.addEventListener(SESSION_ENDED_EVENT, handleSessionEnded);

    return () => {
      lifecycle.stop();

      AUTH_ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, handleActivity);
      });
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(SESSION_ENDED_EVENT, handleSessionEnded);
    };
  }, [isAuthenticated, endSession]);

  const login = useCallback(
    async (input: LoginInput) => {
      const authenticatedUser = await authService.login(input);
      setUser(authenticatedUser);
      router.replace(AUTH_ROUTES.home);
    },
    [router],
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      const authenticatedUser = await authService.register(input);
      setUser(authenticatedUser);
      router.replace(AUTH_ROUTES.home);
    },
    [router],
  );

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    router.replace(AUTH_ROUTES.login);
  }, [router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      login,
      register,
      logout,
    }),
    [user, isAuthenticated, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
