/**
 * Approve Order Use Case — Application Layer
 * 
 * Antes: toda esta lógica vivía inline en admin/page.tsx (handleApproveOrder).
 * Ahora: centralizada, testeable, reutilizable.
 */
import type { IOrderRepository } from '@/src/domain/repositories/order.repository';
import type { IProductRepository } from '@/src/domain/repositories/product.repository';
import { AppError } from '@/src/shared/errors/app-error';

export class ApproveOrderUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(orderId: string): Promise<void> {
    const order = await this.orderRepository.getById(orderId);
    if (!order) throw new AppError('Pedido no encontrado', 'NOT_FOUND', 404);

    if (order.status !== 'pending') {
      throw new AppError('Solo se pueden aprobar pedidos pendientes', 'INVALID_STATE', 400);
    }

    // Actualizar stock de cada producto en paralelo
    await Promise.all(
      order.items.map(async (item) => {
        const product = await this.productRepository.getById(item.id);
        if (product) {
          const newStock = Math.max(0, product.stock - item.quantity);
          await this.productRepository.update(item.id, { stock: newStock });
        }
      })
    );

    await this.orderRepository.updateStatus(orderId, 'approved');
  }
}
