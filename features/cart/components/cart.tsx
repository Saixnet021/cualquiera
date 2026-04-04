
'use client';

import { useCart } from '../store/cart.store';
import { useAuth } from '@/features/auth/store/auth.store';
import { Button } from '@/components/ui/button';
import { ShoppingCart, X, Trash2, Package } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useState } from 'react';
import Image from 'next/image';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export function Cart() {
    const [isOpen, setIsOpen] = useState(false);
    const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart();
    const user = useAuth((state) => state.user);

    const handleCheckout = async () => {
        if (!user) {
            alert('Debes iniciar sesión para continuar');
            return;
        }

        const total = getTotal();

        try {
            await addDoc(collection(db, 'orders'), {
                userEmail: user.email,
                items: items,
                total: total,
                status: 'pending',
                createdAt: new Date(),
            });

            const message = `🛒 *Nuevo Pedido PEDRO SMS*\n\n` +
                `Cliente: ${user.email}\n` +
                `Items:\n${items.map(item => `- ${item.name} x${item.quantity} = ${formatPrice(item.price * item.quantity)}`).join('\n')}\n\n` +
                `*Total: ${formatPrice(total)}*`;

            const whatsappUrl = `https://wa.me/51937074085?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');

            clearCart();
            setIsOpen(false);
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Hubo un error al procesar el pedido. Por favor intenta nuevamente.');
        }
    };

    return (
        <>
            <button
                data-cart-fab
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-[#1d4ed8] hover:bg-blue-800 text-white p-4 rounded-full shadow-lg transition-all duration-300 z-50 group hover:-translate-y-1"
                aria-label={`Abrir carrito, ${items.length} productos`}
            >
                <ShoppingCart className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                {items.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-white text-[#1d4ed8] text-xs font-black rounded-full h-6 w-6 flex items-center justify-center border-2 border-[#1d4ed8]">
                        {items.length}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
                        <div className="bg-[#10141a] border border-[#262a31] rounded-t-[2rem] sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[90vh] overflow-hidden flex flex-col pointer-events-auto">
                            {/* Header */}
                            <div className="flex flex-row items-center justify-between p-5 md:p-6 border-b border-[#262a31] bg-[#0a0e14]/50 backdrop-blur-xl">
                                <h2 className="text-xl font-bold text-white flex items-center gap-3 tracking-tight">
                                    <ShoppingCart className="w-5 h-5 text-[#1d4ed8]" />
                                    Tu Carrito
                                </h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-[#999] hover:text-white p-2 hover:bg-[#262a31] rounded-full transition"
                                    aria-label="Cerrar carrito"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-4">
                                {items.length === 0 ? (
                                    <div className="text-center py-16">
                                        <div className="w-16 h-16 bg-[#181c22] rounded-full flex items-center justify-center mx-auto mb-5 border border-white/5">
                                            <ShoppingCart className="w-8 h-8 text-[#434656]" />
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-2">Tu carrito está vacío</h3>
                                        <p className="text-[#8d90a2] mb-5 text-sm">Agrega productos para comenzar</p>
                                        <Button variant="outline" onClick={() => setIsOpen(false)}>
                                            Ver productos
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {items.map((item) => (
                                            <div key={item.id} className="flex gap-4 border border-[#31353c] p-4 rounded-xl bg-[#181c22] hover:border-[#1d4ed8]/50 transition-all group shadow-md shadow-black/20">
                                                <div className="relative w-20 h-20 bg-[#10141a] rounded-lg flex-shrink-0 overflow-hidden">
                                                    {item.imageUrl ? (
                                                        <Image
                                                            src={item.imageUrl} alt={item.name} fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full">
                                                            <Package className="w-8 h-8 text-[#434656]" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 flex flex-col justify-between py-1">
                                                    <div>
                                                        <h4 className="font-[family-name:var(--font-manrope)] font-bold text-white text-[15px] leading-tight truncate">{item.name}</h4>
                                                        <p className="text-sm font-black mt-1 text-[#b6c4ff]">{formatPrice(item.price)}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <div className="flex items-center border border-[#31353c] bg-[#10141a] rounded-lg p-0.5">
                                                            <button
                                                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                                className="w-8 h-8 flex items-center justify-center text-[#8d90a2] hover:text-white hover:bg-[#262a31] rounded-md transition"
                                                            >−</button>
                                                            <span className="font-extrabold text-white min-w-8 text-center text-sm">{item.quantity}</span>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, Math.min(item.stock, item.quantity + 1))}
                                                                className="w-8 h-8 flex items-center justify-center text-[#8d90a2] hover:text-white hover:bg-[#262a31] rounded-md transition"
                                                            >+</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end justify-between py-1">
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-[#555] hover:text-[#ffb4ab] p-1.5 hover:bg-[#690005]/20 rounded-full transition"
                                                        aria-label="Eliminar"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                    <span className="font-[family-name:var(--font-manrope)] font-black text-white text-sm">{formatPrice(item.price * item.quantity)}</span>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="mt-6 pt-6 border-t border-[#31353c] space-y-4">
                                            <div className="flex justify-between items-center text-lg">
                                                <span className="font-bold text-[#c3c5d8]">Total a pagar:</span>
                                                <span className="font-[family-name:var(--font-manrope)] font-black text-[#1d4ed8] text-2xl">{formatPrice(getTotal())}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3 mt-4">
                                                <Button onClick={() => setIsOpen(false)} variant="outline" className="bg-[#262a31] border-none text-white hover:bg-[#31353c] font-bold h-12">
                                                    Continuar
                                                </Button>
                                                <Button onClick={handleCheckout} className="bg-[#1d4ed8] hover:bg-blue-800 text-white font-bold h-12">
                                                    Confirmar
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
        </>
    );
}
