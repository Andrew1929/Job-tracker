"use client";

import { useQuery } from "@tanstack/react-query";

import { NOTIFICATION_POLL_INTERVAL_MS } from "@/constants/notifications.constants";
import { notificationKeys } from "@/lib/query/query-keys";
import { getUnreadNotificationCount } from "@/services/notifications.service";

export function useUnreadNotificationCountQuery() {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: ({ signal }) => getUnreadNotificationCount(signal),
    refetchInterval: NOTIFICATION_POLL_INTERVAL_MS,
    refetchIntervalInBackground: false,
  });
}
