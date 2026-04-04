'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CarouselProps {
  children: React.ReactNode[];
  autoPlay?: boolean;
  interval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  className?: string;
  slideClassName?: string;
}

export function Carousel({
  children,
  autoPlay = true,
  interval = 5000,
  showDots = true,
  showArrows = true,
  className,
  slideClassName,
}: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  // Track selected slide
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi]);

  // Auto-play with pause on hover
  useEffect(() => {
    if (!autoPlay || !emblaApi || isPaused) return;
    const timer = setInterval(() => emblaApi.scrollNext(), interval);
    return () => clearInterval(timer);
  }, [autoPlay, emblaApi, interval, isPaused]);

  if (!children || children.length === 0) return null;

  return (
    <div
      className={cn('relative group', className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Viewport */}
      <div ref={emblaRef} className="overflow-hidden rounded-2xl">
        <div className="flex">
          {children.map((child, index) => (
            <div
              key={index}
              className={cn('flex-[0_0_100%] min-w-0', slideClassName)}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      {showArrows && children.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            aria-label="Slide anterior"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-[#0A0A0A] hover:bg-white hover:shadow-lg transition-all opacity-0 group-hover:opacity-100 focus-visible:opacity-100 z-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Slide siguiente"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-[#0A0A0A] hover:bg-white hover:shadow-lg transition-all opacity-0 group-hover:opacity-100 focus-visible:opacity-100 z-10"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {showDots && children.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
          {children.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              aria-label={`Ir al slide ${index + 1}`}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-300 shadow-[0_0_4px_rgba(0,0,0,0.5)]',
                index === selectedIndex
                  ? 'bg-white w-8'
                  : 'bg-white/40 hover:bg-white/80'
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
