/**
 * IProductRepository — Domain Layer (Interface/Contract)
 * 
 * Principio SOLID: Dependency Inversion.
 * Los use-cases dependen de esta interfaz, no de Firebase directamente.
 * Se puede cambiar la implementación sin tocar el negocio.
 */
import type { ProductEntity, CreateProductData, UpdateProductData } from '../entities/product.entity';

export interface IProductRepository {
  getAll(): Promise<ProductEntity[]>;
  getById(id: string): Promise<ProductEntity | null>;
  getByCategory(category: string): Promise<ProductEntity[]>;
  create(data: CreateProductData): Promise<ProductEntity>;
  update(id: string, data: UpdateProductData): Promise<void>;
  delete(id: string): Promise<void>;
}
