type ApiErrorBody = {
  message?: string | string[];
  statusCode?: number;
};

export class AuthApiError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "AuthApiError";
    this.statusCode = statusCode;
  }
}

export async function parseApiErrorMessage(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as ApiErrorBody;

    if (Array.isArray(data.message)) {
      return data.message.join(". ");
    }

    if (typeof data.message === "string" && data.message.length > 0) {
      return data.message;
    }
  } catch {
    // Fall through to default message.
  }

  return "Something went wrong. Please try again.";
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof AuthApiError) {
    return error.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}
