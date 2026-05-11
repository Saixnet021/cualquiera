/**
 * Auth Store — Presentation Layer (Zustand)
 * 
 * Ahora incluye `role` — ya no necesitamos validar por email.
 * El AuthProvider es el único responsable de setear el estado.
 */
import { create } from 'zustand';
import { User as FirebaseUser } from 'firebase/auth';
import type { UserRole } from '@/src/domain/value-objects/role.vo';

interface AuthStore {
  // Estado
  user: FirebaseUser | null;
  role: UserRole | null;
  loading: boolean;

  // Acciones (solo el AuthProvider debería llamarlas)
  setUser: (user: FirebaseUser | null) => void;
  setRole: (role: UserRole | null) => void;
  setLoading: (loading: boolean) => void;

  // Selectores computados
  isAuthenticated: () => boolean;
  isAdmin: () => boolean;
  isCustomer: () => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  role: null,
  loading: true,

  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),
  setLoading: (loading) => set({ loading }),

  isAuthenticated: () => get().user !== null,
  isAdmin: () => get().role === 'admin',
  isCustomer: () => get().role === 'customer',
}));

// Re-export para compatibilidad con el código existente
export const useAuth = useAuthStore;
