/**
 * Update Product Use Case — Application Layer
 */
import type { IProductRepository } from '@/src/domain/repositories/product.repository';
import { UpdateProductSchema, type UpdateProductDTO } from '../dtos/product.dto';
import { AppError } from '@/src/shared/errors/app-error';

export class UpdateProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(id: string, data: UpdateProductDTO): Promise<void> {
    if (!id) throw new AppError('ID de producto requerido', 'VALIDATION_ERROR', 400);

    const validation = UpdateProductSchema.safeParse(data);
    if (!validation.success) {
      throw new AppError(validation.error.message, 'VALIDATION_ERROR', 400);
    }

    const exists = await this.productRepository.getById(id);
    if (!exists) throw new AppError('Producto no encontrado', 'NOT_FOUND', 404);

    return this.productRepository.update(id, validation.data);
  }
}
