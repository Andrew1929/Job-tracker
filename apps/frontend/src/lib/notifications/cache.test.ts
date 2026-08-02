import assert from "node:assert/strict";
import test, { describe } from "node:test";

import {
  decrementUnreadCount,
  markAllNotificationsReadInPage,
  markNotificationReadInPage,
  removeNotificationFromPage,
} from "./cache.ts";
import type {
  Notification,
  PaginatedNotifications,
} from "@/types/notifications.types";

function buildNotification(
  overrides: Partial<Notification> = {},
): Notification {
  return {
    id: "n-1",
    type: "SYSTEM",
    priority: "NORMAL",
    title: "Title",
    message: "Body",
    actionUrl: "/jobs/1",
    read: false,
    readAt: null,
    relatedEntityType: null,
    relatedEntityId: null,
    createdAt: "2026-08-02T12:00:00.000Z",
    ...overrides,
  };
}

function buildPage(items: Notification[]): PaginatedNotifications {
  return {
    items,
    meta: {
      page: 1,
      limit: 20,
      total: items.length,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  };
}

describe("notification cache helpers", () => {
  test("marks one notification as read", () => {
    const page = buildPage([
      buildNotification({ id: "a", read: false }),
      buildNotification({ id: "b", read: false }),
    ]);

    const next = markNotificationReadInPage(page, "a");
    assert.equal(next?.items[0]?.read, true);
    assert.equal(next?.items[1]?.read, false);
  });

  test("marks all notifications as read", () => {
    const page = buildPage([
      buildNotification({ id: "a", read: false }),
      buildNotification({ id: "b", read: false }),
    ]);

    const next = markAllNotificationsReadInPage(page);
    assert.ok(next?.items.every((item) => item.read));
  });

  test("removes a notification and decrements total", () => {
    const page = buildPage([
      buildNotification({ id: "a" }),
      buildNotification({ id: "b" }),
    ]);

    const next = removeNotificationFromPage(page, "a");
    assert.equal(next?.items.length, 1);
    assert.equal(next?.meta.total, 1);
    assert.equal(next?.items[0]?.id, "b");
  });

  test("decrements unread count only when the item was unread", () => {
    assert.deepEqual(decrementUnreadCount({ count: 3 }, true), { count: 2 });
    assert.deepEqual(decrementUnreadCount({ count: 3 }, false), { count: 3 });
    assert.equal(decrementUnreadCount(undefined, true), undefined);
  });
});
