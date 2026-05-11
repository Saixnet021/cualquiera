/**
 * Product DTOs — Application Layer
 * Data Transfer Objects con validación Zod.
 */
import { z } from 'zod';

export const CreateProductSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  description: z.string().max(500).optional().default(''),
  price: z.number().positive('El precio debe ser mayor a 0'),
  stock: z.number().int().min(0, 'El stock no puede ser negativo'),
  imageUrl: z.string().url('URL de imagen inválida').optional().default(''),
  category: z.string().max(50).optional().default(''),
  variants: z.array(z.object({
    size: z.string(),
    stock: z.number().int().min(0)
  })).optional().default([]),
});

export const UpdateProductSchema = CreateProductSchema.partial();

export type CreateProductDTO = z.infer<typeof CreateProductSchema>;
export type UpdateProductDTO = z.infer<typeof UpdateProductSchema>;
