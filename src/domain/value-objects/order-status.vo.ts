/**
 * Order Status Value Object — Domain Layer
 */
export type OrderStatus = 'pending' | 'approved' | 'rejected' | 'voucher_uploaded' | 'paid' | 'shipped';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pendiente',
  approved: 'Aprobado',
  rejected: 'Rechazado',
  voucher_uploaded: 'Voucher Enviado',
  paid: 'Pagado',
  shipped: 'Enviado',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'text-yellow-400',
  approved: 'text-green-400',
  rejected: 'text-red-400',
  voucher_uploaded: 'text-amber-400',
  paid: 'text-emerald-400',
  shipped: 'text-blue-400',
};
