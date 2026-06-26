"use client";

import { Bell, Menu } from "lucide-react";

import { UserMenu } from "@/components/features/user-menu";
import { SearchInput } from "@/components/shared/SearchInput";
import { cn } from "@/lib/utils";

type TopBarProps = {
  onMenuClick?: () => void;
  className?: string;
};

export function TopBar({ onMenuClick, className }: TopBarProps) {
  return (
    <header
      className={cn(
        "flex h-16 shrink-0 items-center gap-4 border-b border-border/60 bg-card px-4 sm:px-6 lg:px-8",
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

      <div className="flex flex-1 justify-center lg:justify-start">
        <SearchInput className="max-w-sm lg:max-w-md" />
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button
          type="button"
          className="relative inline-flex size-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Notifications"
        >
          <Bell className="size-5" />
        </button>

        <UserMenu />
      </div>
    </header>
  );
}
