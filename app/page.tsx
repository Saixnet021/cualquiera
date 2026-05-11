
'use client';

import { useState, useMemo } from 'react';
import { ProductCard } from '@/features/products/components/product-card';
import { Cart } from '@/features/cart/components/cart';
import { useProducts } from '@/features/products/hooks/use-products';
import { useCategories } from '@/features/catalog/hooks/use-categories';
import { ArrowRight, Star, Shield, Zap, Package, Headphones, CheckCircle2, ChevronRight, Check, Award, ArrowUpRight, Plus, ShoppingCart, Info, Search, CreditCard, Truck, X, ArrowDown, LayoutGrid, Filter } from 'lucide-react';
import { PromoBanner } from '@/components/ui/promo-banner';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Section } from '@/components/ui/section';
import { AnimateIn } from '@/components/ui/animate-in';
import { Carousel } from '@/components/ui/carousel';
import { ProductCardSkeleton, CarouselSkeleton } from '@/components/ui/skeleton';
import { TestimonialsCarousel } from '@/components/ui/testimonials-carousel';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

const testimonialsData = [
  { name: "Said F.", comment: "Excelente servicio, recibí mi producto al instante. La activación fue super rápida y funciona perfecto. 100% recomendado.", initials: "SF" },
  { name: "Ana L.", comment: "Precios increíbles y la atención por WhatsApp es rápida. Es muy confiable el sistema.", initials: "AL" },
  { name: "Diego P.", comment: "Ya llevo más de 5 compras y siempre cumplen. Soporte excelente, la mejor opción.", initials: "DP" },
];

export default function Home() {
  const { products, loading } = useProducts();
  const { categories, loading: loadingCats } = useCategories();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const featuredProducts = products.slice(0, 3);
  const newArrivals = products.slice(0, 4);

  const scrollToProducts = () => {
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full min-h-screen bg-bg">

      {/* ===== HERO ===== */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-bg">
        <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>

        <div className="max-w-[90rem] mx-auto px-6 w-full relative z-10 pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-12 lg:gap-16 items-center">
            {/* Text */}
            <AnimateIn animation="slide-down">
              <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-fg leading-[0.95] mb-6 tracking-tighter uppercase">
                Tienda<br />
                Industrial<br />
                Premium
              </h1>
              <p className="text-muted-fg text-base sm:text-lg mb-10 max-w-md leading-tight font-medium uppercase tracking-tight">
                La nueva era del e-commerce. Diseño técnico, velocidad extrema y una experiencia de compra minimalista.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button onClick={scrollToProducts} className="bg-fg text-bg hover:opacity-80 h-14 px-10 font-black uppercase text-sm rounded-none tracking-widest shadow-xl">
                  Explorar Catálogo <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </AnimateIn>

            {/* Carousel */}
            <AnimateIn animation="scale-in" className="hidden lg:block relative z-20">
              {loading ? (
                <CarouselSkeleton />
              ) : featuredProducts.length > 0 ? (
                <div className="border border-border bg-bg p-2 shadow-2xl">
                  <Carousel autoPlay interval={5000} showArrows showDots slideClassName="transition-opacity duration-500">
                    {featuredProducts.map((product) => (
                      <div key={product.id} className="relative h-[520px] overflow-hidden bg-muted">
                        {product.imageUrl ? (
                          <Image src={product.imageUrl} alt={product.name} fill className="object-cover transition-all duration-700" />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Package className="w-20 h-20 text-border" />
                          </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg via-bg/80 to-transparent p-10">
                          <div className="text-[10px] font-black uppercase tracking-widest text-muted-fg mb-2">{product.category}</div>
                          <h3 className="text-fg font-black text-3xl mb-1 uppercase tracking-tighter">{product.name}</h3>
                          <span className="text-fg font-black text-4xl tracking-tighter">{formatPrice(product.price)}</span>
                        </div>
                      </div>
                    ))}
                  </Carousel>
                </div>
              ) : null}
            </AnimateIn>
          </div>
        </div>

        <button onClick={scrollToProducts} className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted-fg hover:text-fg transition-colors group" aria-label="Ir a productos">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] block mb-2 opacity-0 group-hover:opacity-100 transition-opacity">Deslizar</span>
          <ArrowDown className="w-6 h-6 animate-bounce mx-auto" />
        </button>
      </section>

      <PromoBanner />

      {/* ===== NUEVAS ENTRADAS ===== */}
      <Section className="py-20 bg-bg">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-muted-fg mb-2">Recién Llegado</div>
              <h2 className="text-4xl font-black text-fg uppercase tracking-tighter">Nuevas Entradas</h2>
            </div>
            <div className="hidden md:block h-px flex-1 bg-border mx-10 mb-3"></div>
            <Button variant="outline" onClick={scrollToProducts} className="text-[10px] tracking-widest">Ver Todo</Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              [...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)
            ) : newArrivals.map((product, i) => (
              <AnimateIn key={product.id} animation="scale-in" delay={i * 0.1}>
                <ProductCard product={product} />
              </AnimateIn>
            ))}
          </div>
        </div>
      </Section>

      {/* ===== CATÁLOGO SECTION ===== */}
      <Section id="catalog" className="py-24 bg-bg border-y border-border relative">
        <div className="max-w-7xl mx-auto px-4 w-full">
          
          {/* Filtering Header */}
          <div className="flex flex-col gap-10 mb-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <h2 className="text-5xl font-black text-fg uppercase tracking-tighter">Catálogo Completo</h2>
              
              <div className="relative flex items-center border border-border bg-input-bg px-6 h-14 w-full md:w-[400px] focus-within:border-fg transition-all">
                <Search className="w-5 h-5 text-muted-fg" />
                <input
                  type="text"
                  placeholder="BUSCAR PRODUCTO..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none outline-none px-4 text-[10px] font-black uppercase tracking-widest w-full text-fg placeholder:text-muted-fg"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="text-muted-fg hover:text-fg p-2">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-3 border-t border-border pt-8">
              <div className="flex items-center gap-2 mr-4 text-muted-fg">
                <Filter className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Categoría:</span>
              </div>
              <button
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "px-5 h-9 text-[10px] font-black uppercase tracking-widest border transition-all",
                  !selectedCategory ? "bg-fg text-bg border-fg" : "bg-bg text-fg border-border hover:border-fg"
                )}
              >
                Todas
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={cn(
                    "px-5 h-9 text-[10px] font-black uppercase tracking-widest border transition-all",
                    selectedCategory === cat.name ? "bg-fg text-bg border-fg" : "bg-bg text-fg border-border hover:border-fg"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
              {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-32 border border-dashed border-border bg-muted/30">
              <Package className="w-16 h-16 text-muted-fg/20 mx-auto mb-6" />
              <h3 className="text-2xl font-black text-fg mb-3 uppercase tracking-tighter">Sin Resultados</h3>
              <p className="text-[10px] text-muted-fg mb-8 max-w-xs mx-auto uppercase font-bold tracking-widest">
                No encontramos productos en {selectedCategory || 'esta selección'} que coincidan con tu búsqueda.
              </p>
              <Button variant="outline" onClick={() => { setSearchTerm(''); setSelectedCategory(null); }}>Limpiar Filtros</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-y-10">
              {filteredProducts.map((product, i) => (
                <AnimateIn key={product.id} animation="scale-in" delay={i * 0.02}>
                  <ProductCard product={product} />
                </AnimateIn>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* ===== INFO SECTION ===== */}
      <section className="py-24 bg-bg overflow-hidden">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <AnimateIn animation="slide-right">
              <div className="relative h-[500px] border border-border p-3">
                <Image src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800" alt="Nosotros" fill className="object-cover" />
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-fg text-bg flex items-center justify-center font-black text-4xl p-10">24/7</div>
              </div>
            </AnimateIn>
            <AnimateIn animation="slide-left">
              <div className="text-[10px] font-black uppercase tracking-widest text-muted-fg mb-4">Nuestro Compromiso</div>
              <h2 className="text-5xl font-black text-fg uppercase tracking-tighter mb-8 leading-[0.9]">Calidad sin Concesiones</h2>
              <p className="text-muted-fg text-sm uppercase font-bold leading-relaxed mb-8">
                Cada pieza de nuestro catálogo es seleccionada bajo estrictos estándares industriales. No vendemos solo productos, vendemos una visión de diseño y funcionalidad.
              </p>
              <ul className="space-y-4">
                {[
                  "Certificación de Calidad Premium",
                  "Soporte Técnico Especializado",
                  "Logística Industrial Optimizada",
                  "Garantía Global de Satisfacción"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-fg">
                    <div className="w-1.5 h-1.5 bg-fg"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ===== CÓMO FUNCIONA ===== */}
      <section className="py-24 md:py-32 bg-muted/30 border-t border-border">
        <div className="max-w-5xl mx-auto px-4">
          <div className="mb-20 text-center">
            <h2 className="text-4xl font-black text-fg uppercase tracking-tighter">Flujo de Compra</h2>
            <div className="w-12 h-1 bg-fg mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-10 relative">
            {[
              { num: "01", icon: LayoutGrid, title: "Curaduría", desc: "Navega por nuestro catálogo curado industrialmente." },
              { num: "02", icon: Shield, title: "Protocolo", desc: "Tus transacciones están protegidas por encriptación avanzada." },
              { num: "03", icon: Zap, title: "Despliegue", desc: "Recibe tu pedido mediante nuestra red logística de alta velocidad." },
            ].map((item, i) => (
              <AnimateIn key={i} animation="slide-up" delay={i * 0.15}>
                <div className="text-center relative z-10 flex flex-col items-center group">
                  <span className="text-9xl font-black text-fg/5 absolute -top-16 z-0 tracking-tighter select-none">{item.num}</span>
                  <div className="w-20 h-20 border border-border flex items-center justify-center mx-auto mb-8 bg-bg relative z-10 transition-all group-hover:scale-110 group-hover:border-fg text-fg">
                    <item.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-sm font-black text-fg mb-3 uppercase tracking-widest">{item.title}</h3>
                  <p className="text-[11px] text-muted-fg max-w-[220px] mx-auto leading-relaxed uppercase font-bold">{item.desc}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIOS ===== */}
      <section className="py-24 md:py-32 bg-bg border-y border-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-black text-fg uppercase tracking-tighter">Comunidad Industrial</h2>
              <p className="text-muted-fg text-[10px] font-black uppercase tracking-widest mt-2">Lo que dicen nuestros usuarios verificados.</p>
            </div>
            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-fg text-fg" />)}
            </div>
          </div>
          <AnimateIn animation="scale-in" delay={0.2}>
            <TestimonialsCarousel testimonials={testimonialsData} />
          </AnimateIn>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="pt-24 pb-12 bg-bg border-t border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-20">
            <div className="md:col-span-2 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-fg text-bg flex items-center justify-center font-black text-2xl">E</div>
                <span className="text-2xl font-black text-fg tracking-tighter uppercase">E-COMMERCE</span>
              </div>
              <p className="text-muted-fg text-sm font-bold max-w-sm leading-relaxed uppercase tracking-tight">
                Infraestructura avanzada para el comercio electrónico moderno. Entregando excelencia industrial en cada transacción desde 2026.
              </p>
              <div className="flex gap-4 pt-4">
                {["VISA", "MASTERCARD", "CRYPTO", "YAPE"].map(pay => (
                  <div key={pay} className="px-4 py-2 border border-border text-[9px] font-black text-muted-fg uppercase tracking-widest hover:border-fg hover:text-fg transition-colors cursor-default">{pay}</div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-black text-fg text-xs uppercase tracking-widest mb-10 border-b border-border pb-4">Navegación</h4>
              <ul className="space-y-6 text-[10px] font-black text-muted-fg uppercase tracking-widest">
                <li><button onClick={scrollToProducts} className="hover:text-fg transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Catálogo</button></li>
                <li><a href="#" className="hover:text-fg transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Dashboard</a></li>
                <li><a href="#" className="hover:text-fg transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Comunidad</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-fg text-xs uppercase tracking-widest mb-10 border-b border-border pb-4">Protocolo</h4>
              <ul className="space-y-6 text-[10px] font-black text-muted-fg uppercase tracking-widest">
                <li className="flex items-center gap-3"><Headphones className="w-4 h-4" /> Centro de Soporte</li>
                <li className="flex items-center gap-3"><Shield className="w-4 h-4" /> Política de Privacidad</li>
                <li className="flex items-center gap-3"><Info className="w-4 h-4" /> Términos Técnicos</li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black text-muted-fg uppercase tracking-[0.3em]">
            <p>© 2026 E-COMMERCE. TODOS LOS DERECHOS RESERVADOS.</p>
            <div className="flex gap-8">
              <span className="hover:text-fg cursor-pointer">LATAM</span>
              <span className="hover:text-fg cursor-pointer">EUROPA</span>
              <span className="hover:text-fg cursor-pointer">EE.UU.</span>
            </div>
          </div>
        </div>
      </footer>

      <Cart />
    </div>
  );
}
