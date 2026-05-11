
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ShippingData } from './types';
import { CartItem } from '@/types';

export async function createCheckoutOrder(
  items: CartItem[], 
  shippingData: ShippingData, 
  voucherUrl: string, 
  total: number
): Promise<string> {
  try {
    const orderCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    const orderData = JSON.parse(JSON.stringify({
      orderCode,
      items,
      shippingData,
      voucherUrl,
      total,
      status: 'voucher_uploaded',
      createdAt: new Date().toISOString(),
    }));

    const finalData = {
      ...orderData,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'orders'), finalData);
    return docRef.id;
  } catch (error) {
    console.error('Error in createCheckoutOrder:', error);
    throw new Error('No se pudo guardar la orden en Firestore');
  }
}
