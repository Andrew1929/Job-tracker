import type { Metadata } from "next";

import Link from "next/link";

import { AuthLayout } from "@/components/layout/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AUTH_ROUTES } from "@/constants/auth.constants";

export const metadata: Metadata = {
  title: "Forgot password — JobTracker",
  description: "Reset your JobTracker account password",
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <Card className="w-full border-0 shadow-xl shadow-black/5">
        <CardHeader className="space-y-2 pb-2 text-center">
          <CardTitle className="text-2xl font-bold sm:text-3xl">
            Forgot password?
          </CardTitle>
          <CardDescription className="text-base">
            {/* TODO: Implement password reset form when backend is ready */}
            Password reset will be available soon.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            This page is a placeholder for the forgot password flow.
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link href={AUTH_ROUTES.login}>Back to login</Link>
          </Button>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
