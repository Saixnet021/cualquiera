'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Quote, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface Testimonial {
  name: string;
  comment: string;
  initials: string;
  avatarUrl?: string;
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
  className?: string;
}

export function TestimonialsCarousel({ testimonials, className }: TestimonialsCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: 'start',
  });
  
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  // Auto-play
  useEffect(() => {
    if (!emblaApi) return;
    const timer = setInterval(() => emblaApi.scrollNext(), 5000);
    return () => clearInterval(timer);
  }, [emblaApi]);

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <div className={cn('relative', className)}>
      <div className="overflow-hidden px-2 py-4" ref={emblaRef} style={{ touchAction: 'pan-y' }}>
        <div className="flex -ml-4">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 pl-4"
            >
              <div className="p-6 rounded-2xl border border-[#1e293b] bg-[#111827] hover:shadow-lg transition-all duration-300 h-full flex flex-col justify-between">
                <div>
                  <Quote className="w-6 h-6 text-[#1e293b] mb-5" />
                  <p className="text-sm text-[#9ca3af] leading-relaxed mb-6 italic">"{t.comment}"</p>
                </div>
                <div className="flex items-center gap-4">
                  {t.avatarUrl ? (
                    <div className="w-12 h-12 rounded-full overflow-hidden relative">
                      <Image src={t.avatarUrl} alt={t.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#1e293b] border border-[#334155] flex items-center justify-center font-bold text-white">
                      {t.initials}
                    </div>
                  )}
                  <div>
                    <span className="text-sm font-bold text-white block">{t.name}</span>
                    <div className="flex gap-0.5 mt-1">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-3 h-3 text-orange-500 fill-orange-500" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            aria-label={`Ir al testimonio ${index + 1}`}
            className={cn(
              'w-2 h-2 rounded-full transition-all duration-300',
              index === selectedIndex
                ? 'bg-[var(--primary)] w-6'
                : 'bg-[#E5E5E5] hover:bg-[#CCC]'
            )}
          />
        ))}
      </div>
    </div>
  );
}
