/**
 * IOrderRepository — Domain Layer (Interface/Contract)
 */
import type { OrderEntity, CreateOrderData, OrderStatus } from '../entities/order.entity';

export interface IOrderRepository {
  getAll(): Promise<OrderEntity[]>;
  getById(id: string): Promise<OrderEntity | null>;
  getByUserId(userId: string): Promise<OrderEntity[]>;
  getByStatus(status: OrderStatus): Promise<OrderEntity[]>;
  create(data: CreateOrderData): Promise<OrderEntity>;
  updateStatus(id: string, status: OrderStatus): Promise<void>;
}
