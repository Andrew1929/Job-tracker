import { NotificationListItem } from "@/components/notifications/NotificationListItem";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { NotificationItem } from "@/types/notifications.types";

type NotificationListProps = {
  notifications: NotificationItem[];
  className?: string;
};

export function NotificationList({
  notifications,
  className,
}: NotificationListProps) {
  return (
    <Card className={cn("rounded-xl shadow-sm", className)}>
      <CardContent className="p-0">
        {notifications.length > 0 ? (
          <ul className="divide-y divide-border/60">
            {notifications.map((notification) => (
              <NotificationListItem
                key={notification.id}
                notification={notification}
              />
            ))}
          </ul>
        ) : (
          <p className="px-6 py-12 text-center text-sm text-muted-foreground">
            No notifications found.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
