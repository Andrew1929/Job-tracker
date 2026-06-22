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

import { AUTH_ROUTES } from "@/constants/auth.constants";
import { hasAccessToken } from "@/lib/auth/token.storage";
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

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const initializeSession = useCallback(async () => {
    if (!hasAccessToken()) {
      setUser(null);
      setIsLoading(false);
      return;
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
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      register,
      logout,
    }),
    [user, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
