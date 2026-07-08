import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { AUTH_REFRESH_TOKEN_TTL_SECONDS } from '../../../common/constants/redis-keys.constants';
import { AUTH_CONFIG_KEY, AuthConfig } from '../../../config/auth.config';
import { RedisService } from '../../redis/redis.service';
import {
  AccessTokenPayload,
  AuthTokens,
  RefreshTokenPayload,
} from '../types/auth.types';

@Injectable()
export class TokenService {
  private readonly authConfig: AuthConfig;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.authConfig = this.configService.get<AuthConfig>(AUTH_CONFIG_KEY)!;
  }

  generateSessionId(): string {
    return randomUUID();
  }

  async generateTokenPair(input: {
    userId: string;
    email: string;
    role: string;
    sessionId: string;
    tokenVersion: number;
  }): Promise<AuthTokens> {
    const accessToken = await this.jwtService.signAsync(
      {
        sub: input.userId,
        email: input.email,
        role: input.role,
        type: 'access',
      } satisfies AccessTokenPayload,
      {
        secret: this.authConfig.accessSecret,
        expiresIn: this.authConfig
          .accessExpiresIn as `${number}${'s' | 'm' | 'h' | 'd'}`,
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      {
        sub: input.userId,
        sessionId: input.sessionId,
        tokenVersion: input.tokenVersion,
        type: 'refresh',
      } satisfies RefreshTokenPayload,
      {
        secret: this.authConfig.refreshSecret,
        expiresIn: this.authConfig
          .refreshExpiresIn as `${number}${'s' | 'm' | 'h' | 'd'}`,
      },
    );

    return { accessToken, refreshToken };
  }

  async verifyAccessToken(token: string): Promise<AccessTokenPayload> {
    return this.jwtService.verifyAsync<AccessTokenPayload>(token, {
      secret: this.authConfig.accessSecret,
    });
  }

  async verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
    return this.jwtService.verifyAsync<RefreshTokenPayload>(token, {
      secret: this.authConfig.refreshSecret,
    });
  }

  getRefreshTokenTtlSeconds(): number {
    return AUTH_REFRESH_TOKEN_TTL_SECONDS;
  }

  getAccessTokenMaxAgeMs(): number {
    return 15 * 60 * 1000;
  }

  getRefreshTokenMaxAgeMs(): number {
    return AUTH_REFRESH_TOKEN_TTL_SECONDS * 1000;
  }
}

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly redisService: RedisService,
    private readonly tokenService: TokenService,
  ) {}

  async storeRefreshToken(
    userId: string,
    sessionId: string,
    refreshToken: string,
  ): Promise<void> {
    const key = this.redisService.getAuthRefreshKey(userId, sessionId);
    await this.redisService.set(
      key,
      refreshToken,
      this.tokenService.getRefreshTokenTtlSeconds(),
    );
  }

  async validateStoredRefreshToken(
    userId: string,
    sessionId: string,
    refreshToken: string,
  ): Promise<boolean> {
    const key = this.redisService.getAuthRefreshKey(userId, sessionId);
    const storedToken = await this.redisService.get(key);
    return storedToken === refreshToken;
  }

  async revokeRefreshToken(userId: string, sessionId: string): Promise<void> {
    const key = this.redisService.getAuthRefreshKey(userId, sessionId);
    await this.redisService.del(key);
  }

  async revokeAllUserSessions(userId: string): Promise<number> {
    const pattern = this.redisService.buildKey('auth:refresh', userId, '*');
    return this.redisService.delByPattern(pattern);
  }
}
