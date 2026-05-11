
'use client';

import Link from 'next/link';
import { AuthButton } from '@/features/auth/components/auth-button';
import { Shield, Menu, X, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/src/presentation/providers/auth.store';
import { useCart } from '@/features/cart/store/cart.store';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/src/shared/ui/ThemeToggle';

export function Navbar() {
  const { role } = useAuth();
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
      'fixed inset-x-0 top-0 z-50 transition-all duration-200 border-b border-transparent',
      isScrolled ? 'bg-bg/80 backdrop-blur-xl border-border' : 'bg-transparent'
    )}>
      <div className="flex items-center justify-between w-full h-16 px-6 md:px-12 lg:px-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 flex items-center justify-center bg-fg text-bg rounded-none font-black text-lg">
            E
          </div>
          <span className="text-sm font-black text-fg tracking-tighter uppercase">
            E-COMMERCE
          </span>
        </Link>

        {/* Right - Desktop Links & Accessories */}
        <div className="hidden md:flex items-center gap-4 ml-auto">
          {/* Links */}
          <div className="flex items-center gap-6 font-black uppercase tracking-tighter">
            <Link href="/#productos" className="text-fg border-b border-fg pb-0.5 text-xs transition-colors">
              Catálogo
            </Link>
            {role === 'admin' && (
              <Link href="/admin" className="text-[10px] font-black uppercase text-muted-fg hover:text-fg transition-colors">
                Panel Control
              </Link>
            )}
          </div>

          <div className="h-4 w-px bg-border mx-1" />

          {/* Accessories */}
          <div className="flex gap-2 items-center">
            <ThemeToggle />
            <button
              onClick={() => { (document.querySelector('[data-cart-fab]') as HTMLButtonElement)?.click(); }}
              className="relative w-9 h-9 flex items-center justify-center border border-border text-fg hover:bg-fg hover:text-bg transition-all"
              aria-label={`Carrito, ${items.length} items`}
            >
              <ShoppingCart className="w-4 h-4" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-fg text-bg text-[8px] font-black h-3.5 w-3.5 flex items-center justify-center border border-bg">
                  {items.length}
                </span>
              )}
            </button>
            <AuthButton />
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle className="w-8 h-8" />
          <button
            onClick={() => { (document.querySelector('[data-cart-fab]') as HTMLButtonElement)?.click(); }}
            className="relative w-8 h-8 flex items-center justify-center border border-border text-fg"
            aria-label="Carrito"
          >
            <ShoppingCart className="w-4 h-4" />
            {items.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-fg text-bg text-[8px] font-black h-3.5 w-3.5 flex items-center justify-center">
                {items.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-8 h-8 flex items-center justify-center text-fg"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 bg-bg z-40 md:hidden p-6 border-t border-border">
          <div className="flex flex-col gap-4">
            <Link href="/#productos" onClick={() => setIsMenuOpen(false)}
              className="py-4 text-xl font-black text-fg border-b border-border uppercase tracking-tighter">
              Catálogo
            </Link>
            {role === 'admin' && (
              <Link href="/admin" onClick={() => setIsMenuOpen(false)}
                className="py-4 text-xl font-black text-fg border-b border-border uppercase tracking-tighter">
                Administrador
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
