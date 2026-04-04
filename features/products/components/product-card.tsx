
'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/features/cart/store/cart.store';
import { ShoppingCart, CheckCircle, Check, Package } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const PurchaseModal = dynamic(
    () => import('@/features/orders/components/purchase-modal').then(mod => mod.PurchaseModal),
    { ssr: false }
);

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
    const [added, setAdded] = useState(false);
    const addItem = useCart((state) => state.addItem);

    const handleAddToCart = () => {
        if (product.stock > 0) {
            addItem(product);
            setAdded(true);
            setTimeout(() => setAdded(false), 1500);
        }
    };

    return (
        <>
            <div className="group h-full flex flex-col overflow-hidden rounded-[1.25rem] bg-[#181c22]/80 backdrop-blur-md border border-white/5 hover:border-white/10 hover:-translate-y-1.5 transition-all duration-500 max-w-[320px] mx-auto shadow-2xl shadow-black/40">
                {/* Image */}
                <div className="relative h-[220px] overflow-hidden flex-shrink-0 bg-[#0a0e14]">
                    {product.imageUrl ? (
                        <Image
                            src={product.imageUrl} alt={product.name} fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <Package className="w-12 h-12 text-[#434656]" />
                        </div>
                    )}
                    {/* Gradient Overlay for blending */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#181c22]/80 to-transparent pointer-events-none" />

                    {product.stock <= 5 && product.stock > 0 && (
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-[#ffb59a] to-[#ffdbcf] text-[#5b1b00] px-3 py-1 rounded-lg text-[10px] font-extrabold shadow-lg uppercase tracking-wider">
                            Top Ventas
                        </div>
                    )}
                    {product.stock === 0 && (
                        <div className="absolute inset-0 bg-[#0a0e14]/80 backdrop-blur-sm flex items-center justify-center">
                            <span className="bg-[#ffb4ab] text-[#690005] px-4 py-1.5 rounded-lg font-extrabold text-xs tracking-widest shadow-lg">AGOTADO</span>
                        </div>
                    )}
                    {product.stock > 5 && (
                        <div className="absolute top-4 right-4 bg-[#1d4ed8]/20 backdrop-blur-md text-[#b6c4ff] border border-[#1d4ed8]/30 px-3 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-wider shadow-lg">
                            <Check className="w-3 h-3" /> Stock
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="px-6 py-5 flex-1 flex flex-col justify-between relative z-10 bg-[#181c22]">
                    <div className="mb-4">
                        <h3 className="font-[family-name:var(--font-manrope)] font-extrabold text-xl lg:text-[22px] text-[#b6c4ff] line-clamp-2 mb-2 leading-tight tracking-tight shadow-sm">
                            {product.name}
                        </h3>
                        <p className="text-[#8d90a2] text-[13px] line-clamp-2 leading-relaxed">
                            {product.description || "Producto digital garantizado."}
                        </p>
                    </div>
                    
                    <div className="mt-auto flex flex-col gap-5">
                        <div>
                            <span className="font-[family-name:var(--font-manrope)] tracking-tight text-[26px] font-black text-white drop-shadow-md">
                                {formatPrice(product.price)}
                            </span>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                onClick={() => setIsPurchaseModalOpen(true)}
                                disabled={product.stock === 0}
                                className="flex-grow bg-[#1d4ed8] text-white font-bold h-12 rounded-xl hover:bg-blue-800 transition-colors shadow-none"
                            >
                                Comprar
                            </Button>
                            <Button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                variant="outline"
                                className={`px-4 h-12 rounded-xl border-none transition-all duration-300 ${added ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-105' : 'bg-[#262a31] hover:bg-[#31353c] text-white'}`}
                                aria-label="Añadir al carrito"
                            >
                                {added ? <CheckCircle className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <PurchaseModal isOpen={isPurchaseModalOpen} product={product} onClose={() => setIsPurchaseModalOpen(false)} />
        </>
    );
}
