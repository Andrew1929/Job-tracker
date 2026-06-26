"use client";

import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect } from "react";

import { useLogout } from "@/components/features/auth/logout";
import { UserMenuDropdown } from "@/components/features/user-menu/UserMenuDropdown";
import { UserSummary } from "@/components/features/user-menu/UserSummary";
import { useDropdownMenu } from "@/hooks/useDropdownMenu";
import { cn } from "@/lib/utils";

export function UserMenu() {
  const pathname = usePathname();
  const { logout, isLoading, error, clearError } = useLogout();
  const {
    isOpen,
    close,
    toggle,
    containerRef,
    triggerRef,
    menuRef,
    menuId,
  } = useDropdownMenu();

  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    if (isOpen) {
      clearError();
    }
  }, [isOpen, clearError]);

  const handleLogout = useCallback(() => {
    close();
    void logout();
  }, [close, logout]);

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        disabled={isLoading}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={menuId}
        aria-label="User account menu"
        className={cn(
          "flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:gap-3 sm:px-3",
          isOpen && "bg-muted",
        )}
      >
        <span className="sm:hidden">
          <UserSummary showRole={false} />
        </span>
        <span className="hidden sm:flex sm:items-center sm:gap-3">
          <UserSummary />
        </span>
        <ChevronDown
          className={cn(
            "hidden size-4 text-muted-foreground transition-transform duration-150 sm:block",
            isOpen && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      <UserMenuDropdown
        isOpen={isOpen}
        menuId={menuId}
        onClose={close}
        onLogout={handleLogout}
        isLoggingOut={isLoading}
        menuRef={menuRef}
      />

      {error ? (
        <p
          className="absolute right-0 top-full z-50 mt-2 max-w-64 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs text-destructive"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
