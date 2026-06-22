import { registerAs } from '@nestjs/config';

export const AUTH_CONFIG_KEY = 'auth';

export interface AuthConfig {
  accessSecret: string;
  refreshSecret: string;
  accessExpiresIn: string;
  refreshExpiresIn: string;
  bcryptRounds: number;
  useCookies: boolean;
}

export default registerAs(
  AUTH_CONFIG_KEY,
  (): AuthConfig => ({
    accessSecret: process.env.JWT_ACCESS_SECRET ?? '',
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? '',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '30d',
    bcryptRounds: Number(process.env.BCRYPT_ROUNDS ?? 12),
    useCookies: process.env.AUTH_USE_COOKIES === 'true',
  }),
);
