'use client';

/**
 * useProducts Hook — usa GetProductsUseCase
 */
import { useState, useEffect, useCallback } from 'react';
import { FirebaseProductRepository } from '@/src/infrastructure/firebase/product.repository';
import { GetProductsUseCase } from '@/src/application/products/get-products.usecase';
import type { ProductEntity } from '@/src/domain/entities/product.entity';

const productRepo = new FirebaseProductRepository();
const getProductsUseCase = new GetProductsUseCase(productRepo);

export function useProducts() {
  const [products, setProducts] = useState<ProductEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProductsUseCase.execute();
      setProducts(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  return { products, loading, error, refresh: loadProducts };
}
