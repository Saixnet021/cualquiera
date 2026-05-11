
'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { OrderEntity } from '@/src/domain/entities/order.entity';

export function useOrdersAdmin() {
  const [orders, setOrders] = useState<OrderEntity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: OrderEntity[] = snapshot.docs.map((docSnap) => {
        const d = docSnap.data();
        return {
          id: docSnap.id,
          orderCode: d.orderCode,
          userId: d.userId ?? '',
          userEmail: d.userEmail ?? '',
          userName: d.userName ?? '',
          items: d.items ?? [],
          total: d.total ?? 0,
          discount: d.discount ?? 0,
          finalTotal: d.finalTotal ?? d.total ?? 0,
          status: d.status ?? 'pending',
          whatsappSent: d.whatsappSent ?? false,
          voucherUrl: d.voucherUrl ?? '',
          shippingData: d.shippingData,
          trackingNumber: d.trackingNumber ?? '',
          createdAt: d.createdAt?.toDate?.() ?? new Date(),
          updatedAt: d.updatedAt?.toDate?.(),
        };
      });
      setOrders(data);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching orders:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { orders, loading };
}
