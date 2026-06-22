import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  comparePassword,
  hashPassword,
} from '../../../common/utils/password.util';
import { AUTH_CONFIG_KEY, AuthConfig } from '../../../config/auth.config';
import { PublicUser } from '../../users/types/user.types';
import { UsersService } from '../../users/users.service';
import { AuthResponse } from '../types/auth.types';
import { RefreshTokenService, TokenService } from './token.service';

@Injectable()
export class AuthService {
  private readonly authConfig: AuthConfig;

  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly configService: ConfigService,
  ) {
    this.authConfig = this.configService.get<AuthConfig>(AUTH_CONFIG_KEY)!;
  }

  async register(input: {
    email: string;
    password: string;
    name?: string;
  }): Promise<AuthResponse> {
    const passwordHash = await hashPassword(
      input.password,
      this.authConfig.bcryptRounds,
    );

    const user = await this.usersService.create({
      email: input.email,
      passwordHash,
      name: input.name,
    });

    return this.issueTokensForUser(user);
  }

  async login(input: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(input.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new ForbiddenException('Account is deactivated');
    }

    const isPasswordValid = await comparePassword(
      input.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    await this.usersService.updateLastLoginAt(user.id);

    const publicUser = await this.usersService.findById(user.id);
    return this.issueTokensForUser(publicUser, user.refreshTokenVersion);
  }

  async refresh(refreshToken: string): Promise<AuthResponse> {
    const payload = await this.verifyRefreshTokenPayload(refreshToken);

    const user = await this.usersService.findAuthUserById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (!user.isActive) {
      throw new ForbiddenException('Account is deactivated');
    }

    if (user.refreshTokenVersion !== payload.tokenVersion) {
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    const isStored = await this.refreshTokenService.validateStoredRefreshToken(
      payload.sub,
      payload.sessionId,
      refreshToken,
    );

    if (!isStored) {
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }

    await this.refreshTokenService.revokeRefreshToken(
      payload.sub,
      payload.sessionId,
    );

    const publicUser = await this.usersService.findById(user.id);
    return this.issueTokensForUser(
      publicUser,
      user.refreshTokenVersion,
      payload.sessionId,
    );
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      const payload = await this.verifyRefreshTokenPayload(refreshToken);
      await this.refreshTokenService.revokeRefreshToken(
        payload.sub,
        payload.sessionId,
      );
    } catch {
      // Idempotent logout: invalid tokens are treated as already logged out.
    }
  }

  async getCurrentUser(userId: string): Promise<PublicUser> {
    return this.usersService.findById(userId);
  }

  private async issueTokensForUser(
    user: PublicUser,
    tokenVersion = 0,
    sessionId = this.tokenService.generateSessionId(),
  ): Promise<AuthResponse> {
    const tokens = await this.tokenService.generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
      sessionId,
      tokenVersion,
    });

    await this.refreshTokenService.storeRefreshToken(
      user.id,
      sessionId,
      tokens.refreshToken,
    );

    return {
      user,
      ...tokens,
    };
  }

  private async verifyRefreshTokenPayload(refreshToken: string) {
    const payload = await this.tokenService.verifyRefreshToken(refreshToken);

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return payload;
  }
}
