import type { Metadata } from "next";

import { GuestRoute } from "@/components/auth";
import { LoginForm } from "@/components/features/auth";
import { AuthLayout } from "@/components/layout/auth";
import {
  SESSION_EXPIRED_PARAM,
  SESSION_EXPIRED_VALUE,
} from "@/constants/auth.constants";

export const metadata: Metadata = {
  title: "Login — JobTracker",
  description: "Login to your JobTracker account",
};

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <AuthLayout>
      <GuestRoute>
        <LoginForm
          isSessionExpired={
            params[SESSION_EXPIRED_PARAM] === SESSION_EXPIRED_VALUE
          }
        />
      </GuestRoute>
    </AuthLayout>
  );
}
