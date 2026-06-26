"use client";

import { useLogout } from "@/components/features/auth/logout";
import { Button } from "@/components/ui/button";
import { AUTH_UI_LABELS } from "@/constants/auth-ui.constants";
import { cn } from "@/lib/utils";

type LogoutButtonProps = {
  className?: string;
};

export function LogoutButton({ className }: LogoutButtonProps) {
  const { logout, isLoading, error } = useLogout();

  return (
    <div className={cn("flex flex-col items-end gap-1", className)}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => void logout()}
        disabled={isLoading}
        aria-busy={isLoading}
        className="border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive"
      >
        {isLoading ? AUTH_UI_LABELS.loggingOut : AUTH_UI_LABELS.logout}
      </Button>

      {error ? (
        <p className="max-w-48 text-right text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
