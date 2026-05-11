/**
 * Reject Order Use Case — Application Layer
 */
import type { IOrderRepository } from '@/src/domain/repositories/order.repository';
import { AppError } from '@/src/shared/errors/app-error';

export class RejectOrderUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(orderId: string): Promise<void> {
    const order = await this.orderRepository.getById(orderId);
    if (!order) throw new AppError('Pedido no encontrado', 'NOT_FOUND', 404);

    if (order.status !== 'pending') {
      throw new AppError('Solo se pueden rechazar pedidos pendientes', 'INVALID_STATE', 400);
    }

    await this.orderRepository.updateStatus(orderId, 'rejected');
  }
}
