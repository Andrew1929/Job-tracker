"use client";

import {
  useMutation,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";

import {
  decrementUnreadCount,
  findNotificationInPages,
  markAllNotificationsReadInPage,
  markNotificationReadInPage,
  removeNotificationFromPage,
} from "@/lib/notifications/cache";
import { notificationKeys } from "@/lib/query/query-keys";
import {
  deleteNotification,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/services/notifications.service";
import type {
  PaginatedNotifications,
  UnreadCount,
} from "@/types/notifications.types";

type QueryClient = ReturnType<typeof useQueryClient>;

type NotificationCacheSnapshot = {
  lists: [QueryKey, PaginatedNotifications | undefined][];
  previousUnread: UnreadCount | undefined;
};

function patchNotificationLists(
  queryClient: QueryClient,
  patch: (
    page: PaginatedNotifications | undefined,
  ) => PaginatedNotifications | undefined,
): void {
  const lists = queryClient.getQueriesData<PaginatedNotifications>({
    queryKey: notificationKeys.lists(),
  });

  for (const [key, data] of lists) {
    queryClient.setQueryData(key, patch(data));
  }
}

/** Captures every cached page plus the unread badge so `onError` can restore them. */
function snapshotNotificationCache(
  queryClient: QueryClient,
): NotificationCacheSnapshot {
  return {
    lists: queryClient.getQueriesData<PaginatedNotifications>({
      queryKey: notificationKeys.lists(),
    }),
    previousUnread: queryClient.getQueryData<UnreadCount>(
      notificationKeys.unreadCount(),
    ),
  };
}

function rollbackNotificationCache(
  queryClient: QueryClient,
  snapshot: NotificationCacheSnapshot | undefined,
): void {
  snapshot?.lists.forEach(([key, data]) => {
    queryClient.setQueryData(key, data);
  });

  if (snapshot?.previousUnread) {
    queryClient.setQueryData(
      notificationKeys.unreadCount(),
      snapshot.previousUnread,
    );
  }
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all });

      const snapshot = snapshotNotificationCache(queryClient);
      const previous = findNotificationInPages(
        snapshot.lists.map(([, data]) => data),
        id,
      );
      const wasUnread = previous ? !previous.read : true;

      patchNotificationLists(queryClient, (page) =>
        markNotificationReadInPage(page, id),
      );
      queryClient.setQueryData(
        notificationKeys.unreadCount(),
        decrementUnreadCount(snapshot.previousUnread, wasUnread),
      );

      return snapshot;
    },
    onError: (_error, _id, context) => {
      rollbackNotificationCache(queryClient, context);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAllNotificationsRead(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all });

      const snapshot = snapshotNotificationCache(queryClient);

      patchNotificationLists(queryClient, markAllNotificationsReadInPage);
      queryClient.setQueryData(notificationKeys.unreadCount(), { count: 0 });

      return snapshot;
    },
    onError: (_error, _variables, context) => {
      rollbackNotificationCache(queryClient, context);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteNotification(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all });

      const snapshot = snapshotNotificationCache(queryClient);
      const previous = findNotificationInPages(
        snapshot.lists.map(([, data]) => data),
        id,
      );
      const wasUnread = previous ? !previous.read : false;

      patchNotificationLists(queryClient, (page) =>
        removeNotificationFromPage(page, id),
      );
      queryClient.setQueryData(
        notificationKeys.unreadCount(),
        decrementUnreadCount(snapshot.previousUnread, wasUnread),
      );

      return snapshot;
    },
    onError: (_error, _id, context) => {
      rollbackNotificationCache(queryClient, context);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}
