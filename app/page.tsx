'use client';

import { useState } from 'react';
import { ProductCard } from '@/features/products/components/product-card';
import { Cart } from '@/features/cart/components/cart';
import { useProducts } from '@/features/products/hooks/use-products';
import { ArrowRight, Star, Shield, Zap, Package, Headphones, CheckCircle2, ChevronRight, Check, Award, ArrowUpRight, Plus, ShoppingCart, Info, Search, CreditCard, Truck, X, ArrowDown } from 'lucide-react';
import { PromoBanner } from '@/components/ui/promo-banner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Section, SectionHeader } from '@/components/ui/section';
import { AnimateIn } from '@/components/ui/animate-in';
import { Carousel } from '@/components/ui/carousel';
import { ProductCardSkeleton, CarouselSkeleton } from '@/components/ui/skeleton';
import { ProductCarousel } from '@/components/ui/product-carousel';
import { TestimonialsCarousel } from '@/components/ui/testimonials-carousel';
import { formatPrice } from '@/lib/utils';

const testimonialsData = [
  { name: "Said F.", comment: "Excelente servicio, recibí mi producto al instante. La activación fue super rápida y funciona perfecto. 100% recomendado.", initials: "SF" },
  { name: "Ana L.", comment: "Precios increíbles y la atención por WhatsApp es rápida. Es muy confiable el sistema.", initials: "AL" },
  { name: "Diego P.", comment: "Ya llevo más de 5 compras y siempre cumplen. Soporte excelente, la mejor opción.", initials: "DP" },

];

export default function Home() {
  const SHOW_TEMP_404 = true;
  const { products, loading } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredProducts = normalizedSearch
    ? products.filter((p) => p.name?.toLowerCase().includes(normalizedSearch))
    : products;

  const featuredProducts = products.slice(0, 8); // more products for carousel

  const scrollToProducts = () => {
    document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (SHOW_TEMP_404) {
    return (
      <div className="min-h-screen w-full bg-[#0b0f14] text-white flex items-center justify-center px-6">
        <div className="max-w-2xl text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-[#6b7280] mb-4">Temporal</p>
          <h1 className="text-7xl sm:text-8xl font-extrabold mb-4">404</h1>
          <p className="text-lg sm:text-xl text-[#cbd5f5] mb-6">
            Esta página está temporalmente fuera de servicio.
          </p>
          <p className="text-sm text-[#9ca3af]">
            Vuelve a intentarlo más tarde.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[var(--background)]">

      {/* ===== HERO ===== */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#10141a]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#1d4ed8]/15 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-[90rem] mx-auto px-6 w-full relative z-10 pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-12 lg:gap-16 items-center">
            {/* Text */}
            <AnimateIn animation="slide-down">
              {/* <div className="inline-block px-3 py-1 mb-6 rounded-md border border-blue-500/20 bg-blue-500/10">
                <p className="text-blue-400 text-[10px] font-bold tracking-widest uppercase">Bienvenido</p>
              </div> */}
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-[1.05] mb-6 tracking-tight">
                Productos<br />
                <span className="text-[var(--primary)]">Digitales</span><br />

              </h1>
              <p className="text-[#9ca3af] text-base sm:text-lg mb-10 max-w-md leading-relaxed font-medium">
                Todo lo que necesitas en un solo lugar. Entrega inmediata, soporte especializado y garantía total respaldada por expertos.
              </p>


            </AnimateIn>

            {/* Carousel */}
            <AnimateIn animation="scale-in" className="hidden lg:block relative z-20">
              {loading ? (
                <CarouselSkeleton />
              ) : featuredProducts.length > 0 ? (
                <div className="shadow-2xl shadow-black/50 rounded-2xl">
                  <Carousel autoPlay interval={5000} showArrows showDots slideClassName="transition-opacity duration-500">
                    {featuredProducts.slice(0, 3).map((product) => (
                      <div key={product.id} className="relative h-[480px] rounded-2xl overflow-hidden bg-[#111]">
                        {product.imageUrl ? (
                          <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Package className="w-20 h-20 text-[#333]" />
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent p-8">
                          <h3 className="text-white font-bold text-2xl mb-1">{product.name}</h3>
                          <span className="text-white font-extrabold text-3xl">{formatPrice(product.price)}</span>
                        </div>
                      </div>
                    ))}
                  </Carousel>
                </div>
              ) : null}
            </AnimateIn>

            {/* Mobile carousel */}
            <AnimateIn animation="scale-in" className="lg:hidden">
              {loading ? <CarouselSkeleton /> : featuredProducts.length > 0 ? (
                <div className="shadow-xl rounded-xl">
                  <Carousel autoPlay interval={5000} showDots>
                    {featuredProducts.slice(0, 3).map((product) => (
                      <div key={product.id} className="relative h-72 rounded-xl overflow-hidden bg-[#111]">
                        {product.imageUrl ? (
                          <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Package className="w-16 h-16 text-[#333]" />
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 to-transparent p-5">
                          <h3 className="text-white font-bold text-xl mb-1">{product.name}</h3>
                          <span className="text-white font-extrabold text-2xl">{formatPrice(product.price)}</span>
                        </div>
                      </div>
                    ))}
                  </Carousel>
                </div>
              ) : null}
            </AnimateIn>
          </div>
        </div>

        {/* Scroll indicator */}
        <button onClick={scrollToProducts} className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[#444] hover:text-[var(--primary)] transition-colors" aria-label="Ir a productos">
          <ArrowDown className="w-6 h-6 animate-pulse-soft" />
        </button>
      </section>


      {/* ===== PROMO BANNER ===== */}
      <PromoBanner />

      {/* ===== FEATURED PRODUCTS CAROUSEL =====
      <Section className="py-20 md:py-24 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="mb-10 text-left">
            <h2 className="text-3xl font-extrabold text-white mb-3">Productos Destacados</h2>
            <p className="text-[#9ca3af]">Descubre los favoritos de nuestra comunidad.</p>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : featuredProducts.length > 0 ? (
            <AnimateIn animation="scale-in">
              <ProductCarousel products={featuredProducts} />
            </AnimateIn>
          ) : null}
        </div>
      </Section> */}

      {/* ===== CATÁLOGO GRID ===== */}
      <Section id="productos" className="py-20 md:py-24 bg-[var(--background)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 w-full">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h2 className="text-3xl font-extrabold text-white mb-2">Catálogo</h2>

            </div>

            <div className="relative flex items-center border-2 border-[var(--border)] rounded-full bg-[#111827] px-5 py-1.5 focus-within:border-[var(--primary)] focus-within:shadow-[0_0_0_4px_rgba(59,130,246,0.1)] transition-all">
              <Search className="w-5 h-5 text-[var(--primary)]" />
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none px-3 py-2 text-sm w-full md:w-64 text-white placeholder:text-[#64748b]"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="text-[#64748b] hover:text-[#9ca3af]">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
              {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-14 h-14 text-[#E5E5E5] mx-auto mb-5" />
              <h3 className="text-xl font-bold text-[#0A0A0A] mb-2">
                {searchTerm ? 'No hay resultados' : 'Catálogo vacío'}
              </h3>
              <p className="text-sm text-[#666] mb-6 max-w-sm mx-auto">
                {searchTerm ? `No encontramos elementos para "${searchTerm}".` : 'Los productos estarán disponibles pronto.'}
              </p>
              {searchTerm && (
                <Button onClick={() => setSearchTerm('')} variant="outline">Limpiar búsqueda</Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-y-10">
              {filteredProducts.map((product, i) => (
                <AnimateIn key={product.id} animation="scale-in" delay={i * 0.03}>
                  <ProductCard product={product} />
                </AnimateIn>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* ===== CÓMO FUNCIONA ===== */}
      <section className="py-20 md:py-28 bg-[var(--background)] border-y border-[var(--border)]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-extrabold text-white mb-3">¿Cómo Funciona?</h2>
            <p className="text-[#9ca3af]">Comienza en tres sencillos pasos.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6 relative mt-16">
            {/* Visual connector line desktop */}
            <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent z-0" />

            {[
              { num: "01", icon: Package, title: "Elige", desc: "Selecciona el producto que se adapte a ti" },
              { num: "02", icon: CreditCard, title: "Paga", desc: "Realiza tu compra segura vía WhatsApp" },
              { num: "03", icon: Truck, title: "Recibe", desc: "Obtén tu pedido en cuestión de minutos" },
            ].map((item, i) => (
              <AnimateIn key={i} animation="slide-up" delay={i * 0.15}>
                <div className="text-center relative z-10 flex flex-col items-center">
                  <span className="text-7xl font-extrabold text-[#1e293b] absolute -top-10 z-0 tracking-tighter opacity-50">{item.num}</span>
                  <div className="w-16 h-16 rounded-2xl border border-[var(--border)] flex items-center justify-center mx-auto mb-6 bg-[#111827] relative z-10 shadow-lg">
                    <item.icon className="w-7 h-7 text-[var(--primary)]" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-[#9ca3af] max-w-[220px] mx-auto leading-relaxed">{item.desc}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIOS CAROUSEL ===== */}
      <section className="py-20 md:py-28 bg-[#0b0f19]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-extrabold text-white">Clientes Satisfechos</h2>
            <p className="text-[#9ca3af] mt-3">Historias reales de nuestra comunidad.</p>
            <div className="w-12 h-1 bg-[var(--primary)] mx-auto mt-6 rounded-full" />
          </div>
          <AnimateIn animation="scale-in" delay={0.2} className="mt-8">
            <TestimonialsCarousel testimonials={testimonialsData} />
          </AnimateIn>
        </div>
      </section>



      {/* ===== FOOTER ===== */}
      <footer className="pt-20 pb-8 bg-[#0b0f19] border-t border-[#1e293b]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 relative rounded-full overflow-hidden border border-[#1e293b] opacity-90">
                  <Image src="/pedro.jpeg" alt="Logo" fill className="object-cover" />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">
                  PINGUIS SMS
                </span>
              </div>
              <p className="text-[#9ca3af] text-sm max-w-sm leading-relaxed">
                Plataforma líder en distribución de productos digitales seguros con entrega inmediata. Calidad asegurada 24/7.
              </p>
              <div className="flex gap-4 pt-4">
                <div className="w-10 h-6 bg-[#111827] border border-[#1e293b] rounded-sm flex items-center justify-center text-[10px] font-bold text-[#64748b]">VISA</div>
                <div className="w-10 h-6 bg-[#111827] border border-[#1e293b] rounded-sm flex items-center justify-center text-[10px] font-bold text-[#64748b]">MC</div>
                <div className="w-10 h-6 bg-[#111827] border border-[#1e293b] rounded-sm flex items-center justify-center text-[10px] font-bold text-[#64748b]">YAPE</div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Enlaces Rápidos</h4>
              <ul className="space-y-4 text-sm text-[#9ca3af]">
                <li><button onClick={scrollToProducts} className="hover:text-white transition-colors">Catálogo</button></li>
                <li><a href="#" className="hover:text-white transition-colors">Cómo Funciona</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Testimonios</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Contacto</h4>
              <ul className="space-y-4 text-sm text-[#9ca3af]">
                <li className="flex items-center gap-2"><Headphones className="w-4 h-4" /> Soporte WhatsApp</li>
                <li className="flex items-center gap-2"><Shield className="w-4 h-4" /> Centro de Legal</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[#1e293b] flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#64748b]">
            <p>© 2026 Pinguis SMS Followers. All rights reserved.</p>
            <a
              href="https://ksyan.dev"
              target="_blank" rel="noopener noreferrer"
              className="hover:text-white transition-colors font-medium"
            >
              Desarrollado por <span className="text-white font-bold">ww.ksyan.dev</span>
            </a>
          </div>
        </div>
      </footer>

      <Cart />
    </div>
  );
}
