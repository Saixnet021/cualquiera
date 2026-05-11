/**
 * ConfirmPaymentUseCase — Application Layer
 *
 * Confirma el pago de una orden usando una batch write atómica:
 * 1. Actualiza order.status a 'paid'
 * 2. Descuenta stock de cada variante/producto involucrado
 */
import { db } from '@/src/infrastructure/firebase/firebase.config';
import {
  writeBatch,
  doc,
  getDoc,
  arrayUnion,
  serverTimestamp,
} from 'firebase/firestore';
import { AppError } from '@/src/shared/errors/app-error';

export class ConfirmPaymentUseCase {
  async execute(orderId: string): Promise<void> {
    // 1. Leer la orden
    const orderRef = doc(db, 'orders', orderId);
    const orderSnap = await getDoc(orderRef);
    if (!orderSnap.exists()) {
      throw new AppError('Orden no encontrada', 'NOT_FOUND', 404);
    }

    const orderData = orderSnap.data();
    const items: Array<{ id: string; quantity: number; size?: string }> = orderData.items ?? [];

    const batch = writeBatch(db);

    // 2. Actualizar estado de la orden
    batch.update(orderRef, {
      status: 'paid',
      updatedAt: serverTimestamp(),
    });

    // 3. Descontar stock de cada producto/variante
    for (const item of items) {
      const productRef = doc(db, 'products', item.id);
      const productSnap = await getDoc(productRef);
      if (!productSnap.exists()) continue;

      const productData = productSnap.data();

      if (item.size && productData.variants?.length) {
        // Descontar del stock de la variante específica
        const updatedVariants = productData.variants.map((v: { size: string; stock: number }) =>
          v.size === item.size
            ? { ...v, stock: Math.max(0, v.stock - item.quantity) }
            : v
        );
        batch.update(productRef, {
          variants: updatedVariants,
          updatedAt: serverTimestamp(),
        });
      } else {
        // Descontar del stock general
        const newStock = Math.max(0, (productData.stock ?? 0) - item.quantity);
        batch.update(productRef, {
          stock: newStock,
          updatedAt: serverTimestamp(),
        });
      }
    }

    // 4. Commit atómico
    await batch.commit();
  }
}
