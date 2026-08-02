"use client";

import { useState } from "react";

import { NotificationList } from "@/components/notifications/NotificationList";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/shared/Skeleton";
import { Button } from "@/components/ui/button";
import {
  NOTIFICATION_PAGE_LIMIT,
  NOTIFICATION_TABS,
} from "@/constants/notifications.constants";
import {
  useDeleteNotification,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotificationsQuery,
} from "@/hooks/notifications";
import { getApiErrorMessage } from "@/lib/api/error-message";
import { cn } from "@/lib/utils";
import type { NotificationTabId } from "@/types/notifications.types";

export function NotificationsContent() {
  const [activeTab, setActiveTab] = useState<NotificationTabId>("all");

  // Reminders are created by a background worker, never by a request this page
  // makes, so the list has to poll to pick them up without a reload.
  const query = useNotificationsQuery(
    {
      page: 1,
      limit: NOTIFICATION_PAGE_LIMIT,
      unreadOnly: activeTab === "unread" ? true : undefined,
    },
    { poll: true },
  );

  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const deleteNotification = useDeleteNotification();

  const notifications = query.data?.items ?? [];

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
          disabled={markAllRead.isPending || notifications.every((n) => n.read)}
          onClick={() => markAllRead.mutate()}
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
        {query.isLoading ? (
          <div
            className="space-y-3 rounded-xl border border-border/60 bg-card p-4"
            aria-busy="true"
            aria-label="Loading notifications"
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-16 rounded-lg" />
            ))}
          </div>
        ) : null}

        {query.isError ? (
          <ErrorState
            message={getApiErrorMessage(query.error)}
            onRetry={() => void query.refetch()}
            isRetrying={query.isFetching}
          />
        ) : null}

        {!query.isLoading && !query.isError ? (
          <NotificationList
            notifications={notifications}
            onMarkRead={(id) => markRead.mutate(id)}
            onDelete={(id) => deleteNotification.mutate(id)}
          />
        ) : null}
      </div>
    </div>
  );
}
