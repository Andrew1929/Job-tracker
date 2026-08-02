import type {
  NotificationTab,
  NotificationsQueryParams,
} from "@/types/notifications.types";
import type { SelectOption } from "@/types/select-option.types";

export const NOTIFICATIONS_ROUTES = {
  list: "/notifications",
} as const;

export const NOTIFICATIONS_API_PATHS = {
  list: "/api/notifications",
  unreadCount: "/api/notifications/unread-count",
  read: (id: string) => `/api/notifications/${id}/read`,
  readAll: "/api/notifications/read-all",
  byId: (id: string) => `/api/notifications/${id}`,
  preferences: "/api/notification-preferences",
} as const;

export const NOTIFICATION_TABS: readonly NotificationTab[] = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
];

/** Recent items shown in the TopBar dropdown. */
export const NOTIFICATION_DROPDOWN_LIMIT = 8;

/** Full page default page size. */
export const NOTIFICATION_PAGE_LIMIT = 20;

/** Lightweight polling for unread count / recent list (ms). */
export const NOTIFICATION_POLL_INTERVAL_MS = 45_000;

export const NOTIFICATION_DROPDOWN_PARAMS: NotificationsQueryParams = {
  page: 1,
  limit: NOTIFICATION_DROPDOWN_LIMIT,
};

/** IANA timezones for notification delivery windows. */
export const NOTIFICATION_TIMEZONE_OPTIONS: SelectOption[] = [
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "America/New_York" },
  { value: "America/Chicago", label: "America/Chicago" },
  { value: "America/Denver", label: "America/Denver" },
  { value: "America/Los_Angeles", label: "America/Los_Angeles" },
  { value: "America/Sao_Paulo", label: "America/Sao_Paulo" },
  { value: "Europe/London", label: "Europe/London" },
  { value: "Europe/Berlin", label: "Europe/Berlin" },
  { value: "Europe/Warsaw", label: "Europe/Warsaw" },
  { value: "Europe/Paris", label: "Europe/Paris" },
  { value: "Asia/Dubai", label: "Asia/Dubai" },
  { value: "Asia/Kolkata", label: "Asia/Kolkata" },
  { value: "Asia/Singapore", label: "Asia/Singapore" },
  { value: "Asia/Tokyo", label: "Asia/Tokyo" },
  { value: "Australia/Sydney", label: "Australia/Sydney" },
];
