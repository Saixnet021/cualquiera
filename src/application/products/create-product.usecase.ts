/**
 * Create Product Use Case — Application Layer
 * 
 * Valida el DTO con Zod antes de persistir.
 * Nunca llama Firebase directamente — depende de la interfaz IProductRepository.
 */
import type { IProductRepository } from '@/src/domain/repositories/product.repository';
import type { ProductEntity } from '@/src/domain/entities/product.entity';
import { CreateProductSchema, type CreateProductDTO } from '../dtos/product.dto';
import { AppError } from '@/src/shared/errors/app-error';

export class CreateProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(data: CreateProductDTO): Promise<ProductEntity> {
    // Validación con Zod — falla rápido con mensajes claros
    const validation = CreateProductSchema.safeParse(data);
    if (!validation.success) {
      throw new AppError(validation.error.message, 'VALIDATION_ERROR', 400);
    }

    return this.productRepository.create(validation.data);
  }
}
