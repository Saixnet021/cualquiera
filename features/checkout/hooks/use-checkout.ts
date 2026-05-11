
'use client';

import { useState } from 'react';
import { useCheckoutStore } from '../store/checkout.store';
import { useCart } from '@/features/cart/store/cart.store';
import { createCheckoutOrder } from '../actions';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';
import { SettingsRepository } from '@/src/infrastructure/firebase/settings.repository';

const settingsRepo = new SettingsRepository();

export function useCheckout() {
  const [loading, setLoading] = useState(false);
  const { shippingData, voucherUrl, setOrderId, reset } = useCheckoutStore();
  const { items, getTotal, clearCart } = useCart();

  const confirmCheckout = async () => {
    setLoading(true);
    try {
      const total = getTotal();
      const orderId = await createCheckoutOrder(items, shippingData, voucherUrl, total);
      setOrderId(orderId);

      // Obtener configuración de WhatsApp
      const settings = await settingsRepo.getSettings();
      const phoneNumber = settings.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '51900000000';

      // Construir mensaje de WhatsApp
      const itemsList = items.map(i => `- ${i.name} x${i.quantity} ${i.size ? `(${i.size})` : ''} = ${formatPrice(i.price * i.quantity)}`).join('\n');
      
      const message = 
`NUEVO PEDIDO INDUSTRIAL
-------------------------
Código: #${orderId.slice(0, 8).toUpperCase()}
Cliente: ${shippingData.fullName}
DNI: ${shippingData.dni}
-------------------------
Productos:
${itemsList}
-------------------------
Total: ${formatPrice(total)}
Envío: ${shippingData.courier} (${shippingData.city})
Dirección: ${shippingData.address}
Comprobante: ${voucherUrl}`;

      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      
      // Abrir WhatsApp
      window.open(whatsappUrl, '_blank');
      
      // Limpiar carrito y estado solo después del éxito
      clearCart();
      toast.success('¡Pedido enviado con éxito!');
      return orderId;
    } catch (error) {
      toast.error('Error al procesar el pedido');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    confirmCheckout,
    loading,
    total: getTotal(),
    items,
    shippingData,
    voucherUrl
  };
}
