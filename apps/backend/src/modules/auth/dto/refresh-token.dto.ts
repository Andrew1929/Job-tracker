import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsString()
  @IsOptional()
  refreshToken?: string;
}

export class LogoutDto {
  @IsString()
  @IsOptional()
  refreshToken?: string;
}

export class SessionDto {
  @IsString()
  @IsNotEmpty()
  sessionId!: string;
}
