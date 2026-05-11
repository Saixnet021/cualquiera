/**
 * Delete Product Use Case — Application Layer
 */
import type { IProductRepository } from '@/src/domain/repositories/product.repository';
import { AppError } from '@/src/shared/errors/app-error';

export class DeleteProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(id: string): Promise<void> {
    if (!id) throw new AppError('ID de producto requerido', 'VALIDATION_ERROR', 400);

    const exists = await this.productRepository.getById(id);
    if (!exists) throw new AppError('Producto no encontrado', 'NOT_FOUND', 404);

    return this.productRepository.delete(id);
  }
}
