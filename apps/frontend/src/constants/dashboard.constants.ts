import {
  AlertTriangle,
  Award,
  Briefcase,
  UserRound,
} from "lucide-react";

import type {
  ChartDataPoint,
  RecentApplication,
  StatCardData,
  UpcomingInterview,
  WeeklyGoalData,
} from "@/types/dashboard.types";

export const DASHBOARD_STATS: StatCardData[] = [
  {
    id: "total-jobs",
    title: "Total Jobs",
    value: 24,
    trend: "+ 12% from last month",
    trendDirection: "up",
    iconBgClass: "bg-violet-100",
    iconClass: "text-violet-600",
  },
  {
    id: "interviews",
    title: "Interviews",
    value: 5,
    trend: "+ 8% from last month",
    trendDirection: "up",
    iconBgClass: "bg-sky-100",
    iconClass: "text-sky-600",
  },
  {
    id: "offers",
    title: "Offers",
    value: 2,
    trend: "+ 100% from last month",
    trendDirection: "up",
    iconBgClass: "bg-emerald-100",
    iconClass: "text-emerald-600",
  },
  {
    id: "rejected",
    title: "Rejected",
    value: 17,
    trend: "- 5% from last month",
    trendDirection: "down",
    iconBgClass: "bg-amber-100",
    iconClass: "text-amber-600",
  },
];

export const STAT_CARD_ICONS = {
  "total-jobs": Briefcase,
  interviews: UserRound,
  offers: Award,
  rejected: AlertTriangle,
} as const;

export const CHART_PERIOD_OPTIONS = [
  { value: "this-month", label: "This Month" },
  { value: "last-month", label: "Last Month" },
  { value: "last-3-months", label: "Last 3 Months" },
] as const;

export const APPLICATIONS_CHART_DATA: ChartDataPoint[] = [
  { label: "May 1", value: 12 },
  { label: "May 8", value: 18 },
  { label: "May 15", value: 15 },
  { label: "May 22", value: 28 },
  { label: "May 29", value: 32 },
];

export const UPCOMING_INTERVIEWS: UpcomingInterview[] = [
  {
    id: "1",
    company: "Google",
    companyInitial: "G",
    companyColor: "bg-blue-500",
    role: "Frontend Developer",
    dateTime: "May 15, 10:00 AM",
  },
  {
    id: "2",
    company: "Amazon",
    companyInitial: "A",
    companyColor: "bg-orange-500",
    role: "Software Engineer",
    dateTime: "May 18, 2:00 PM",
  },
  {
    id: "3",
    company: "Stripe",
    companyInitial: "S",
    companyColor: "bg-indigo-500",
    role: "Full Stack Developer",
    dateTime: "May 22, 11:00 AM",
  },
];

export const RECENT_APPLICATIONS: RecentApplication[] = [
  {
    id: "1",
    company: "Google",
    companyInitial: "G",
    companyColor: "bg-blue-500",
    role: "Frontend Developer",
    status: "Interview",
    date: "May 10, 2026",
  },
  {
    id: "2",
    company: "Meta",
    companyInitial: "M",
    companyColor: "bg-blue-600",
    role: "React Developer",
    status: "Applied",
    date: "May 8, 2026",
  },
  {
    id: "3",
    company: "Apple",
    companyInitial: "A",
    companyColor: "bg-gray-800",
    role: "UI Engineer",
    status: "Offer",
    date: "May 5, 2026",
  },
  {
    id: "4",
    company: "Netflix",
    companyInitial: "N",
    companyColor: "bg-red-600",
    role: "Senior Frontend Dev",
    status: "Applied",
    date: "May 3, 2026",
  },
];

export const WEEKLY_GOAL: WeeklyGoalData = {
  current: 14,
  target: 20,
};
