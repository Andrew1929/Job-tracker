import type { JobsQueryParams } from "@/types/jobs.types";
import type { NotificationsQueryParams } from "@/types/notifications.types";

export const jobKeys = {
  all: ["jobs"] as const,
  lists: () => [...jobKeys.all, "list"] as const,
  list: (params: JobsQueryParams) => [...jobKeys.lists(), params] as const,
  details: () => [...jobKeys.all, "detail"] as const,
  detail: (id: string) => [...jobKeys.details(), id] as const,
};

export const analyticsKeys = {
  all: ["analytics"] as const,
  overview: () => [...analyticsKeys.all, "overview"] as const,
};

export const notificationKeys = {
  all: ["notifications"] as const,
  lists: () => [...notificationKeys.all, "list"] as const,
  list: (params: NotificationsQueryParams) =>
    [...notificationKeys.lists(), params] as const,
  unreadCount: () => [...notificationKeys.all, "unread-count"] as const,
  preferences: () => [...notificationKeys.all, "preferences"] as const,
};
