export type NotificationTabId = "all" | "unread" | "mentions";

export type NotificationIconType = "company" | "briefcase" | "chart";

export type NotificationItem = {
  id: string;
  title: string;
  timestamp: string;
  isRead: boolean;
  isMention: boolean;
  iconType: NotificationIconType;
  companyInitial?: string;
  companyColor?: string;
};

export type NotificationTab = {
  id: NotificationTabId;
  label: string;
};
