"use client";

import { Menu } from "lucide-react";

import { UserMenu } from "@/components/features/user-menu";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { cn } from "@/lib/utils";

type TopBarProps = {
  onMenuClick?: () => void;
  className?: string;
};

export function TopBar({ onMenuClick, className }: TopBarProps) {
  return (
    <header
      className={cn(
        "flex h-16 shrink-0 items-center justify-end gap-4 border-b border-border/60 bg-card px-4 sm:px-6 lg:px-8",
        className,
      )}
    >
      <button
        type="button"
        onClick={onMenuClick}
        className="inline-flex size-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:hidden"
        aria-label="Open navigation menu"
      >
        <Menu className="size-5" />
      </button>

      <div className="flex items-center gap-2 sm:gap-4">
        <NotificationBell />
        <UserMenu />
      </div>
    </header>
  );
}
