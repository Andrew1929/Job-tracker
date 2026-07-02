import { BarChart3, Briefcase } from "lucide-react";

import { CompanyAvatar } from "@/components/shared/CompanyAvatar";
import { cn } from "@/lib/utils";

import type { NotificationItem } from "@/types/notifications.types";

type NotificationListItemProps = {
  notification: NotificationItem;
};

function NotificationIcon({ notification }: NotificationListItemProps) {
  if (notification.iconType === "company" && notification.companyInitial) {
    return (
      <CompanyAvatar
        initial={notification.companyInitial}
        colorClass={notification.companyColor ?? "bg-muted-foreground"}
        size="sm"
      />
    );
  }

  const Icon = notification.iconType === "chart" ? BarChart3 : Briefcase;

  return (
    <div
      className="flex size-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600"
      aria-hidden="true"
    >
      <Icon className="size-4" />
    </div>
  );
}

export function NotificationListItem({ notification }: NotificationListItemProps) {
  return (
    <li className="flex items-start gap-3 px-4 py-4 sm:px-6">
      <NotificationIcon notification={notification} />

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-sm text-foreground",
            !notification.isRead && "font-semibold",
          )}
        >
          {notification.title}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {notification.timestamp}
        </p>
      </div>

      <div className="flex shrink-0 items-center pt-1">
        {notification.isRead ? (
          <span
            className="size-2.5 rounded-full border border-border"
            aria-hidden="true"
          />
        ) : (
          <span
            className="size-2.5 rounded-full bg-primary"
            aria-label="Unread"
          />
        )}
      </div>
    </li>
  );
}
