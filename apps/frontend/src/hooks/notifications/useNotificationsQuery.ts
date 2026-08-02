"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { NOTIFICATION_POLL_INTERVAL_MS } from "@/constants/notifications.constants";
import { notificationKeys } from "@/lib/query/query-keys";
import { getNotifications } from "@/services/notifications.service";
import type { NotificationsQueryParams } from "@/types/notifications.types";

type UseNotificationsQueryOptions = {
  /** Poll for notifications created by the background worker. */
  poll?: boolean;
};

export function useNotificationsQuery(
  params: NotificationsQueryParams,
  options: UseNotificationsQueryOptions = {},
) {
  return useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: ({ signal }) => getNotifications(params, signal),
    placeholderData: keepPreviousData,
    refetchInterval: options.poll ? NOTIFICATION_POLL_INTERVAL_MS : false,
    refetchIntervalInBackground: false,
  });
}
