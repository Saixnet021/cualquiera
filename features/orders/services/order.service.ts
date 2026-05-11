/**
 * Order Service — features/orders (compatibility layer)
 * 
 * Redirige a la nueva arquitectura limpia.
 * Los nuevos componentes deberían usar directamente los use-cases.
 */
export { FirebaseOrderRepository } from '@/src/infrastructure/firebase/order.repository';

// Re-export DTO para compatibilidad
export type { CreateOrderDTO } from '@/src/application/dtos/order.dto';
