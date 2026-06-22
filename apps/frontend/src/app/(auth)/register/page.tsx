import type { Metadata } from "next";

import { GuestRoute } from "@/components/auth";
import { RegisterForm } from "@/components/features/auth";
import { AuthLayout } from "@/components/layout/auth";

export const metadata: Metadata = {
  title: "Sign up — JobTracker",
  description: "Create your JobTracker account",
};

export default function RegisterPage() {
  return (
    <AuthLayout>
      <GuestRoute>
        <RegisterForm />
      </GuestRoute>
    </AuthLayout>
  );
}
