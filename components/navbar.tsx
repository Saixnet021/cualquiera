
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { AuthButton } from '@/features/auth/components/auth-button';
import { Shield, Menu, X, ShoppingCart, Search } from 'lucide-react';
import { useAuth } from '@/features/auth/store/auth.store';
import { useCart } from '@/features/cart/store/cart.store';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { user } = useAuth();
  const items = useCart((state) => state.items);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  return (
    <nav role="navigation" className={cn(
      'fixed inset-x-0 top-0 z-50 bg-slate-950/60 backdrop-blur-xl transition-all duration-200',
      isScrolled ? 'shadow-lg border-b border-[var(--border)]' : ''
    )}>
      <div className="flex items-center justify-between w-full h-16 px-6 md:px-12 lg:px-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-70 transition-opacity">
          <div className="w-8 h-8 relative rounded-full overflow-hidden border border-[var(--border)]">
            <Image src="/pedro.jpeg" alt="Logo" fill className="object-cover" />
          </div>
          <span className="text-sm font-bold text-white tracking-tight">
            PINGUIS SMS
          </span>
        </Link>

        {/* Right - Desktop Links & Accessories */}
        <div className="hidden md:flex items-center gap-6 ml-auto">
          {/* Links */}
          <div className="flex items-center gap-6 font-[family-name:var(--font-manrope)] font-bold tracking-tight">
            <Link href="/#productos" className="text-blue-500 border-b-2 border-blue-500 pb-1 text-sm transition-colors">
              Catálogo
            </Link>
            {user?.email === 'admin@admin.com' && (
              <Link href="/admin" className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
                <Shield className="w-4 h-4" />Admin
              </Link>
            )}
          </div>

          <div className="h-4 w-px bg-[#434656] mx-1" /> {/* Divider */}

          {/* Accessories */}
          <div className="flex gap-4 items-center">
            <button
              onClick={() => { (document.querySelector('[data-cart-fab]') as HTMLButtonElement)?.click(); }}
              className="relative p-2 rounded-full text-[#dfe2eb] hover:bg-slate-800/50 transition-all duration-300"
              aria-label={`Carrito, ${items.length} items`}
            >
              <ShoppingCart className="w-5 h-5" />
              {items.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#1d4ed8] text-white text-[9px] font-extrabold rounded-full h-4 w-4 flex items-center justify-center shadow-sm">
                  {items.length}
                </span>
              )}
            </button>
            <AuthButton />
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => { (document.querySelector('[data-cart-fab]') as HTMLButtonElement)?.click(); }}
            className="relative p-2 rounded-lg text-white hover:text-[var(--primary)] hover:bg-[#1e293b] transition-all"
            aria-label="Carrito"
          >
            <ShoppingCart className="w-5 h-5" />
            {items.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[var(--primary)] text-white text-[10px] font-extrabold rounded-full h-4 w-4 flex items-center justify-center shadow-lg shadow-blue-500/50">
                {items.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-white hover:bg-[#1e293b] rounded-lg transition-colors"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 bg-[var(--background)] z-40 md:hidden">
          <div className="flex flex-col pt-8 px-6 gap-2">
            <Link href="/#productos" onClick={() => setIsMenuOpen(false)}
              className="py-4 text-xl font-extrabold text-white border-b border-[var(--border)] hover:text-[var(--primary)]">
              Catálogo
            </Link>
            {user?.email === 'admin@admin.com' && (
              <Link href="/admin" onClick={() => setIsMenuOpen(false)}
                className="py-4 text-xl font-extrabold text-white border-b border-[var(--border)] flex items-center gap-2 hover:text-[var(--primary)]">
                <Shield className="w-5 h-5" /> Administrador
              </Link>
            )}
            <div className="pt-4">
              <AuthButton className="w-full" />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
