import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ACCESS_TOKEN_COOKIE } from '../../../common/constants/auth.constants';
import { AUTH_CONFIG_KEY, AuthConfig } from '../../../config/auth.config';
import { UsersService } from '../../users/users.service';
import { AuthenticatedUser } from '../interfaces/authenticated-user.interface';
import { AccessTokenPayload } from '../types/auth.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    const authConfig = configService.get<AuthConfig>(AUTH_CONFIG_KEY)!;

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (request: Request) => request?.cookies?.[ACCESS_TOKEN_COOKIE] ?? null,
      ]),
      ignoreExpiration: false,
      secretOrKey: authConfig.accessSecret,
    });
  }

  async validate(payload: AccessTokenPayload): Promise<AuthenticatedUser> {
    if (payload.type !== 'access') {
      throw new UnauthorizedException('Invalid access token');
    }

    const user = await this.usersService.findAuthUserById(payload.sub);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User is not authorized');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      emailVerified: user.emailVerified,
    };
  }
}
