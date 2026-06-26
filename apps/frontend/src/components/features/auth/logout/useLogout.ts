"use client";

import { useCallback, useRef, useState } from "react";

import { getErrorMessage } from "@/lib/auth/api-error";
import { useAuth } from "@/hooks/useAuth";

export function useLogout() {
  const { logout: authLogout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isInFlightRef = useRef(false);

  const logout = useCallback(async () => {
    if (isInFlightRef.current) {
      return;
    }

    isInFlightRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      await authLogout();
    } catch (err) {
      setError(getErrorMessage(err));
      setIsLoading(false);
      isInFlightRef.current = false;
    }
  }, [authLogout]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    logout,
    isLoading,
    error,
    clearError,
  };
}
