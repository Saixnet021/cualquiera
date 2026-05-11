/**
 * AdminGuard — Presentation Layer
 * 
 * HOC que protege rutas de admin basado en el rol real de Firestore.
 * Reemplaza: const ADMIN_EMAIL = 'admin@admin.com'; if (user.email !== ADMIN_EMAIL)
 * 
 * Uso:
 *   <AdminGuard>
 *     <AdminDashboard />
 *   </AdminGuard>
 */
'use client';

import { useAuthStore } from '../providers/auth.store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldX, LogOut, Loader2 } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/src/infrastructure/firebase/firebase.config';

interface AdminGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AdminGuard({ children, fallback }: AdminGuardProps) {
  const { user, role, loading, isAdmin } = useAuthStore();

  // Esperar a que se cargue el estado de auth
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          <p className="text-gray-400 text-sm">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // No autenticado
  if (!user) {
    return fallback ?? <LoginRequired />;
  }

  // Autenticado pero sin permisos de admin
  if (!isAdmin()) {
    return <AccessDenied userEmail={user.email ?? ''} />;
  }

  return <>{children}</>;
}

function LoginRequired() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10">
        <CardHeader>
          <CardTitle className="text-center text-white text-2xl">
            Iniciar Sesión
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-400">Debes iniciar sesión para acceder.</p>
          <Button
            className="w-full bg-blue-600 hover:bg-blue-500"
            onClick={() => window.location.href = '/auth'}
          >
            Ir a inicio de sesión
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function AccessDenied({ userEmail }: { userEmail: string }) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10">
        <CardHeader>
          <CardTitle className="text-center text-red-500 flex items-center justify-center gap-2">
            <ShieldX className="w-6 h-6" />
            Acceso Denegado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-300">
            No tienes permisos para acceder al panel de administración.
          </p>
          <p className="text-center text-sm text-gray-500">Usuario: {userEmail}</p>
          <Button
            onClick={() => signOut(auth)}
            className="w-full bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
