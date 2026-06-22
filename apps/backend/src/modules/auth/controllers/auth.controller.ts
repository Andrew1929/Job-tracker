import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  SerializeOptions,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Public } from '../../../common/decorators/public.decorator';
import {
  clearAuthCookies,
  setAuthCookies,
} from '../../../common/utils/cookie.util';
import { REFRESH_TOKEN_COOKIE } from '../../../common/constants/auth.constants';
import { AUTH_CONFIG_KEY, AuthConfig } from '../../../config/auth.config';
import {
  AccessTokenResponseDto,
  AuthResponseDto,
  MessageResponseDto,
  UserResponseDto,
} from '../dto/auth-response.dto';
import { LoginDto } from '../dto/login.dto';
import { LogoutDto, RefreshTokenDto } from '../dto/refresh-token.dto';
import { RegisterDto } from '../dto/register.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import type { AuthenticatedUser } from '../interfaces/authenticated-user.interface';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

@Controller('auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthController {
  private readonly authConfig: AuthConfig;

  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    configService: ConfigService,
  ) {
    this.authConfig = configService.get<AuthConfig>(AUTH_CONFIG_KEY)!;
  }

  @Public()
  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponseDto> {
    const result = await this.authService.register(registerDto);
    this.applyAuthCookies(response, result.accessToken, result.refreshToken);
    return AuthResponseDto.fromResult(result);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponseDto> {
    const result = await this.authService.login(loginDto);
    this.applyAuthCookies(response, result.accessToken, result.refreshToken);
    return AuthResponseDto.fromResult(result);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AccessTokenResponseDto> {
    const refreshToken =
      refreshTokenDto.refreshToken ??
      (request.cookies?.[REFRESH_TOKEN_COOKIE] as string | undefined);

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    const result = await this.authService.refresh(refreshToken);
    this.applyAuthCookies(response, result.accessToken, result.refreshToken);

    return AccessTokenResponseDto.fromTokens({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Body() logoutDto: LogoutDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<MessageResponseDto> {
    const refreshToken =
      logoutDto.refreshToken ??
      (request.cookies?.[REFRESH_TOKEN_COOKIE] as string | undefined);

    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }

    clearAuthCookies(response);
    return MessageResponseDto.create('Logged out successfully');
  }

  @Get('me')
  async getCurrentUser(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<UserResponseDto> {
    const currentUser = await this.authService.getCurrentUser(user.id);
    return UserResponseDto.fromEntity(currentUser);
  }

  private applyAuthCookies(
    response: Response,
    accessToken: string,
    refreshToken: string,
  ): void {
    if (!this.authConfig.useCookies) {
      return;
    }

    setAuthCookies(response, {
      accessToken,
      refreshToken,
      accessMaxAgeMs: this.tokenService.getAccessTokenMaxAgeMs(),
      refreshMaxAgeMs: this.tokenService.getRefreshTokenMaxAgeMs(),
      secure: process.env.NODE_ENV === 'production',
    });
  }
}
