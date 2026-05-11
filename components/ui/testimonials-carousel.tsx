
'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Quote, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Testimonial {
  name: string;
  comment: string;
  initials: string;
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
              <div className="p-8 border border-border bg-bg hover:border-fg transition-all duration-300 h-full flex flex-col justify-between rounded-none shadow-none">
                <div>
                  <Quote className="w-8 h-8 text-border mb-6" />
                  <p className="text-xs font-medium text-fg leading-relaxed mb-8 uppercase tracking-tight">"{t.comment}"</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-fg text-bg flex items-center justify-center font-black text-xs uppercase">
                    {t.initials}
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-fg block uppercase tracking-widest">{t.name}</span>
                    <div className="flex gap-0.5 mt-1">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-2.5 h-2.5 text-fg fill-fg" />
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
      <div className="flex justify-center gap-3 mt-8">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            aria-label={`Testimonial ${index + 1}`}
            className={cn(
              'h-1 transition-all duration-300',
              index === selectedIndex
                ? 'bg-fg w-8'
                : 'bg-border w-4 hover:bg-muted-fg'
            )}
          />
        ))}
      </div>
    </div>
  );
}
