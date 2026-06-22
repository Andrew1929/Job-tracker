import type { Metadata } from "next";

import { GuestRoute } from "@/components/auth";
import { LoginForm } from "@/components/features/auth";
import { AuthLayout } from "@/components/layout/auth";

export const metadata: Metadata = {
  title: "Login — JobTracker",
  description: "Login to your JobTracker account",
};

export default function LoginPage() {
  return (
    <AuthLayout>
      <GuestRoute>
        <LoginForm />
      </GuestRoute>
    </AuthLayout>
  );
}
