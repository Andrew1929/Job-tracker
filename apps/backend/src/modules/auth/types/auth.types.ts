import { PublicUser } from '../../users/types/user.types';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: PublicUser;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenPayload {
  sub: string;
  sessionId: string;
  tokenVersion: number;
  type: 'refresh';
}

export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: string;
  type: 'access';
}
