import { NOTIFICATIONS_API_PATHS } from "@/constants/notifications.constants";
import { apiRequest } from "@/lib/api/api-client";
import type {
  NotificationPreferences,
  NotificationsQueryParams,
  PaginatedNotifications,
  UnreadCount,
  UpdateNotificationPreferencesInput,
} from "@/types/notifications.types";

export function getNotifications(
  params: NotificationsQueryParams = {},
  signal?: AbortSignal,
): Promise<PaginatedNotifications> {
  return apiRequest<PaginatedNotifications>(NOTIFICATIONS_API_PATHS.list, {
    query: {
      page: params.page,
      limit: params.limit,
      unreadOnly:
        params.unreadOnly === undefined ? undefined : String(params.unreadOnly),
      type: params.type,
    },
    signal,
  });
}

export function getUnreadNotificationCount(
  signal?: AbortSignal,
): Promise<UnreadCount> {
  return apiRequest<UnreadCount>(NOTIFICATIONS_API_PATHS.unreadCount, {
    signal,
  });
}

export function markNotificationRead(id: string): Promise<void> {
  return apiRequest<void>(NOTIFICATIONS_API_PATHS.read(id), {
    method: "PATCH",
  });
}

export function markAllNotificationsRead(): Promise<void> {
  return apiRequest<void>(NOTIFICATIONS_API_PATHS.readAll, {
    method: "POST",
  });
}

export function deleteNotification(id: string): Promise<void> {
  return apiRequest<void>(NOTIFICATIONS_API_PATHS.byId(id), {
    method: "DELETE",
  });
}

export function getNotificationPreferences(
  signal?: AbortSignal,
): Promise<NotificationPreferences> {
  return apiRequest<NotificationPreferences>(
    NOTIFICATIONS_API_PATHS.preferences,
    { signal },
  );
}

export function updateNotificationPreferences(
  input: UpdateNotificationPreferencesInput,
): Promise<NotificationPreferences> {
  return apiRequest<NotificationPreferences>(
    NOTIFICATIONS_API_PATHS.preferences,
    {
      method: "PATCH",
      body: input,
    },
  );
}
