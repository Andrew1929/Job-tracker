import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateUserInput,
  PublicUser,
  USER_PUBLIC_SELECT,
} from './types/user.types';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateUserInput): Promise<PublicUser> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
      select: { id: true },
    });

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    return this.prisma.user.create({
      data: {
        email: input.email.toLowerCase(),
        passwordHash: input.passwordHash,
        name: input.name,
        role: input.role,
      },
      select: USER_PUBLIC_SELECT,
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  async findById(id: string): Promise<PublicUser> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: USER_PUBLIC_SELECT,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findAuthUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        passwordHash: true,
        refreshTokenVersion: true,
        emailVerified: true,
        isActive: true,
      },
    });
  }

  async updateLastLoginAt(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
    });
  }
}
