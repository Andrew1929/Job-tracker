import {
  API_BASE_URL,
  AUTH_API_PATHS,
} from "@/constants/auth.constants";
import { AuthApiError, parseApiErrorMessage } from "@/lib/auth/api-error";
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  setAuthTokens,
} from "@/lib/auth/token.storage";
import type {
  AuthResponse,
  LoginInput,
  RegisterInput,
  User,
} from "@/types/auth.types";

type RequestOptions = {
  method?: string;
  body?: unknown;
  accessToken?: string | null;
};

async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options.accessToken) {
    headers.Authorization = `Bearer ${options.accessToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const message = await parseApiErrorMessage(response);
    throw new AuthApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

function persistAuthSession(response: AuthResponse): User {
  setAuthTokens(response.accessToken, response.refreshToken);
  return response.user;
}

export async function login(input: LoginInput): Promise<User> {
  const response = await apiRequest<AuthResponse>(AUTH_API_PATHS.login, {
    method: "POST",
    body: input,
  });

  return persistAuthSession(response);
}

export async function register(input: RegisterInput): Promise<User> {
  const response = await apiRequest<AuthResponse>(AUTH_API_PATHS.register, {
    method: "POST",
    body: input,
  });

  return persistAuthSession(response);
}

export async function getCurrentUser(): Promise<User> {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new AuthApiError("Not authenticated", 401);
  }

  return apiRequest<User>(AUTH_API_PATHS.me, {
    accessToken,
  });
}

export async function logout(): Promise<void> {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  if (accessToken) {
    const body: { refreshToken?: string } = {};

    if (refreshToken) {
      body.refreshToken = refreshToken;
    }

    try {
      await apiRequest<{ message: string }>(AUTH_API_PATHS.logout, {
        method: "POST",
        body,
        accessToken,
      });
    } catch {
      // Always clear local session even if server logout fails.
    }
  }

  clearAuthTokens();
}
