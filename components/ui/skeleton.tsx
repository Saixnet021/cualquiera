import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn('skeleton rounded-xl', className)}
      aria-hidden="true"
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden" aria-hidden="true">
      <div className="skeleton h-40 sm:h-56 w-full" />
      <div className="p-4 sm:p-5 space-y-3">
        <div className="skeleton h-5 w-3/4 rounded-lg" />
        <div className="skeleton h-4 w-full rounded-lg" />
        <div className="skeleton h-4 w-1/2 rounded-lg" />
        <div className="flex justify-between items-center pt-2 border-t border-slate-100">
          <div className="skeleton h-7 w-24 rounded-lg" />
          <div className="skeleton h-5 w-20 rounded-lg" />
        </div>
        <div className="grid grid-cols-2 gap-2 pt-2">
          <div className="skeleton h-11 rounded-xl" />
          <div className="skeleton h-11 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function CarouselSkeleton() {
  return (
    <div className="w-full" aria-hidden="true">
      <div className="skeleton h-64 sm:h-80 md:h-96 w-full rounded-2xl" />
      <div className="flex justify-center gap-2 mt-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton w-2.5 h-2.5 rounded-full" />
        ))}
      </div>
    </div>
  );
}
