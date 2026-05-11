/**
 * IUserRepository — Domain Layer (Interface/Contract)
 */
import type { UserEntity, CreateUserData } from '../entities/user.entity';
import type { UserRole } from '../value-objects/role.vo';

export interface IUserRepository {
  getAll(): Promise<UserEntity[]>;
  getById(uid: string): Promise<UserEntity | null>;
  getByEmail(email: string): Promise<UserEntity | null>;
  create(data: CreateUserData): Promise<UserEntity>;
  updateRole(uid: string, role: UserRole): Promise<void>;
  update(uid: string, data: Partial<UserEntity>): Promise<void>;
}
