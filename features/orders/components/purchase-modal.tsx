
'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { formatPrice } from '@/lib/utils';
import { useAuth } from '@/features/auth/store/auth.store';
import { useOrder } from '../hooks/use-order';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface PurchaseModalProps {
    isOpen: boolean;
    product: Product;
    onClose: () => void;
}

export function PurchaseModal({ isOpen, product, onClose }: PurchaseModalProps) {
    const { createOrder, isLoading } = useOrder();
    const [isPurchased, setIsPurchased] = useState(false);
    const { user } = useAuth();

    if (!user) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-md p-6">
                    <DialogHeader>
                        <DialogTitle className="text-xl flex items-center gap-2 text-red-600">
                            <AlertCircle className="w-5 h-5" />
                            Inicia sesión
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <p className="text-[#666] text-sm">
                            Debes tener una cuenta para comprar.
                        </p>
                        <ul className="space-y-2 text-sm text-[#888]">
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#0A0A0A]" /> Historial de compras</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#0A0A0A]" /> Soporte rápido</li>
                        </ul>
                        <Button onClick={onClose} className="w-full">
                            Cerrar
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    const handleConfirmPurchase = async () => {
        try {
            const orderData = {
                userEmail: user?.email || 'guest@example.com',
                items: [{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    imageUrl: product.imageUrl,
                    category: product.category
                }],
                total: product.price,
                status: 'pending',
                createdAt: new Date(),
            };

            await createOrder(orderData);
            setIsPurchased(true);

            setTimeout(() => {
                const message = `Hola, quiero comprar: ${product.name} por ${formatPrice(product.price)}`;
                const phoneNumber = product.whatsappNumber || '51937074085';
                const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
                onClose();
                setIsPurchased(false);
            }, 2000);
        } catch (error) {
            console.error('Error al procesar compra:', error);
            alert('Error al procesar la compra');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md p-6">
                {!isPurchased ? (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-xl text-[#0A0A0A] font-extrabold">Confirmar Compra</DialogTitle>
                            <DialogDescription className="text-[#666]">
                                Revisa los detalles de tu pedido
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-5 pt-2">
                            <div className="border border-[#E5E5E5] p-4 rounded-xl bg-[#FAFAFA]">
                                <h3 className="font-bold text-[#0A0A0A] text-base leading-tight">{product.name}</h3>
                                <p className="text-xs text-[#999] mt-1 line-clamp-1">{product.description}</p>
                                <div className="mt-4 pt-4 border-t border-[#E5E5E5] flex justify-between items-center">
                                    <span className="text-sm font-semibold text-[#666]">Total a pagar:</span>
                                    <span className="font-bold text-[#0A0A0A] text-xl">{formatPrice(product.price)}</span>
                                </div>
                            </div>
                            
                            <p className="text-xs text-[#888] bg-[#F5F5F5] p-3 rounded-lg">
                                Serás redirigido a WhatsApp para finalizar.
                            </p>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <Button variant="outline" onClick={onClose}>
                                    Cancelar
                                </Button>
                                <Button onClick={handleConfirmPurchase} disabled={isLoading}>
                                    {isLoading ? 'Cargando...' : 'Confirmar'}
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="py-8 text-center space-y-4">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FAFAFA] border border-[#E5E5E5] mb-2">
                                <CheckCircle2 className="w-8 h-8 text-[#0A0A0A]" />
                            </div>
                            <h3 className="text-xl font-bold text-[#0A0A0A]">¡Pedido listo!</h3>
                            <p className="text-[#666] text-sm max-w-[250px] mx-auto">Redirigiendo a WhatsApp de forma segura...</p>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
