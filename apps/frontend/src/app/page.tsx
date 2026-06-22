"use client";

import { LogoutButton, ProtectedRoute } from "@/components/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME } from "@/constants/auth.constants";
import { useAuth } from "@/hooks/useAuth";

function DashboardContent() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-card">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <span className="text-sm font-semibold tracking-tight text-foreground">
            {APP_NAME}
          </span>

          <LogoutButton />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">
              Welcome back
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Dashboard
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span>{user.email}</span>
              <span className="text-border">·</span>
              <span className="rounded-md bg-muted px-2 py-0.5 font-medium text-foreground">
                {user.role}
              </span>
            </div>
          </div>

          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            <span aria-hidden="true">✔</span>
            Authenticated
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                You are successfully logged in
              </CardTitle>
              <CardDescription>
                This is a protected route used to verify authentication flow.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {user.name
                  ? `Signed in as ${user.name}.`
                  : "Your session is active."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your activity overview</CardTitle>
              <CardDescription>
                Job search metrics will appear here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["Applications", "Interviews", "Offers"].map((label) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-sm"
                  >
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-foreground">—</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function HomePage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
