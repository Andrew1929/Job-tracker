import { User, UserRole } from '../../../../generated/prisma/client';

export const USER_PUBLIC_SELECT = {
  id: true,
  email: true,
  name: true,
  role: true,
  emailVerified: true,
  emailVerifiedAt: true,
  isActive: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

export type PublicUser = Pick<
  User,
  | 'id'
  | 'email'
  | 'name'
  | 'role'
  | 'emailVerified'
  | 'emailVerifiedAt'
  | 'isActive'
  | 'lastLoginAt'
  | 'createdAt'
  | 'updatedAt'
>;

export interface CreateUserInput {
  email: string;
  passwordHash: string;
  name?: string;
  role?: UserRole;
}
