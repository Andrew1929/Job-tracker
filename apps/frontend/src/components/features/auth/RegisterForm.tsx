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
  registerSchema,
  type RegisterSchema,
} from "@/lib/validations/auth.schema";
import { cn } from "@/lib/utils";

type RegisterFormProps = {
  className?: string;
};

export function RegisterForm({ className }: RegisterFormProps) {
  const { register: registerUser } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterSchema) => {
    setFormError(null);

    try {
      await registerUser({
        email: data.email,
        password: data.password,
        name: data.fullName,
      });
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  };

  return (
    <Card className={cn("w-full border-0 shadow-xl shadow-black/5", className)}>
      <CardHeader className="space-y-2 pb-2 text-center">
        <CardTitle className="text-2xl font-bold sm:text-3xl">
          Create your account
        </CardTitle>
        <CardDescription className="text-base">
          Sign up to get started
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
            <Label htmlFor="register-full-name">Full name</Label>
            <Input
              id="register-full-name"
              type="text"
              placeholder="John Doe"
              autoComplete="name"
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={
                errors.fullName ? "register-full-name-error" : undefined
              }
              {...register("fullName")}
            />
            {errors.fullName && (
              <p
                id="register-full-name-error"
                className="text-sm text-destructive"
                role="alert"
              >
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-email">Email</Label>
            <Input
              id="register-email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={
                errors.email ? "register-email-error" : undefined
              }
              {...register("email")}
            />
            {errors.email && (
              <p
                id="register-email-error"
                className="text-sm text-destructive"
                role="alert"
              >
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-password">Password</Label>
            <PasswordInput
              id="register-password"
              placeholder="Create a password"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={
                errors.password ? "register-password-error" : undefined
              }
              {...register("password")}
            />
            {errors.password && (
              <p
                id="register-password-error"
                className="text-sm text-destructive"
                role="alert"
              >
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? "Creating account…" : "Sign up"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href={AUTH_ROUTES.login}
            className="font-semibold text-primary transition-colors hover:text-primary/80 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
          >
            Login
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
