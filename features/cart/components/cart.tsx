
'use client';

import { useCart } from '../store/cart.store';
import { useAuth } from '@/src/presentation/providers/auth.store';
import { Button } from '@/components/ui/button';
import { ShoppingCart, X, Trash2, Package } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useState } from 'react';
import Image from 'next/image';
import { CheckoutModal } from '@/features/checkout/components/CheckoutModal';
import toast from 'react-hot-toast';

export function Cart() {
    const [isOpen, setIsOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const { items, removeItem, updateQuantity, getTotal } = useCart();
    const user = useAuth((state) => state.user);

    const handleCheckout = () => {
        if (!user) {
            toast.error('Debes iniciar sesión para continuar');
            return;
        }
        setIsOpen(false);
        setIsCheckoutOpen(true);
    };

    return (
        <>
            <button
                data-cart-fab
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 bg-fg text-bg p-4 rounded-none shadow-none transition-all duration-300 z-50 group active:scale-95 border border-fg"
                aria-label={`Abrir carrito, ${items.length} productos`}
            >
                <ShoppingCart className="w-6 h-6" />
                {items.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-fg text-bg text-[10px] font-black h-5 w-5 flex items-center justify-center border border-bg">
                        {items.length}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-bg/80 backdrop-blur-sm z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end p-0 sm:p-0 pointer-events-none">
                        <div className="bg-bg border-l border-border w-full sm:max-w-md h-full overflow-hidden flex flex-col pointer-events-auto shadow-2xl">
                            {/* Header */}
                            <div className="flex flex-row items-center justify-between p-6 border-b border-border bg-bg">
                                <h2 className="text-xl font-black text-fg flex items-center gap-3 uppercase tracking-tighter">
                                    <ShoppingCart className="w-5 h-5" />
                                    Carrito
                                </h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-muted-fg hover:text-fg transition"
                                    aria-label="Cerrar carrito"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {items.length === 0 ? (
                                    <div className="text-center py-20">
                                        <h3 className="text-xl font-black text-fg mb-2 uppercase tracking-tighter">Carrito Vacío</h3>
                                        <p className="text-muted-fg mb-8 text-sm uppercase font-medium">Agrega productos para continuar</p>
                                        <Button variant="outline" onClick={() => setIsOpen(false)} className="w-full h-12 uppercase text-xs font-black">
                                            Continuar Comprando
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {items.map((item) => (
                                            <div key={`${item.id}-${item.size}`} className="flex gap-4 border-b border-border pb-6 last:border-0">
                                                <div className="relative w-24 h-24 bg-muted flex-shrink-0 overflow-hidden border border-border">
                                                    {item.imageUrl ? (
                                                        <Image
                                                            src={item.imageUrl} alt={item.name} fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full">
                                                            <Package className="w-8 h-8 text-muted-fg" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 flex flex-col justify-between">
                                                    <div>
                                                        <h4 className="font-black text-fg text-sm uppercase tracking-tight">{item.name}</h4>
                                                        <div className="flex items-center gap-3 mt-1">
                                                            <p className="text-sm font-black text-fg">{formatPrice(item.price)}</p>
                                                            {item.size && (
                                                                <span className="text-[10px] text-muted-fg font-black uppercase">
                                                                    Talla: {item.size}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4 mt-3">
                                                        <div className="flex items-center border border-border h-9">
                                                            <button
                                                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1), item.size)}
                                                                className="w-8 h-full flex items-center justify-center text-fg hover:bg-fg hover:text-bg transition"
                                                            >−</button>
                                                            <span className="font-black text-fg min-w-8 text-center text-xs">{item.quantity}</span>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)}
                                                                className="w-8 h-full flex items-center justify-center text-fg hover:bg-fg hover:text-bg transition"
                                                            >+</button>
                                                        </div>
                                                        <button
                                                            onClick={() => removeItem(item.id, item.size)}
                                                            className="text-muted-fg hover:text-fg text-[10px] font-black uppercase tracking-widest transition"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="mt-10 pt-10 border-t border-border space-y-6">
                                            <div className="flex justify-between items-baseline">
                                                <span className="font-black text-muted-fg uppercase text-xs">Total</span>
                                                <span className="font-black text-fg text-3xl tracking-tighter">{formatPrice(getTotal())}</span>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Button onClick={handleCheckout} className="w-full h-14 text-sm font-black uppercase tracking-widest bg-fg text-bg hover:opacity-80">
                                                    Finalizar Compra
                                                </Button>
                                                <Button onClick={() => setIsOpen(false)} variant="ghost" className="w-full h-12 text-[10px] uppercase font-black text-muted-fg hover:text-fg">
                                                    Volver a la Tienda
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}

            <CheckoutModal 
                isOpen={isCheckoutOpen} 
                onClose={() => setIsCheckoutOpen(false)} 
            />
        </>
    );
}
