/**
 * UpdateUserRoleUseCase — Application Layer
 *
 * Promueve o degrada un usuario. Valida:
 * 1. Que el ejecutor sea admin (leyendo Firestore)
 * 2. Que el target no sea el super-admin protegido (env)
 * 3. Que el admin no cambie su propio rol
 */
import { db } from '@/src/infrastructure/firebase/firebase.config';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { AppError } from '@/src/shared/errors/app-error';
import { UserRole } from '@/src/domain/value-objects/role.vo';

export class UpdateUserRoleUseCase {
  async execute(
    executorUid: string,
    targetUid: string,
    newRole: UserRole
  ): Promise<void> {
    // 1. Verificar que el ejecutor es admin
    const executorSnap = await getDoc(doc(db, 'users', executorUid));
    if (!executorSnap.exists() || executorSnap.data().role !== 'admin') {
      throw new AppError('No tienes permisos para cambiar roles', 'FORBIDDEN', 403);
    }

    // 2. No puede cambiar su propio rol
    if (executorUid === targetUid) {
      throw new AppError('No puedes cambiar tu propio rol', 'FORBIDDEN', 403);
    }

    // 3. Leer datos del target
    const targetSnap = await getDoc(doc(db, 'users', targetUid));
    if (!targetSnap.exists()) {
      throw new AppError('Usuario no encontrado', 'NOT_FOUND', 404);
    }

    // 4. Protección super-admin: no se puede degradar
    const superAdminEmail = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL;
    if (superAdminEmail && targetSnap.data().email === superAdminEmail) {
      throw new AppError(
        'Este usuario es super-admin y no puede ser degradado',
        'FORBIDDEN',
        403
      );
    }

    // 5. Actualizar rol
    await updateDoc(doc(db, 'users', targetUid), {
      role: newRole,
      updatedAt: serverTimestamp(),
    });
  }
}
