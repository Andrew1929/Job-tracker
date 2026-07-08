import { API_BASE_URL } from "@/constants/auth.constants";
import { getAccessToken } from "@/lib/auth/token.storage";

export class ApiError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

type ApiErrorBody = {
  message?: string | string[];
  statusCode?: number;
};

type RequestOptions = {
  method?: string;
  body?: unknown;
  query?: Record<string, string | number | undefined>;
  signal?: AbortSignal;
};

function buildUrl(
  path: string,
  query?: RequestOptions["query"],
): string {
  const url = `${API_BASE_URL}${path}`;

  if (!query) {
    return url;
  }

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== "") {
      params.append(key, String(value));
    }
  }

  const queryString = params.toString();
  return queryString ? `${url}?${queryString}` : url;
}

async function parseErrorMessage(response: Response): Promise<string | null> {
  try {
    const data = (await response.json()) as ApiErrorBody;

    if (Array.isArray(data.message)) {
      return data.message.join(". ");
    }

    if (typeof data.message === "string" && data.message.length > 0) {
      return data.message;
    }
  } catch {
    // No JSON body; fall back to a status-derived message.
  }

  return null;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const accessToken = getAccessToken();
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  let response: Response;
  try {
    response = await fetch(buildUrl(path, options.query), {
      method: options.method ?? "GET",
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: options.signal,
    });
  } catch {
    throw new ApiError(
      "Unable to reach the server. Check your connection and try again.",
      0,
    );
  }

  if (!response.ok) {
    const serverMessage = await parseErrorMessage(response);
    throw new ApiError(
      serverMessage ?? fallbackMessageForStatus(response.status),
      response.status,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

function fallbackMessageForStatus(status: number): string {
  return STATUS_FALLBACK_MESSAGES[status] ?? "Something went wrong. Please try again.";
}

const STATUS_FALLBACK_MESSAGES: Record<number, string> = {
  400: "The request was invalid. Please review your input and try again.",
  401: "Your session has expired. Please sign in again.",
  403: "You do not have permission to perform this action.",
  404: "The requested resource was not found.",
  409: "This action conflicts with the current state. Please refresh and try again.",
  500: "The server encountered an error. Please try again shortly.",
};
