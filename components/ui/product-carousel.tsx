'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Product } from '@/types';
import { ProductCard } from '@/features/products/components/product-card';

interface ProductCarouselProps {
  products: Product[];
  className?: string;
}

export function ProductCarousel({ products, className }: ProductCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
    containScroll: 'trimSnaps'
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  if (!products || products.length === 0) return null;

  return (
    <div className={cn('relative group', className)}>
      <div className="overflow-hidden px-1 py-4" ref={emblaRef} style={{ touchAction: 'pan-y' }}>
        <div className="flex -ml-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-[0_0_85%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] xl:flex-[0_0_25%] min-w-0 pl-4"
            >
              <div className="h-full">
                <ProductCard product={product} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        className="absolute -left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-lg bg-[var(--background)] border border-[var(--border)] shadow-sm flex items-center justify-center text-white hover:bg-[#1e293b] hover:shadow-md transition-all disabled:opacity-0 focus-visible:opacity-100 z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={scrollNext}
        disabled={!canScrollNext}
        className="absolute -right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-lg bg-[var(--background)] border border-[var(--border)] shadow-sm flex items-center justify-center text-white hover:bg-[#1e293b] hover:shadow-md transition-all disabled:opacity-0 focus-visible:opacity-100 z-10"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}
