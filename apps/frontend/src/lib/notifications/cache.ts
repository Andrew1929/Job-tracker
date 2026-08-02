import type {
  Notification,
  PaginatedNotifications,
  UnreadCount,
} from "@/types/notifications.types";

/** Marks a single notification as read in a cached page without refetching. */
export function markNotificationReadInPage(
  page: PaginatedNotifications | undefined,
  id: string,
): PaginatedNotifications | undefined {
  if (!page) {
    return page;
  }

  return {
    ...page,
    items: page.items.map((item) =>
      item.id === id
        ? { ...item, read: true, readAt: item.readAt ?? new Date().toISOString() }
        : item,
    ),
  };
}

/** Marks every notification in a cached page as read. */
export function markAllNotificationsReadInPage(
  page: PaginatedNotifications | undefined,
): PaginatedNotifications | undefined {
  if (!page) {
    return page;
  }

  const now = new Date().toISOString();
  return {
    ...page,
    items: page.items.map((item) => ({
      ...item,
      read: true,
      readAt: item.readAt ?? now,
    })),
  };
}

/** Removes a notification from a cached page and adjusts the total. */
export function removeNotificationFromPage(
  page: PaginatedNotifications | undefined,
  id: string,
): PaginatedNotifications | undefined {
  if (!page) {
    return page;
  }

  const items = page.items.filter((item) => item.id !== id);
  if (items.length === page.items.length) {
    return page;
  }

  return {
    ...page,
    items,
    meta: {
      ...page.meta,
      total: Math.max(0, page.meta.total - 1),
    },
  };
}

export function decrementUnreadCount(
  current: UnreadCount | undefined,
  wasUnread: boolean,
): UnreadCount | undefined {
  if (!current || !wasUnread) {
    return current;
  }

  return { count: Math.max(0, current.count - 1) };
}

export function findNotificationInPages(
  pages: Array<PaginatedNotifications | undefined>,
  id: string,
): Notification | undefined {
  for (const page of pages) {
    const match = page?.items.find((item) => item.id === id);
    if (match) {
      return match;
    }
  }
  return undefined;
}
