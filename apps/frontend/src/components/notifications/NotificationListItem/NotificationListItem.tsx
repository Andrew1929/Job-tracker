"use client";

import {
  AlertTriangle,
  Bell,
  Briefcase,
  Calendar,
  Clock,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { formatNotificationTime } from "@/lib/notifications/format-notification-time";
import { cn } from "@/lib/utils";
import type { Notification, NotificationType } from "@/types/notifications.types";

type NotificationListItemProps = {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  compact?: boolean;
};

const TYPE_ICONS: Record<NotificationType, typeof Bell> = {
  NEXT_ACTION_REMINDER: Clock,
  NEXT_ACTION_OVERDUE: AlertTriangle,
  INTERVIEW_REMINDER: Calendar,
  INTERVIEW_FOLLOW_UP: Briefcase,
  APPLICATION_STALE: AlertTriangle,
  SYSTEM: Bell,
};

export function NotificationListItem({
  notification,
  onMarkRead,
  onDelete,
  compact = false,
}: NotificationListItemProps) {
  const router = useRouter();
  const Icon = TYPE_ICONS[notification.type] ?? Bell;

  const handleActivate = () => {
    if (!notification.read) {
      onMarkRead(notification.id);
    }

    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  return (
    <li
      className={cn(
        "flex items-start gap-3 px-4 py-3 transition-colors",
        !notification.read && "bg-primary/5",
        compact ? "sm:px-4" : "sm:px-6 sm:py-4",
      )}
    >
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full",
          notification.read
            ? "bg-muted text-muted-foreground"
            : "bg-primary/10 text-primary",
        )}
        aria-hidden="true"
      >
        <Icon className="size-4" />
      </div>

      <button
        type="button"
        onClick={handleActivate}
        className="min-w-0 flex-1 rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <p
          className={cn(
            "text-sm text-foreground",
            !notification.read && "font-semibold",
          )}
        >
          {notification.title}
        </p>
        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
          {notification.message}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {formatNotificationTime(notification.createdAt)}
        </p>
      </button>

      <div className="flex shrink-0 items-center gap-1 pt-0.5">
        {!notification.read ? (
          <span
            className="size-2.5 rounded-full bg-primary"
            aria-label="Unread"
          />
        ) : null}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground hover:text-foreground"
          aria-label="Dismiss notification"
          onClick={(event) => {
            event.stopPropagation();
            onDelete(notification.id);
          }}
        >
          <X className="size-4" />
        </Button>
      </div>
    </li>
  );
}
