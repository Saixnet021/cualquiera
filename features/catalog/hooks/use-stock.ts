
'use client';

import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ProductVariant } from '@/src/domain/entities/product.entity';

export function useStock(productId: string) {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;

    const docRef = doc(db, 'products', productId);
    
    // Suscripción en tiempo real
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setVariants(data.variants || []);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching stock in real-time:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [productId]);

  return { variants, loading };
}
