"use client";

import Link from "next/link";
import { Loader2, LogOut, Settings, User } from "lucide-react";
import { useCallback, useEffect } from "react";

import { UserSummary } from "@/components/features/user-menu/UserSummary";
import { AUTH_UI_LABELS } from "@/constants/auth-ui.constants";
import { USER_MENU_ROUTES } from "@/constants/user-menu.constants";
import { cn } from "@/lib/utils";

type UserMenuDropdownProps = {
  isOpen: boolean;
  menuId: string;
  onClose: () => void;
  onLogout: () => void;
  isLoggingOut?: boolean;
  menuRef: React.RefObject<HTMLDivElement | null>;
};

const menuItemClassName =
  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

function getMenuItems(menu: HTMLDivElement): HTMLElement[] {
  return Array.from(menu.querySelectorAll('[role="menuitem"]'));
}

export function UserMenuDropdown({
  isOpen,
  menuId,
  onClose,
  onLogout,
  isLoggingOut = false,
  menuRef,
}: UserMenuDropdownProps) {
  const focusItem = useCallback((index: number) => {
    const menu = menuRef.current;
    if (!menu) {
      return;
    }

    const items = getMenuItems(menu);
    items[index]?.focus();
  }, [menuRef]);

  const handleMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const menu = menuRef.current;
    if (!menu) {
      return;
    }

    const items = getMenuItems(menu);
    const currentIndex = items.findIndex(
      (item) => item === document.activeElement,
    );

    if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextIndex =
        currentIndex === -1 ? 0 : (currentIndex + 1) % items.length;
      focusItem(nextIndex);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      const nextIndex =
        currentIndex === -1
          ? items.length - 1
          : (currentIndex - 1 + items.length) % items.length;
      focusItem(nextIndex);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      focusItem(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      focusItem(items.length - 1);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      focusItem(0);
    });

    return () => cancelAnimationFrame(frame);
  }, [isOpen, focusItem]);

  return (
    <div
      ref={menuRef}
      id={menuId}
      role="menu"
      aria-orientation="vertical"
      aria-hidden={!isOpen}
      onKeyDown={handleMenuKeyDown}
      className={cn(
        "absolute right-0 top-full z-50 mt-2 w-64 max-w-[calc(100vw-2rem)] origin-top-right rounded-xl border border-border/60 bg-card p-2 shadow-lg shadow-black/10 transition-all duration-150 ease-out",
        isOpen
          ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
          : "pointer-events-none -translate-y-1 scale-95 opacity-0",
      )}
    >
      <Link
        href={USER_MENU_ROUTES.profile}
        role="menuitem"
        onClick={onClose}
        className={cn(menuItemClassName, "px-3 py-3")}
      >
        <UserSummary avatarSize="md" />
      </Link>

      <div
        className="my-1 border-t border-border/60"
        role="separator"
        aria-hidden="true"
      />

      <Link
        href={USER_MENU_ROUTES.profile}
        role="menuitem"
        onClick={onClose}
        className={menuItemClassName}
      >
        <User className="size-4 text-muted-foreground" aria-hidden="true" />
        Profile
      </Link>

      <Link
        href={USER_MENU_ROUTES.settings}
        role="menuitem"
        onClick={onClose}
        className={menuItemClassName}
      >
        <Settings className="size-4 text-muted-foreground" aria-hidden="true" />
        Settings
      </Link>

      <div
        className="my-1 border-t border-border/60"
        role="separator"
        aria-hidden="true"
      />

      <button
        type="button"
        role="menuitem"
        onClick={onLogout}
        disabled={isLoggingOut}
        aria-busy={isLoggingOut}
        aria-label={AUTH_UI_LABELS.logout}
        className={cn(
          menuItemClassName,
          "text-destructive hover:bg-destructive/5 hover:text-destructive disabled:pointer-events-none disabled:opacity-50",
        )}
      >
        {isLoggingOut ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <LogOut className="size-4" aria-hidden="true" />
        )}
        {isLoggingOut ? AUTH_UI_LABELS.loggingOut : AUTH_UI_LABELS.logout}
      </button>
    </div>
  );
}
