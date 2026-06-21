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
