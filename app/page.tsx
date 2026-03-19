'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { ProductCard } from '@/features/products/components/product-card';
import { Cart } from '@/features/cart/components/cart';
import { useProducts } from '@/features/products/hooks/use-products';
import { Search, ShoppingCart, TrendingUp, Users, Award, Zap, Shield } from 'lucide-react';
import { PromoBanner } from '@/components/ui/promo-banner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Section, SectionHeader } from '@/components/ui/section';
import { FeatureCard } from '@/components/ui/feature-card';
import { AnimateIn } from '@/components/ui/animate-in';

export default function Home() {
  const { products, loading } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredProducts = normalizedSearch
    ? products.filter((product) =>
        product.name?.toLowerCase().includes(normalizedSearch)
      )
    : products;

  const scrollToProducts = () => {
    const element = document.getElementById('productos');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full min-h-screen bg-black">
      {/* Hero Section */}
      <Section className="py-20 md:py-32 relative overflow-hidden">
        {/* Dynamic Background from Ksyan */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/back.gif"
            alt="Hero Background"
            fill
            className="object-cover"
            unoptimized
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="max-w-5xl mx-auto px-4 w-full">
          <AnimateIn animation="slide-down" className="text-center mb-8 md:mb-12 relative z-10">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 text-white tracking-tight leading-[1.1]">
            Explora Nuestros <span className="text-blue-500">Productos</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto px-4 font-medium leading-relaxed">
            Los mejores productos digitales del mercado a un solo click de distancia
          </p>

          {/* New Polished Stats Section - Monochromatic Blue Theme */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-5xl mx-auto px-4 mt-12">
            {[
              { icon: Zap, value: products.length.toString(), label: "Productos Activos" },
              { icon: Users, value: "90+", label: "Clientes Felices" },
              { icon: TrendingUp, value: "150+", label: "Ventas Totales" },
              { icon: Award, value: "100%", label: "Garantía" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center justify-center p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-lg hover:shadow-cyan-500/20 hover:-translate-y-1 transition-all duration-300 group">
                <div className={`p-2 sm:p-3 rounded-full bg-blue-500/10 mb-2 sm:mb-3 group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]`} />
                </div>
                <span className="text-lg sm:text-2xl md:text-3xl font-black text-white mb-1">{stat.value}</span>
                <span className="text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wide text-center">{stat.label}</span>
              </div>
            ))}
          </div>
          </AnimateIn>
        </div>
      </Section>

      {/* Neon Divider Line */}
      <div className="relative z-30 h-px bg-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.8)] w-full" />



      {/* Catálogo con ajuste de espaciado top para el banner */}
      <Section id="productos" className="pt-20 bg-black min-h-screen relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 w-full relative z-10">
          <SectionHeader
            className="relative z-10"
            titleClassName="text-white"
            descriptionClassName="text-gray-400"
            title="Nuestros Productos"
            description="Elige entre nuestros mejores productos"
          />

          {/* Product Search */}
          <div className="mb-10">
            <div className="relative mx-auto max-w-3xl">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600/40 via-cyan-400/40 to-blue-600/40 blur-lg opacity-70" />
              <div className="relative rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl shadow-[0_0_30px_rgba(59,130,246,0.25)]">
                <div className="flex items-center gap-2.5 px-4 sm:px-5 py-1.5">
                  <div className="flex items-center justify-center w-7 h-7">
                    <Search className="w-4 h-4 text-blue-300" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Buscar por nombre de producto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-9 sm:h-10 text-sm sm:text-base bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-gray-400 px-0"
                  />
                </div>
              </div>
            </div>
          </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Cargando catálogo...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">
              {searchTerm ? 'No se encontraron productos con ese término' : 'No hay productos disponibles'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <AnimateIn key={product.id} animation="scale-in" delay={index * 0.05}>
                <ProductCard product={product} />
              </AnimateIn>
            ))}
          </div>
        )}
        </div>
      </Section>

      {/* Promo Banner Strip */}
      <div className="relative z-20 -my-12">
        <PromoBanner />
      </div>

      {/* CTA Footer Dark Mode - Blue Theme */}
      <Section className="mt-32 py-24 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/40 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 w-full">
          <AnimateIn animation="fade-in" className="text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight">
              ¿Listo para <span className="text-blue-500">Comprar</span> ?
            </h2>
            <p className="text-gray-300 mb-10 text-lg md:text-xl max-w-2xl mx-auto">
              Realiza tu compra ahora y recibe tu producto al instante.
            </p>
            <Button
              onClick={scrollToProducts}
              className="bg-blue-600 text-white hover:bg-blue-500 px-10 py-6 text-xl font-bold rounded-full shadow-[0_0_35px_rgba(37,99,235,0.6)] hover:shadow-[0_0_60px_rgba(37,99,235,1)] transition-all duration-300 transform hover:scale-110 border-2 border-blue-400"
            >
              Ver Catálogo
            </Button>
          </AnimateIn>
        </div>
      </Section>

      {/* Developer Footer */}
<footer className="w-full py-4 bg-black border-t-2 border-blue-500 text-center relative z-20 shadow-[0_-10px_50px_rgba(59,130,246,0.3)]">
  <div className="mt-2 text-gray-500 text-xs md:text-sm opacity-70">
    © 2026 PINGUIS SMS FOLLOWERS. Todos los derechos reservados.
  </div>
  <a
    href="https://wa.me/51917024847?text=Hola,%20vi%20tu%20web%20y%20me%20interesa%20crear%20mi%20p%C3%A1gina.%20Tambi%C3%A9n%20vis%C3%ADtenos%20en%20https://www.ksyan.dev/"
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-400 hover:text-blue-400 font-medium transition-colors text-sm md:text-base group"
  >
    Desarrollado por 
    <span className="text-blue-500 font-bold ml-1 group-hover:text-blue-300 transition-colors hover:underline decoration-blue-500/50 underline-offset-4">
      www.ksyan.dev
    </span> 
    <span className="ml-2 text-gray-500 text-xs md:text-sm">
      v1.0.0
    </span>
  </a>

  
</footer>

      <Cart />
    </div >
  );
}
