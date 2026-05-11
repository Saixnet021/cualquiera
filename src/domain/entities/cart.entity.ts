/**
 * Cart Entity — Domain Layer
 */
import type { ProductEntity } from './product.entity';

export interface CartItemEntity extends ProductEntity {
  quantity: number;
  size?: string;
}
