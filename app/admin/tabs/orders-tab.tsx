
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import {
  ShoppingBag, Loader2, Eye, CheckCircle, Package, Truck,
  CreditCard, Hash, MapPin, User, Clock, ChevronRight, Phone
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';
import Image from 'next/image';

import { useOrdersAdmin } from '@/features/orders/hooks/use-orders-admin';
import { ConfirmPaymentUseCase } from '@/src/application/usecases/ConfirmPaymentUseCase';
import { MarkShippedUseCase } from '@/src/application/usecases/MarkShippedUseCase';
import type { OrderEntity } from '@/src/domain/entities/order.entity';

const confirmPayment = new ConfirmPaymentUseCase();
const markShipped = new MarkShippedUseCase();

// ─── Diálogo de Detalle del Pedido ──────────────────────────────────────────
interface OrderDetailDialogProps {
  open: boolean;
  order: OrderEntity;
  onClose: () => void;
}

function OrderDetailDialog({ open, order, onClose }: OrderDetailDialogProps) {
  const shortId = order.orderCode || order.id.slice(0, 8).toUpperCase();
  const date = order.createdAt ? new Date(order.createdAt).toLocaleString('es-ES') : '—';
  
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-2xl bg-bg border border-border p-0 overflow-hidden">
        <DialogHeader className="p-6 pr-12 bg-muted border-b border-border">
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-2xl font-black text-fg uppercase tracking-tighter flex items-center gap-2">
                Pedido <span className="text-muted-fg">#{shortId}</span>
              </DialogTitle>
              <DialogDescription className="text-[10px] font-black uppercase tracking-widest text-muted-fg mt-1">
                Registrado el {date}
              </DialogDescription>
            </div>
            <div className={`px-3 py-1 text-[9px] font-black uppercase border ${
              order.status === 'voucher_uploaded' ? 'bg-bg text-fg border-fg' :
              order.status === 'paid' ? 'bg-fg text-bg border-fg' : 'bg-muted text-muted-fg border-border'
            }`}>
              {order.status === 'voucher_uploaded' ? 'Pendiente' : 
               order.status === 'paid' ? 'Pagado' : 'Enviado'}
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col md:flex-row max-h-[70vh] overflow-y-auto">
          {/* Left: Items & Total */}
          <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-border space-y-6">
            <div className="space-y-4">
              <h3 className="text-xs font-black text-fg uppercase tracking-widest flex items-center gap-2">
                <Package className="w-4 h-4" /> Productos ({order.items?.length})
              </h3>
              <div className="space-y-3">
                {order.items?.map((item: any, i: number) => (
                  <div key={i} className="flex gap-4 items-center group">
                    <div className="relative w-16 h-16 bg-muted border border-border overflow-hidden flex-shrink-0">
                      {item.imageUrl ? (
                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover transition-transform group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-6 h-6 text-muted-fg/20" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-fg uppercase leading-tight">{item.name}</p>
                      <p className="text-[9px] font-bold text-muted-fg uppercase mt-0.5">
                        {item.size ? `Talla: ${item.size} — ` : ''}Cant: {item.quantity}
                      </p>
                      <p className="text-[10px] font-black text-fg mt-1">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-border space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase text-muted-fg">
                <span>Subtotal</span>
                <span>{formatPrice(order.total || 0)}</span>
              </div>
              <div className="flex justify-between text-lg font-black uppercase text-fg tracking-tighter">
                <span>Total</span>
                <span>{formatPrice(order.finalTotal || order.total || 0)}</span>
              </div>
            </div>
          </div>

          {/* Right: Info & Voucher */}
          <div className="flex-1 p-6 bg-muted/30 space-y-8">
            {/* Customer & Shipping */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-fg uppercase tracking-widest flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Datos de Envío
              </h3>
              <div className="space-y-3 bg-bg border border-border p-5 text-[10px] font-bold uppercase text-fg">
                <div className="flex items-start gap-3">
                  <User className="w-3.5 h-3.5 text-muted-fg shrink-0" />
                  <div>
                    <p className="text-[8px] text-muted-fg mb-0.5">Cliente</p>
                    <p>{order.shippingData?.fullName || order.userName || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-3.5 h-3.5 text-muted-fg shrink-0" />
                  <div>
                    <p className="text-[8px] text-muted-fg mb-0.5">DNI / Documento</p>
                    <p>{order.shippingData?.dni || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-3.5 h-3.5 text-muted-fg shrink-0" />
                  <div>
                    <p className="text-[8px] text-muted-fg mb-0.5">Teléfono</p>
                    <p>{order.shippingData?.phone || '—'}</p>
                  </div>
                </div>
                <div className="pt-3 border-t border-border mt-1 space-y-3">
                  <div className="flex items-start gap-3">
                    <Truck className="w-3.5 h-3.5 text-muted-fg shrink-0" />
                    <div>
                      <p className="text-[8px] text-muted-fg mb-0.5">Agencia / Courier</p>
                      <p>{order.shippingData?.courier} — {order.shippingData?.city}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-3.5 h-3.5 text-muted-fg shrink-0" />
                    <div>
                      <p className="text-[8px] text-muted-fg mb-0.5">Dirección Destino</p>
                      <p className="normal-case font-black">{order.shippingData?.address || '—'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Voucher */}
            {order.voucherUrl && (
              <div className="space-y-4">
                <h3 className="text-xs font-black text-fg uppercase tracking-widest flex items-center gap-2">
                  <CreditCard className="w-4 h-4" /> Comprobante de Pago
                </h3>
                <div 
                  className="relative h-48 border border-border bg-bg group cursor-zoom-in overflow-hidden"
                  onClick={() => window.open(order.voucherUrl, '_blank')}
                >
                  <Image src={order.voucherUrl} alt="Comprobante" fill className="object-contain p-2 transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0 bg-fg/0 group-hover:bg-fg/5 transition-colors" />
                  <div className="absolute bottom-2 right-2 bg-fg text-bg p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye className="w-3 h-3" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="p-4 border-t border-border bg-bg">
          <Button onClick={onClose} variant="outline" className="w-full uppercase font-black text-[10px] tracking-widest">
            Cerrar Detalle
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Diálogo de Confirmación ──────────────────────────────────────────────
interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  confirmLabel?: string;
  confirmClass?: string;
}

function ConfirmDialog({
  open, title, description, onConfirm, onCancel,
  loading, confirmLabel = 'Confirmar', confirmClass = 'bg-fg text-bg'
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="sm:max-w-sm bg-bg border border-border text-fg">
        <DialogHeader>
          <DialogTitle className="text-fg font-black uppercase tracking-tighter">{title}</DialogTitle>
          <DialogDescription className="text-muted-fg font-medium">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 mt-4">
          <Button variant="outline" onClick={onCancel} disabled={loading}
            className="border-border text-muted-fg hover:text-fg">
            Cancelar
          </Button>
          <Button onClick={onConfirm} disabled={loading} className={confirmClass}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Diálogo de Tracking ────────────────────────────────────────────
interface TrackingDialogProps {
  open: boolean;
  orderId: string;
  onClose: () => void;
}

function TrackingDialog({ open, orderId, onClose }: TrackingDialogProps) {
  const [tracking, setTracking] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!tracking.trim()) {
      toast.error('Ingresa el número de seguimiento');
      return;
    }
    setLoading(true);
    try {
      await markShipped.execute(orderId, tracking);
      toast.success('Pedido marcado como enviado');
      setTracking('');
      onClose();
    } catch (err: any) {
      toast.error(err.message ?? 'Error al actualizar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-sm bg-bg border border-border text-fg">
        <DialogHeader>
          <DialogTitle className="text-fg flex items-center gap-2 font-black uppercase tracking-tighter">
            <Truck className="w-5 h-5" /> Número de Guía
          </DialogTitle>
          <DialogDescription className="text-muted-fg font-medium">
            Ingresa el número de seguimiento para el cliente.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2">
          <input
            type="text"
            value={tracking}
            onChange={(e) => setTracking(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="GUIA-2024-XXXX"
            className="w-full bg-input-bg border border-input-border text-fg placeholder:text-muted-fg rounded-none px-4 py-2.5 text-sm focus:outline-none"
          />
        </div>
        <DialogFooter className="gap-2 mt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}
            className="border-border text-muted-fg hover:text-fg">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !tracking.trim()}
            className="bg-fg text-bg font-black uppercase text-xs">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirmar Envío'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Tarjeta de Pedido ───────────────────────────────────────────────────────
function OrderCard({ order, column }: { order: OrderEntity, column: string }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [trackingOpen, setTrackingOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const shortId = order.orderCode || order.id.slice(0, 8).toUpperCase();
  const clientName = order.shippingData?.fullName || order.userName || order.userEmail || 'Cliente';
  const courier = order.shippingData?.courier ?? '—';
  const total = order.finalTotal || order.total || 0;
  const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString('es-ES', { 
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' 
  }) : '';

  const handleConfirmPayment = async () => {
    setProcessing(true);
    try {
      await confirmPayment.execute(order.id);
      toast.success('Pago confirmado');
    } catch (err: any) {
      toast.error(err.message ?? 'Error');
    } finally {
      setProcessing(false);
      setConfirmOpen(false);
    }
  };

  return (
    <div className="bg-bg border border-border p-4 space-y-3 hover:border-fg transition-all group relative overflow-hidden">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-black text-fg text-xs flex items-center gap-1.5 uppercase tracking-tighter">
            <Hash className="w-3 h-3 opacity-30" />
            {shortId}
          </p>
          <p className="text-[10px] font-bold text-muted-fg mt-0.5 truncate uppercase flex items-center gap-2" title={clientName}>
            {clientName}
            {date && <span className="text-[8px] opacity-50 flex items-center gap-1 font-black"><Clock className="w-2.5 h-2.5" /> {date}</span>}
          </p>
        </div>
        <span className="font-black text-fg text-sm tracking-tighter">
          {formatPrice(total)}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Truck className="w-3.5 h-3.5 text-muted-fg" />
        <span className="text-[10px] text-muted-fg font-black uppercase tracking-widest">
          {courier}
          {order.shippingData?.city ? ` — ${order.shippingData.city}` : ''}
        </span>
      </div>

      <div className="bg-muted p-2.5 space-y-1">
        {order.items?.slice(0, 2).map((item: any, i: number) => (
          <div key={i} className="flex justify-between items-center text-[10px] uppercase font-bold">
            <span className="text-fg truncate max-w-[130px]">
              {item.name}
              {item.size ? <span className="opacity-40 ml-1">({item.size})</span> : ''}
            </span>
            <span className="text-muted-fg">x{item.quantity}</span>
          </div>
        ))}
        {order.items && order.items.length > 2 && (
          <p className="text-[8px] font-black text-muted-fg text-center pt-1">+{order.items.length - 2} ITEMS MÁS</p>
        )}
      </div>

      {column === 'shipped' && order.trackingNumber && (
        <div className="flex items-center gap-2 bg-fg text-bg px-2 py-1.5">
          <Package className="w-3 h-3" />
          <span className="text-[9px] font-black uppercase tracking-widest">{order.trackingNumber}</span>
        </div>
      )}

      <div className="flex flex-col gap-2 pt-1">
        <Button
          size="sm"
          variant="outline"
          className="w-full h-8 text-[9px] font-black uppercase border-border text-muted-fg hover:bg-fg hover:text-bg hover:border-fg transition-all"
          onClick={() => setDetailOpen(true)}
        >
          <Eye className="w-3 h-3 mr-1.5" /> Ver Detalle
        </Button>

        {column === 'voucher_uploaded' && (
          <>
            <Button
              size="sm"
              className="w-full h-9 text-[10px] bg-fg text-bg font-black uppercase border-2 border-fg hover:bg-bg hover:text-fg transition-all"
              onClick={() => setConfirmOpen(true)}
              disabled={processing}
            >
              {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5 mr-1.5" />}
              Confirmar Pago
            </Button>
            <ConfirmDialog
              open={confirmOpen}
              title="Confirmar Pago"
              description={`¿Has verificado el voucher por ${formatPrice(total)} de #${shortId}?`}
              onConfirm={handleConfirmPayment}
              onCancel={() => setConfirmOpen(false)}
              loading={processing}
            />
          </>
        )}

        {column === 'paid' && (
          <>
            <Button
              size="sm"
              className="w-full h-9 text-[10px] bg-fg text-bg font-black uppercase border-2 border-fg hover:bg-bg hover:text-fg transition-all"
              onClick={() => setTrackingOpen(true)}
            >
              <Truck className="w-3.5 h-3.5 mr-1.5" /> Enviar Pedido
            </Button>
            <TrackingDialog
              open={trackingOpen}
              orderId={order.id}
              onClose={() => setTrackingOpen(false)}
            />
          </>
        )}
      </div>

      <OrderDetailDialog 
        open={detailOpen} 
        order={order} 
        onClose={() => setDetailOpen(false)} 
      />
    </div>
  );
}

// ─── Columna Kanban ────────────────────────────────────────────────────
function KanbanColumn({ title, icon, orders, column }: { title: string, icon: any, orders: OrderEntity[], column: string }) {
  return (
    <div className="flex-1 min-w-[300px] max-w-[400px]">
      <div className="flex items-center gap-2.5 mb-6 px-1">
        <div className="p-1.5 bg-muted border border-border">{icon}</div>
        <h3 className="font-black text-fg text-xs uppercase tracking-widest">{title}</h3>
        <span className="ml-auto text-[10px] font-black bg-muted text-fg px-2.5 py-1 border border-border">
          {orders.length}
        </span>
      </div>

      <div className="space-y-5 max-h-[calc(100vh-280px)] overflow-y-auto pr-2 custom-scrollbar">
        {orders.length === 0 ? (
          <div className="border border-dashed border-border p-12 text-center bg-bg opacity-40">
            <p className="text-muted-fg text-[10px] font-black uppercase tracking-widest">Sin registros</p>
          </div>
        ) : (
          orders.map(order => (
            <OrderCard key={order.id} order={order} column={column} />
          ))
        )}
      </div>
    </div>
  );
}

export default function OrdersTab({ onPendingCountChange }: { onPendingCountChange?: (c: number) => void }) {
  const { orders, loading } = useOrdersAdmin();

  const voucherOrders = orders.filter(o => o.status === 'voucher_uploaded');
  const paidOrders = orders.filter(o => o.status === 'paid');
  const shippedOrders = orders.filter(o => o.status === 'shipped');

  if (onPendingCountChange) {
    onPendingCountChange(voucherOrders.length);
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-10 pb-6 border-b border-border">
        <div>
          <h2 className="text-3xl font-black text-fg uppercase tracking-tighter flex items-center gap-3">
            <ShoppingBag className="w-8 h-8" />
            Cola de Pedidos
          </h2>
          <p className="text-muted-fg text-[10px] font-black uppercase tracking-widest mt-1">Gestión logística en tiempo real</p>
        </div>
      </div>

      {loading ? (
        <div className="flex gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex-1 h-80 bg-muted animate-pulse border border-border" />
          ))}
        </div>
      ) : (
        <div className="flex gap-8 overflow-x-auto pb-6 custom-scrollbar">
          <KanbanColumn title="Verificación" icon={<CreditCard className="w-4 h-4" />} orders={voucherOrders} column="voucher_uploaded" />
          <KanbanColumn title="Procesando" icon={<CheckCircle className="w-4 h-4" />} orders={paidOrders} column="paid" />
          <KanbanColumn title="Despachado" icon={<Truck className="w-4 h-4" />} orders={shippedOrders} column="shipped" />
        </div>
      )}
    </div>
  );
}
