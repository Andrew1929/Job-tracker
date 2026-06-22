export type UserRole = "USER" | "ADMIN";

export type User = {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  emailVerified: boolean;
  emailVerifiedAt: string | null;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  email: string;
  password: string;
  name?: string;
};

export type LoginFormValues = {
  email: string;
  password: string;
};

export type RegisterFormValues = {
  fullName: string;
  email: string;
  password: string;
};

export type AuthFormState = "idle" | "loading" | "error" | "success";
