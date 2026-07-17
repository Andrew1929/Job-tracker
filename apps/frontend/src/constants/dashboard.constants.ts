import { Award, Briefcase, Percent, UserRound, type LucideIcon } from "lucide-react";

import type { DashboardStatId } from "@/types/dashboard.types";

export const DASHBOARD_RECENT_APPLICATIONS_LIMIT = 5;
export const DASHBOARD_UPCOMING_INTERVIEWS_LIMIT = 5;

export type DashboardStatPresentation = {
  icon: LucideIcon;
  iconBgClass: string;
  iconClass: string;
};

// Presentation config for the summary stat cards, keyed by metric id so the
// icon and colour stay stable regardless of the values returned by the API.
export const DASHBOARD_STAT_PRESENTATION: Record<
  DashboardStatId,
  DashboardStatPresentation
> = {
  applications: {
    icon: Briefcase,
    iconBgClass: "bg-violet-100",
    iconClass: "text-violet-600",
  },
  interviews: {
    icon: UserRound,
    iconBgClass: "bg-sky-100",
    iconClass: "text-sky-600",
  },
  offers: {
    icon: Award,
    iconBgClass: "bg-emerald-100",
    iconClass: "text-emerald-600",
  },
  "acceptance-rate": {
    icon: Percent,
    iconBgClass: "bg-amber-100",
    iconClass: "text-amber-600",
  },
};
