
'use client';

import Link from 'next/link';
import { AuthButton } from '@/features/auth/components/auth-button';
import { Shield, Menu, X, ShoppingCart, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/src/presentation/providers/auth.store';
import { useCart } from '@/features/cart/store/cart.store';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/src/shared/ui/ThemeToggle';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const { role } = useAuth();
  const items = useCart((state) => state.items);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

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
      (isScrolled || isMenuOpen) ? 'bg-bg border-border' : 'bg-transparent'
    )}>
      <div className="flex items-center justify-between w-full h-16 px-6 md:px-12 lg:px-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity" onClick={() => setIsMenuOpen(false)}>
          <div className="w-9 h-9 flex items-center justify-center bg-fg text-bg rounded-none">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <span className="text-sm font-black text-fg tracking-tighter uppercase">
            ECOMMERCE
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
          {role === 'admin' && (
            <Link
              href="/admin"
              className="w-8 h-8 flex items-center justify-center border border-border text-fg hover:bg-fg hover:text-bg transition-all"
              aria-label="Panel Control"
            >
              <Shield className="w-4 h-4" />
            </Link>
          )}
          <button
            onClick={() => { (document.querySelector('[data-cart-fab]') as HTMLButtonElement)?.click(); }}
            className="relative w-8 h-8 flex items-center justify-center border border-border text-fg hover:bg-fg hover:text-bg transition-all"
            aria-label="Carrito"
          >
            <ShoppingCart className="w-4 h-4" />
            {items.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-fg text-bg text-[8px] font-black h-3.5 w-3.5 flex items-center justify-center border border-bg">
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
        <div 
          className="fixed inset-x-0 bottom-0 top-16 z-[100] md:hidden flex flex-col animate-in fade-in slide-in-from-top-4 duration-300"
          style={{ backgroundColor: 'var(--bg)' }}
        >
          <div className="flex flex-col p-6 space-y-2">
            <button 
              onClick={() => {
                setIsMenuOpen(false);
                router.push('/#productos');
              }}
              className="group flex items-center justify-between p-6 border border-border bg-muted/20 hover:bg-fg hover:text-bg transition-all w-full text-left"
            >
              <div className="flex flex-col text-left">
                <span className="text-2xl font-black uppercase tracking-tighter">Catálogo</span>
                <span className="text-[9px] font-bold text-muted-fg uppercase tracking-widest group-hover:text-bg/60 transition-colors">Ver todos los productos</span>
              </div>
              <ShoppingBag className="w-6 h-6 opacity-40 group-hover:opacity-100 transition-all" />
            </button>
          </div>

          <div className="mt-auto p-6 border-t border-border bg-muted/30">
            <div className="flex items-center gap-4 mb-6">
              <ThemeToggle className="!w-12 !h-12 [&>svg]:!w-5 [&>svg]:!h-5" />
              <AuthButton className="!w-12 !h-12 [&_button]:!w-12 [&_button]:!h-12 [&_svg]:!w-5 [&_svg]:!h-5" />
            </div>
            <div className="flex justify-between items-center">
              <p className="text-[8px] font-black text-muted-fg uppercase tracking-widest">
                © 2026 INDUSTRIAL E-COMMERCE
              </p>
              <div className="flex gap-4">
                 <div className="w-2 h-2 bg-fg animate-pulse rounded-full" />
                 <span className="text-[8px] font-black text-fg uppercase">System Active</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
