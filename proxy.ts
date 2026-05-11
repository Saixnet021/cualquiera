/**
 * proxy.ts — Protección de rutas (Next.js 16 naming convention)
 * 
 * Next.js 16 renombró "middleware" a "proxy".
 * Debe exportar una función `proxy` o `default`.
 */
import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas que requieren autenticación
  const PROTECTED_ROUTES = ['/admin'];

  const isProtectedRoute = PROTECTED_ROUTES.some(route =>
    pathname.startsWith(route)
  );

  // El AdminGuard client-side maneja la verificación de roles
  // El proxy solo agrega headers de seguridad y pasa la request
  if (isProtectedRoute) {
    // Aquí se puede agregar verificación de session cookie
    // cuando se implemente Firebase Admin + session cookies
  }

  // Headers de seguridad
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
