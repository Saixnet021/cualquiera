/**
 * Product Entity — Domain Layer
 * Representa el producto como concepto de negocio puro,
 * sin dependencias de Firebase ni de UI.
 */
export type ProductVariant = { size: string; stock: number };

export interface ProductEntity {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: string;
  variants?: ProductVariant[];

  createdAt: Date;
  updatedAt?: Date;
}

export type CreateProductData = Omit<ProductEntity, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateProductData = Partial<CreateProductData>;
