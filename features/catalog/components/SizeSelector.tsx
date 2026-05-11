
'use client';

import { ProductVariant } from '@/src/domain/entities/product.entity';
import { cn } from '@/lib/utils';

interface SizeSelectorProps {
  variants: ProductVariant[];
  selectedSize: string | null;
  onSelect: (size: string) => void;
}

export function SizeSelector({ variants, selectedSize, onSelect }: SizeSelectorProps) {
  if (!variants || variants.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <p className="text-[9px] font-black text-muted-fg uppercase tracking-widest">Seleccionar Talla</p>
      <div className="flex flex-wrap gap-2">
        {variants.map((v) => {
          const isOutOfStock = v.stock === 0;
          const isSelected = selectedSize === v.size;
          const isLowStock = v.stock > 0 && v.stock <= 3;

          return (
            <button
              key={v.size}
              disabled={isOutOfStock}
              onClick={() => onSelect(v.size)}
              className={cn(
                "relative min-w-[3.5rem] h-10 px-3 border transition-all flex flex-col items-center justify-center gap-0.5 uppercase rounded-none",
                isOutOfStock 
                  ? "opacity-20 cursor-not-allowed border-border text-fg" 
                  : isSelected
                    ? "border-fg bg-fg text-bg font-black"
                    : "border-border hover:border-fg text-fg bg-bg"
              )}
            >
              <span className={cn("text-[10px] font-black", isOutOfStock && "line-through")}>
                {v.size}
              </span>
              
              {isLowStock && !isSelected && !isOutOfStock && (
                <span className="absolute -top-1.5 -right-1 bg-fg text-bg text-[7px] px-1 font-black uppercase">
                  {v.stock}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
