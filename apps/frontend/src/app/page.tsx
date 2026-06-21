import { redirect } from "next/navigation";

import { AUTH_ROUTES } from "@/constants/auth.constants";

export default function HomePage() {
  redirect(AUTH_ROUTES.login);
}
