"use client";

import { NotificationListItem } from "@/components/notifications/NotificationListItem";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Notification } from "@/types/notifications.types";

type NotificationListProps = {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  className?: string;
  compact?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
};

export function NotificationList({
  notifications,
  onMarkRead,
  onDelete,
  className,
  compact = false,
  emptyTitle = "No notifications",
  emptyDescription = "You're all caught up. New reminders will appear here.",
}: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        className={cn(compact ? "py-8" : "py-16", className)}
      />
    );
  }

  return (
    <Card className={cn("rounded-xl shadow-sm", className)}>
      <CardContent className="p-0">
        <ul className="divide-y divide-border/60">
          {notifications.map((notification) => (
            <NotificationListItem
              key={notification.id}
              notification={notification}
              onMarkRead={onMarkRead}
              onDelete={onDelete}
              compact={compact}
            />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
