/**
 * MarkShippedUseCase — Application Layer
 *
 * Marca una orden como enviada y guarda el número de tracking.
 */
import { db } from '@/src/infrastructure/firebase/firebase.config';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { AppError } from '@/src/shared/errors/app-error';

export class MarkShippedUseCase {
  async execute(orderId: string, trackingNumber: string): Promise<void> {
    if (!trackingNumber.trim()) {
      throw new AppError('El número de tracking es requerido', 'VALIDATION_ERROR', 400);
    }

    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status: 'shipped',
      trackingNumber: trackingNumber.trim(),
      updatedAt: serverTimestamp(),
    });
  }
}
