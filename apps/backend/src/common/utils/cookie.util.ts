import { Response } from 'express';
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from '../constants/auth.constants';

interface SetAuthCookiesOptions {
  accessToken: string;
  refreshToken: string;
  accessMaxAgeMs: number;
  refreshMaxAgeMs: number;
  secure: boolean;
}

export function setAuthCookies(
  response: Response,
  options: SetAuthCookiesOptions,
): void {
  const commonOptions = {
    httpOnly: true,
    secure: options.secure,
    sameSite: 'lax' as const,
    path: '/',
  };

  response.cookie(ACCESS_TOKEN_COOKIE, options.accessToken, {
    ...commonOptions,
    maxAge: options.accessMaxAgeMs,
  });

  response.cookie(REFRESH_TOKEN_COOKIE, options.refreshToken, {
    ...commonOptions,
    maxAge: options.refreshMaxAgeMs,
    path: '/auth',
  });
}

export function clearAuthCookies(response: Response): void {
  response.clearCookie(ACCESS_TOKEN_COOKIE, { path: '/' });
  response.clearCookie(REFRESH_TOKEN_COOKIE, { path: '/auth' });
}
