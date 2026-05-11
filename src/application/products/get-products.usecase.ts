/**
 * Get Products Use Case — Application Layer
 * 
 * Principio SRP: solo responsable de recuperar todos los productos.
 * No sabe nada de Firebase ni de UI.
 */
import type { IProductRepository } from '@/src/domain/repositories/product.repository';
import type { ProductEntity } from '@/src/domain/entities/product.entity';

export class GetProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(): Promise<ProductEntity[]> {
    return this.productRepository.getAll();
  }
}
