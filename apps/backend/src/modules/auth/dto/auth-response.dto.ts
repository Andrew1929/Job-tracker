import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { PublicUser } from '../../users/types/user.types';

@Exclude()
export class UserResponseDto {
  @Expose()
  id!: string;

  @Expose()
  email!: string;

  @Expose()
  name!: string | null;

  @Expose()
  role!: string;

  @Expose()
  emailVerified!: boolean;

  @Expose()
  emailVerifiedAt!: Date | null;

  @Expose()
  isActive!: boolean;

  @Expose()
  lastLoginAt!: Date | null;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;

  static fromEntity(user: PublicUser): UserResponseDto {
    return plainToInstance(UserResponseDto, {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      emailVerified: user.emailVerified,
      emailVerifiedAt: user.emailVerifiedAt,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }
}

@Exclude()
export class AuthResponseDto {
  @Expose()
  user!: UserResponseDto;

  @Expose()
  accessToken!: string;

  @Expose()
  refreshToken!: string;

  static fromResult(result: {
    user: PublicUser;
    accessToken: string;
    refreshToken: string;
  }): AuthResponseDto {
    return plainToInstance(AuthResponseDto, {
      user: UserResponseDto.fromEntity(result.user),
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  }
}

@Exclude()
export class AccessTokenResponseDto {
  @Expose()
  accessToken!: string;

  @Expose()
  refreshToken!: string;

  static fromTokens(tokens: {
    accessToken: string;
    refreshToken: string;
  }): AccessTokenResponseDto {
    return plainToInstance(AccessTokenResponseDto, tokens);
  }
}

@Exclude()
export class MessageResponseDto {
  @Expose()
  message!: string;

  static create(message: string): MessageResponseDto {
    return plainToInstance(MessageResponseDto, { message });
  }
}
