/**
 * Order Entity — Domain Layer
 */
import type { CartItemEntity } from './cart.entity';

export type OrderStatus = 'pending' | 'approved' | 'rejected' | 'voucher_uploaded' | 'paid' | 'shipped';

export interface ShippingData {
  fullName: string;
  dni: string;
  address: string;
  city: string;
  courier: string;
  phone: string;
}

export interface OrderEntity {
  id: string;
  orderCode?: string;
  userId: string;
  userEmail: string;
  userName: string;
  items: CartItemEntity[];
  total: number;
  discount: number;
  finalTotal: number;
  status: OrderStatus;
  whatsappSent: boolean;
  voucherUrl?: string;
  shippingData?: ShippingData;
  trackingNumber?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export type CreateOrderData = Omit<OrderEntity, 'id' | 'createdAt' | 'updatedAt'>;
