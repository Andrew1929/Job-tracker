"use client";

import { useCallback, useState } from "react";

import { Sidebar } from "@/components/layout/dashboard/Sidebar";
import { TopBar } from "@/components/layout/dashboard/TopBar";
import { cn } from "@/lib/utils";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const closeMobileNav = useCallback(() => {
    setMobileNavOpen(false);
  }, []);

  const openMobileNav = useCallback(() => {
    setMobileNavOpen(true);
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar className="hidden lg:flex" />

      {mobileNavOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close navigation menu"
            onClick={closeMobileNav}
          />
          <Sidebar
            onNavigate={closeMobileNav}
            className="relative z-10 shadow-xl"
          />
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onMenuClick={openMobileNav} />
        <main className={cn("flex-1 overflow-auto p-4 sm:p-6 lg:p-8")}>
          {children}
        </main>
      </div>
    </div>
  );
}
