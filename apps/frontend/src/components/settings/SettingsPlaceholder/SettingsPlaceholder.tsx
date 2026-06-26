import type { SettingsTabId } from "@/types/settings.types";

type SettingsPlaceholderProps = {
  tabId: SettingsTabId;
  title: string;
};

export function SettingsPlaceholder({ tabId, title }: SettingsPlaceholderProps) {
  return (
    <section
      role="tabpanel"
      id={`settings-panel-${tabId}`}
      aria-labelledby={`settings-tab-${tabId}`}
      className="space-y-4"
    >
      <h2 className="text-xl font-bold tracking-tight text-foreground">
        {title}
      </h2>
      <p className="text-sm text-muted-foreground">
        Settings for {title.toLowerCase()} will appear here.
      </p>
    </section>
  );
}
