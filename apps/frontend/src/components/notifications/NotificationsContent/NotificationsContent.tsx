"use client";

import { useState } from "react";

import { NotificationList } from "@/components/notifications/NotificationList";
import { Button } from "@/components/ui/button";
import { MOCK_NOTIFICATIONS, NOTIFICATION_TABS } from "@/constants/notifications.constants";
import { cn } from "@/lib/utils";

import type { NotificationItem, NotificationTabId } from "@/types/notifications.types";

function filterNotifications(
  notifications: NotificationItem[],
  activeTab: NotificationTabId,
): NotificationItem[] {
  switch (activeTab) {
    case "unread":
      return notifications.filter((notification) => !notification.isRead);
    case "mentions":
      return notifications.filter((notification) => notification.isMention);
    default:
      return notifications;
  }
}

export function NotificationsContent() {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<NotificationTabId>("all");

  const visibleNotifications = filterNotifications(notifications, activeTab);

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, isRead: true })),
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Notifications
        </h1>
        <Button
          type="button"
          variant="link"
          className="h-auto p-0 text-primary"
          onClick={markAllAsRead}
        >
          Mark all as read
        </Button>
      </div>

      <div
        role="tablist"
        aria-label="Notification filters"
        className="flex gap-6 overflow-x-auto border-b border-border/60"
      >
        {NOTIFICATION_TABS.map((tab) => {
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`notifications-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls="notifications-panel"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "-mb-px shrink-0 border-b-2 pb-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        id="notifications-panel"
        role="tabpanel"
        aria-labelledby={`notifications-tab-${activeTab}`}
      >
        <NotificationList notifications={visibleNotifications} />
      </div>
    </div>
  );
}
