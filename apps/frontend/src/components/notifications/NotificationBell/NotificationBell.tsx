"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { NotificationList } from "@/components/notifications/NotificationList";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/shared/Skeleton";
import { Button } from "@/components/ui/button";
import {
  NOTIFICATION_DROPDOWN_PARAMS,
  NOTIFICATIONS_ROUTES,
} from "@/constants/notifications.constants";
import {
  useDeleteNotification,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotificationsQuery,
  useUnreadNotificationCountQuery,
} from "@/hooks/notifications";
import { useDropdownMenu } from "@/hooks/useDropdownMenu";
import { getApiErrorMessage } from "@/lib/api/error-message";
import { cn } from "@/lib/utils";

export function NotificationBell() {
  const pathname = usePathname();
  const {
    isOpen,
    close,
    toggle,
    containerRef,
    triggerRef,
    menuRef,
    menuId,
  } = useDropdownMenu();

  const unreadQuery = useUnreadNotificationCountQuery();
  const listQuery = useNotificationsQuery(NOTIFICATION_DROPDOWN_PARAMS, {
    poll: true,
  });
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const deleteNotification = useDeleteNotification();

  useEffect(() => {
    close();
  }, [pathname, close]);

  const unreadCount = unreadQuery.data?.count ?? 0;
  const notifications = listQuery.data?.items ?? [];
  const badgeLabel =
    unreadCount > 99 ? "99+" : unreadCount > 0 ? String(unreadCount) : null;

  const handleMarkRead = (id: string) => {
    // Navigation must not wait on mark-as-read; failures are reconciled by polling.
    markRead.mutate(id);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-controls={menuId}
        aria-label={
          unreadCount > 0
            ? `Notifications, ${unreadCount} unread`
            : "Notifications"
        }
        className={cn(
          "relative inline-flex size-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          isOpen && "bg-muted text-foreground",
        )}
      >
        <Bell className="size-5" />
        {badgeLabel ? (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
            {badgeLabel}
          </span>
        ) : null}
      </button>

      <div
        ref={menuRef}
        id={menuId}
        role="dialog"
        aria-label="Notification center"
        aria-hidden={!isOpen}
        className={cn(
          "absolute right-0 top-full z-50 mt-2 w-[min(24rem,calc(100vw-2rem))] origin-top-right rounded-xl border border-border/60 bg-card shadow-lg shadow-black/10 transition-all duration-150 ease-out",
          isOpen
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-1 scale-95 opacity-0",
        )}
      >
        <div className="flex items-center justify-between gap-2 border-b border-border/60 px-4 py-3">
          <p className="text-sm font-semibold text-foreground">Notifications</p>
          <Button
            type="button"
            variant="link"
            className="h-auto p-0 text-xs"
            disabled={markAllRead.isPending || unreadCount === 0}
            onClick={() => markAllRead.mutate()}
          >
            Mark all as read
          </Button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {listQuery.isLoading ? (
            <div
              className="space-y-2 p-3"
              aria-busy="true"
              aria-label="Loading notifications"
            >
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-14 rounded-lg" />
              ))}
            </div>
          ) : null}

          {listQuery.isError ? (
            <ErrorState
              className="py-8"
              message={getApiErrorMessage(listQuery.error)}
              onRetry={() => void listQuery.refetch()}
              isRetrying={listQuery.isFetching}
            />
          ) : null}

          {!listQuery.isLoading && !listQuery.isError ? (
            <NotificationList
              notifications={notifications}
              onMarkRead={handleMarkRead}
              onDelete={(id) => {
                deleteNotification.mutate(id);
              }}
              compact
              className="border-0 shadow-none"
            />
          ) : null}
        </div>

        <div className="border-t border-border/60 p-2">
          <Link
            href={NOTIFICATIONS_ROUTES.list}
            onClick={close}
            className="flex w-full items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            View all notifications
          </Link>
        </div>
      </div>
    </div>
  );
}
