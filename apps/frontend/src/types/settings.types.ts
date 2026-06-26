export type SettingsTabId =
  | "profile"
  | "preferences"
  | "notifications"
  | "appearance"
  | "security";

export type SettingsTab = {
  id: SettingsTabId;
  label: string;
};

export type ProfileFormData = {
  fullName: string;
  email: string;
  title: string;
  location: string;
};

export type PreferenceSelectOption = {
  value: string;
  label: string;
};

export type PreferenceToggle = {
  id: string;
  label: string;
  enabled: boolean;
};
