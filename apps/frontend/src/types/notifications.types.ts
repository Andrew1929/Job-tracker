export const NOTIFICATION_TYPES = [
  "NEXT_ACTION_REMINDER",
  "NEXT_ACTION_OVERDUE",
  "INTERVIEW_REMINDER",
  "INTERVIEW_FOLLOW_UP",
  "APPLICATION_STALE",
  "SYSTEM",
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export const NOTIFICATION_PRIORITIES = [
  "LOW",
  "NORMAL",
  "HIGH",
  "URGENT",
] as const;

export type NotificationPriority = (typeof NOTIFICATION_PRIORITIES)[number];

export type NotificationEntityType = "JOB" | "INTERVIEW";

export type NotificationTabId = "all" | "unread";

export type NotificationTab = {
  id: NotificationTabId;
  label: string;
};

/** Backend-aligned notification row (mirrors `NotificationResponseDto`). */
export type Notification = {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  actionUrl: string | null;
  read: boolean;
  readAt: string | null;
  relatedEntityType: NotificationEntityType | null;
  relatedEntityId: string | null;
  createdAt: string;
};

export type NotificationsQueryParams = {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
  type?: NotificationType;
};

export type PaginatedNotifications = {
  items: Notification[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export type UnreadCount = {
  count: number;
};

export type NotificationPreferences = {
  inAppEnabled: boolean;
  nextActionRemindersEnabled: boolean;
  interviewRemindersEnabled: boolean;
  interviewFollowUpsEnabled: boolean;
  staleApplicationRemindersEnabled: boolean;
  timezone: string;
  nextActionReminderLeadMinutes: number;
  interviewReminderLeadMinutes: number[];
  interviewFollowUpDelayMinutes: number;
  staleApplicationThresholdDays: number;
};

export type UpdateNotificationPreferencesInput = Partial<NotificationPreferences>;
