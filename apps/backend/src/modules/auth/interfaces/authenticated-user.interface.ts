import { UserRole } from '../../../../generated/prisma/client';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  emailVerified: boolean;
}
