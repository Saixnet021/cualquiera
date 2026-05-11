'use client';

/**
 * useOrder Hook — usa CreateOrderUseCase de la capa de aplicación.
 * Compatible con el PurchaseModal existente.
 */
import { useState } from 'react';
import { FirebaseOrderRepository } from '@/src/infrastructure/firebase/order.repository';
import { CreateOrderUseCase } from '@/src/application/orders/create-order.usecase';
import type { CreateOrderDTO } from '@/src/application/dtos/order.dto';
import type { OrderEntity } from '@/src/domain/entities/order.entity';
import { AppError } from '@/src/shared/errors/app-error';

const orderRepo = new FirebaseOrderRepository();
const createOrderUseCase = new CreateOrderUseCase(orderRepo);

export function useOrder() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = async (orderData: CreateOrderDTO): Promise<OrderEntity | null> => {
    setIsLoading(true);
    setError(null);
    try {
      return await createOrderUseCase.execute(orderData);
    } catch (err) {
      const msg = AppError.isAppError(err) ? err.message : 'Error al crear la orden';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { createOrder, isLoading, error };
}
