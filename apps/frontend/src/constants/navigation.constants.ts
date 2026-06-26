import {
  BarChart3,
  Bell,
  Calendar,
  Columns3,
  LayoutDashboard,
  Settings,
  Briefcase,
} from "lucide-react";

import type { NavItem } from "@/types/navigation.types";

export const SIDEBAR_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Jobs", href: "/jobs", icon: Briefcase },
  { label: "Kanban Board", href: "/kanban", icon: Columns3 },
  { label: "Calendar", href: "/calendar", icon: Calendar },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Settings", href: "/settings", icon: Settings },
];

export const DEMO_USER = {
  name: "John Doe",
  role: "Admin",
} as const;
