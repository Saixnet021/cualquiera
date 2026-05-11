/**
 * Order DTOs — Application Layer
 */
import { z } from 'zod';

const CartItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  imageUrl: z.string().optional().default(''),
  category: z.string().optional().default(''),
  description: z.string().optional().default(''),
  stock: z.number().optional().default(0),
  createdAt: z.date().optional().default(() => new Date()),
});

export const CreateOrderSchema = z.object({
  userId: z.string().min(1),
  userEmail: z.string().email(),
  userName: z.string().optional().default(''),
  items: z.array(CartItemSchema).min(1, 'El pedido debe tener al menos un item'),
  total: z.number().positive(),
  discount: z.number().min(0).default(0),
  finalTotal: z.number().positive(),
  whatsappSent: z.boolean().default(false),
});

export type CreateOrderDTO = z.infer<typeof CreateOrderSchema>;
