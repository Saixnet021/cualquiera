/**
 * AuthProvider — Presentation Layer
 * 
 * Provider global que maneja:
 * - Suscripción a onAuthStateChanged (UNA sola vez, en el layout raíz)
 * - Carga del perfil del usuario desde Firestore (con el rol)
 * - Creación automática del documento de usuario al registrarse
 * 
 * Antes: cada página creaba su propio listener de Firebase Auth.
 * Ahora: centralizado aquí, toda la app usa el mismo estado.
 */
'use client';

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/src/infrastructure/firebase/firebase.config';
import { useAuthStore } from './auth.store';
import { FirebaseUserRepository } from '@/src/infrastructure/firebase/user.repository';
import { UserRole } from '@/src/domain/value-objects/role.vo';

const userRepository = new FirebaseUserRepository();

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setRole, setLoading } = useAuthStore();

  useEffect(() => {
    setLoading(true);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        // Cargar perfil desde Firestore para obtener el rol real
        try {
          let userProfile = await userRepository.getById(firebaseUser.uid);

          // Si es la primera vez que entra, crear el doc de usuario
          if (!userProfile) {
            userProfile = await userRepository.create({
              uid: firebaseUser.uid,
              email: firebaseUser.email ?? '',
              displayName: firebaseUser.displayName ?? '',
              role: UserRole.CUSTOMER, // Por defecto: cliente
              purchaseCount: 0,
              totalSpent: 0,
            });
          }

          setRole(userProfile.role);
        } catch (err) {
          console.error('[AuthProvider] Error loading user profile:', err);
          setRole(UserRole.CUSTOMER); // Fallback seguro
        }
      } else {
        setUser(null);
        setRole(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setRole, setLoading]);

  return <>{children}</>;
}
