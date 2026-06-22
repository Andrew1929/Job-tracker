"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/auth/api-error";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

type LogoutButtonProps = {
  className?: string;
};

export function LogoutButton({ className }: LogoutButtonProps) {
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await logout();
    } catch (err) {
      setError(getErrorMessage(err));
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col items-end gap-1", className)}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleLogout}
        disabled={isLoading}
        aria-busy={isLoading}
        className="border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive"
      >
        {isLoading ? "Logging out…" : "Logout"}
      </Button>

      {error ? (
        <p className="max-w-48 text-right text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
