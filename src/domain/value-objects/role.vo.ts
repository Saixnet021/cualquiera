/**
 * UserRole Value Object — Domain Layer
 * 
 * Sistema de roles real basado en Firestore.
 * Reemplaza completamente la validación por email hardcodeado.
 */
export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'Administrador',
  [UserRole.CUSTOMER]: 'Cliente',
};

export function isValidRole(role: string): role is UserRole {
  return Object.values(UserRole).includes(role as UserRole);
}

export function isAdmin(role: UserRole): boolean {
  return role === UserRole.ADMIN;
}
