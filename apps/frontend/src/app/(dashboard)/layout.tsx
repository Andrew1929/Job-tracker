import { ProtectedRoute } from "@/components/auth";
import { DashboardLayout } from "@/components/layout/dashboard/DashboardLayout";

type DashboardGroupLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardGroupLayout({
  children,
}: DashboardGroupLayoutProps) {
  return (
    <ProtectedRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}
