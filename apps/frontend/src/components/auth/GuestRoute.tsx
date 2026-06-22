"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { AUTH_ROUTES } from "@/constants/auth.constants";
import { useAuth } from "@/hooks/useAuth";

type GuestRouteProps = {
  children: ReactNode;
};

export function GuestRoute({ children }: GuestRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(AUTH_ROUTES.home);
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
