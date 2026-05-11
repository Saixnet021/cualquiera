
'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/features/cart/store/cart.store';
import { ShoppingCart, Check, Package } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import { useStock } from '@/features/catalog/hooks/use-stock';
import { SizeSelector } from '@/features/catalog/components/SizeSelector';
import toast from 'react-hot-toast';
import { CheckoutModal } from '@/features/checkout/components/CheckoutModal';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [added, setAdded] = useState(false);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const { variants, loading: loadingStock } = useStock(product.id);
    const addItem = useCart((state) => state.addItem);

    const handleAddToCart = () => {
        const hasVariants = (variants?.length ?? 0) > 0;
        if (hasVariants && !selectedSize) {
            toast.error('Por favor selecciona una talla');
            return;
        }

        const currentStock = selectedSize 
            ? variants.find(v => v.size === selectedSize)?.stock ?? 0
            : product.stock;

        if (currentStock > 0) {
            try {
                addItem(product, selectedSize || undefined, currentStock);
                setAdded(true);
                setTimeout(() => setAdded(false), 1500);
                if (selectedSize) toast.success(`Agregado talla ${selectedSize}`);
            } catch (err: any) {
                toast.error(err.message || 'Error al agregar');
            }
        }
    };

    const handleBuyNow = () => {
        const hasVariants = (variants?.length ?? 0) > 0;
        if (hasVariants && !selectedSize) {
            toast.error('Por favor selecciona una talla');
            return;
        }

        const currentStock = selectedSize 
            ? variants.find(v => v.size === selectedSize)?.stock ?? 0
            : product.stock;

        if (currentStock > 0) {
            try {
                addItem(product, selectedSize || undefined, currentStock);
                setIsCheckoutOpen(true);
            } catch (err: any) {
                toast.error(err.message || 'Error al procesar');
            }
        }
    };

    return (
        <>
            <div className="group h-full flex flex-col overflow-hidden border border-border hover:border-fg transition-all duration-300 max-w-[320px] mx-auto bg-bg">
                <div className="relative h-[240px] overflow-hidden flex-shrink-0 bg-muted">
                    {product.imageUrl ? (
                        <Image
                            src={product.imageUrl} alt={product.name} fill
                            className="object-cover transition-all duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <Package className="w-12 h-12 text-muted-fg" />
                        </div>
                    )}

                    {product.stock <= 5 && product.stock > 0 && (
                        <div className="absolute top-0 right-0 bg-fg text-bg px-2 py-1 text-[9px] font-black uppercase tracking-tighter">
                            Últimas Unidades
                        </div>
                    )}
                    {product.stock === 0 && (
                        <div className="absolute inset-0 bg-bg/90 backdrop-blur-sm flex items-center justify-center">
                            <span className="border border-fg text-fg px-4 py-2 font-black text-xs tracking-widest uppercase">Agotado</span>
                        </div>
                    )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between relative z-10 border-t border-border">
                    <div className="mb-4">
                        <h3 className="font-black text-lg text-fg line-clamp-1 mb-1 uppercase tracking-tighter">
                            {product.name}
                        </h3>
                        <p className="text-muted-fg text-[12px] line-clamp-2 leading-tight uppercase font-medium">
                            {product.description || "Producto demo premium de e-commerce."}
                        </p>
                    </div>

                    <div className="mb-6">
                        <SizeSelector 
                            variants={variants} 
                            selectedSize={selectedSize} 
                            onSelect={setSelectedSize} 
                        />
                    </div>
                    
                    <div className="mt-auto flex flex-col gap-4">
                        <div className="flex items-baseline justify-between">
                             <span className="text-2xl font-black text-fg tracking-tighter">
                                {formatPrice(product.price)}
                            </span>
                            <span className="text-[10px] text-muted-fg font-black uppercase">Impuestos incl.</span>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={handleBuyNow}
                                disabled={product.stock === 0}
                                className="flex-grow bg-fg text-bg hover:opacity-80 font-black h-11 rounded-none uppercase text-xs transition-colors"
                            >
                                Comprar Ahora
                            </Button>
                            <Button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                variant="outline"
                                className={`px-4 h-11 rounded-none border border-border transition-all duration-300 ${added ? 'bg-fg text-bg border-fg' : 'bg-transparent hover:bg-fg hover:text-bg text-fg'}`}
                                aria-label="Agregar al carrito"
                            >
                                {added ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            
            <CheckoutModal 
                isOpen={isCheckoutOpen} 
                onClose={() => setIsCheckoutOpen(false)} 
            />
        </>
    );
}
