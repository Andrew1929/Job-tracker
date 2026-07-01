import { LayoutGrid, List } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { JobsViewMode } from "@/types/jobs.types";

type JobsViewToggleProps = {
  viewMode: JobsViewMode;
  onViewModeChange: (mode: JobsViewMode) => void;
  className?: string;
};

const VIEW_MODES = [
  { mode: "list" as const, label: "List view", icon: List },
  { mode: "grid" as const, label: "Grid view", icon: LayoutGrid },
];

export function JobsViewToggle({
  viewMode,
  onViewModeChange,
  className,
}: JobsViewToggleProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border border-input bg-card p-1",
        className,
      )}
      role="group"
      aria-label="View mode"
    >
      {VIEW_MODES.map(({ mode, label, icon: Icon }) => {
        const isActive = viewMode === mode;

        return (
          <Button
            key={mode}
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              "size-8",
              isActive
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => onViewModeChange(mode)}
            aria-label={label}
            aria-pressed={isActive}
          >
            <Icon />
          </Button>
        );
      })}
    </div>
  );
}
