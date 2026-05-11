/**
 * User Entity — Domain Layer
 */
import type { UserRole } from '../value-objects/role.vo';

export interface UserEntity {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  purchaseCount: number;
  totalSpent: number;
  createdAt: Date;
  updatedAt?: Date;
}

export type CreateUserData = Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt'>;
