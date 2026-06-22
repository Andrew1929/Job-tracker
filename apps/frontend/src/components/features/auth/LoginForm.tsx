"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { AUTH_ROUTES } from "@/constants/auth.constants";
import { useAuth } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/auth/api-error";
import {
  loginSchema,
  type LoginSchema,
} from "@/lib/validations/auth.schema";
import { cn } from "@/lib/utils";

type LoginFormProps = {
  className?: string;
};

export function LoginForm({ className }: LoginFormProps) {
  const { login } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginSchema) => {
    setFormError(null);

    try {
      await login({
        email: data.email,
        password: data.password,
      });
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  };

  return (
    <Card className={cn("w-full border-0 shadow-xl shadow-black/5", className)}>
      <CardHeader className="space-y-2 pb-2 text-center">
        <CardTitle className="text-2xl font-bold sm:text-3xl">
          Welcome back 👋
        </CardTitle>
        <CardDescription className="text-base">
          Login to your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          {formError ? (
            <p className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive" role="alert">
              {formError}
            </p>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "login-email-error" : undefined}
              {...register("email")}
            />
            {errors.email && (
              <p
                id="login-email-error"
                className="text-sm text-destructive"
                role="alert"
              >
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="login-password">Password</Label>
            <PasswordInput
              id="login-password"
              placeholder="Enter your password"
              autoComplete="current-password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={
                errors.password ? "login-password-error" : undefined
              }
              {...register("password")}
            />
            {errors.password && (
              <p
                id="login-password-error"
                className="text-sm text-destructive"
                role="alert"
              >
                {errors.password.message}
              </p>
            )}
            <div className="flex justify-end pt-1">
              <Link
                href={AUTH_ROUTES.forgotPassword}
                className="text-sm font-medium text-primary transition-colors hover:text-primary/80 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? "Logging in…" : "Login"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href={AUTH_ROUTES.register}
            className="font-semibold text-primary transition-colors hover:text-primary/80 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
          >
            Create account
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
