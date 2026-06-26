"use client";

import { cn } from "@/lib/utils";

import type { SettingsTab, SettingsTabId } from "@/types/settings.types";

type SettingsTabsProps = {
  tabs: SettingsTab[];
  activeTab: SettingsTabId;
  onTabChange: (tab: SettingsTabId) => void;
};

export function SettingsTabs({
  tabs,
  activeTab,
  onTabChange,
}: SettingsTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Settings sections"
      className="flex gap-6 overflow-x-auto border-b border-border/60"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`settings-tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`settings-panel-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "-mb-px shrink-0 border-b-2 pb-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
