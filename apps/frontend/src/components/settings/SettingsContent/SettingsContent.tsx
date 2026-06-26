"use client";

import { useState } from "react";

import { PreferencesSection } from "@/components/settings/PreferencesSection";
import { ProfileSection } from "@/components/settings/ProfileSection";
import { SettingsPlaceholder } from "@/components/settings/SettingsPlaceholder";
import { SettingsTabs } from "@/components/settings/SettingsTabs";
import { SETTINGS_TABS } from "@/constants/settings.constants";

import type { SettingsTabId } from "@/types/settings.types";

export function SettingsContent() {
  const [activeTab, setActiveTab] = useState<SettingsTabId>("profile");

  return (
    <div className="space-y-8">
      <SettingsTabs
        tabs={SETTINGS_TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="pt-2">
        {activeTab === "profile" ? <ProfileSection /> : null}
        {activeTab === "preferences" ? <PreferencesSection /> : null}
        {activeTab === "notifications" ? (
          <SettingsPlaceholder tabId="notifications" title="Notifications" />
        ) : null}
        {activeTab === "appearance" ? (
          <SettingsPlaceholder tabId="appearance" title="Appearance" />
        ) : null}
        {activeTab === "security" ? (
          <SettingsPlaceholder tabId="security" title="Security" />
        ) : null}
      </div>
    </div>
  );
}
