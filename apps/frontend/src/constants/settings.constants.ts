import type {
  PreferenceSelectOption,
  PreferenceToggle,
  ProfileFormData,
  SettingsTab,
} from "@/types/settings.types";

export const SETTINGS_TABS: SettingsTab[] = [
  { id: "profile", label: "Profile" },
  { id: "preferences", label: "Preferences" },
  { id: "notifications", label: "Notifications" },
  { id: "appearance", label: "Appearance" },
  { id: "security", label: "Security" },
];

export const DEFAULT_PROFILE: ProfileFormData = {
  fullName: "John Doe",
  email: "john.doe@example.com",
  title: "Job Seeker",
  location: "New York, USA",
};

export const DEFAULT_VIEW_OPTIONS: PreferenceSelectOption[] = [
  { value: "kanban", label: "Kanban Board" },
  { value: "list", label: "List View" },
  { value: "calendar", label: "Calendar" },
];

export const JOBS_PER_PAGE_OPTIONS: PreferenceSelectOption[] = [
  { value: "10", label: "10" },
  { value: "25", label: "25" },
  { value: "50", label: "50" },
];

export const DATE_FORMAT_OPTIONS: PreferenceSelectOption[] = [
  { value: "mdy-long", label: "May 15, 2006" },
  { value: "dmy", label: "15/05/2006" },
  { value: "ymd", label: "2006-05-15" },
];

export const TIME_FORMAT_OPTIONS: PreferenceSelectOption[] = [
  { value: "12h", label: "12-Hour (AM/PM)" },
  { value: "24h", label: "24-Hour" },
];

export const TIMEZONE_OPTIONS: PreferenceSelectOption[] = [
  {
    value: "america-new_york",
    label: "(UTC-05:00) Eastern Time (US & Canada)",
  },
  { value: "america-chicago", label: "(UTC-06:00) Central Time (US & Canada)" },
  { value: "america-denver", label: "(UTC-07:00) Mountain Time (US & Canada)" },
  {
    value: "america-los_angeles",
    label: "(UTC-08:00) Pacific Time (US & Canada)",
  },
];

export const DEFAULT_PREFERENCE_TOGGLES: PreferenceToggle[] = [
  { id: "auto-save", label: "Auto save", enabled: true },
  { id: "email-notifications", label: "Email notifications", enabled: true },
  { id: "weekly-summary", label: "Weekly summary", enabled: true },
  { id: "interview-reminders", label: "Interview reminders", enabled: true },
];
