import type { NotificationItem, NotificationTab } from "@/types/notifications.types";

export const NOTIFICATION_TABS: readonly NotificationTab[] = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "mentions", label: "Mentions" },
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    title: "Google interview scheduled for tomorrow at 10:00 AM",
    timestamp: "May 15, 2024 • 10:00 AM",
    isRead: false,
    isMention: false,
    iconType: "company",
    companyInitial: "G",
    companyColor: "bg-blue-500",
  },
  {
    id: "2",
    title: "Amazon follow-up is overdue",
    timestamp: "May 14, 2024 • 3:30 PM",
    isRead: true,
    isMention: false,
    iconType: "company",
    companyInitial: "A",
    companyColor: "bg-orange-500",
  },
  {
    id: "3",
    title: "Stripe has moved your application to Offer stage 🎉",
    timestamp: "May 13, 2024 • 9:15 AM",
    isRead: true,
    isMention: true,
    iconType: "company",
    companyInitial: "S",
    companyColor: "bg-indigo-500",
  },
  {
    id: "4",
    title: "New job added to Applied column",
    timestamp: "May 12, 2024 • 5:00 PM",
    isRead: true,
    isMention: false,
    iconType: "briefcase",
  },
  {
    id: "5",
    title: "Microsoft interview feedback received",
    timestamp: "May 11, 2024 • 1:45 PM",
    isRead: true,
    isMention: true,
    iconType: "company",
    companyInitial: "M",
    companyColor: "bg-sky-600",
  },
  {
    id: "6",
    title: "Weekly summary is ready",
    timestamp: "May 10, 2024 • 8:00 AM",
    isRead: true,
    isMention: false,
    iconType: "chart",
  },
];
