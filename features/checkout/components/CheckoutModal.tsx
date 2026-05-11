
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useCheckoutStore } from '../store/checkout.store';
import { ShippingForm } from './ShippingForm';
import { VoucherUpload } from './VoucherUpload';
import { useCheckout } from '../hooks/use-checkout';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { Check, Loader2, MapPin, CreditCard, Send } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { step, reset, shippingData, prevStep } = useCheckoutStore();
  const { confirmCheckout, loading, total, items } = useCheckout();

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleConfirm = async () => {
    try {
      await confirmCheckout();
      handleClose();
    } catch (e) {
      // Error manejado en el hook
    }
  };

  const steps = [
    { id: 'shipping', label: 'Envío', icon: MapPin },
    { id: 'payment', label: 'Pago', icon: CreditCard },
    { id: 'confirm', label: 'Confirmar', icon: Send },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden bg-bg border border-border rounded-none shadow-none">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-black text-fg uppercase tracking-tighter">Finalizar Compra</DialogTitle>
          <DialogDescription className="text-muted-fg font-bold text-xs uppercase tracking-widest">
            Completa los detalles de tu pedido
          </DialogDescription>
        </DialogHeader>

        {/* Stepper */}
        <div className="px-6 py-4 flex items-center justify-between bg-muted border-y border-border">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isActive = step === s.id;
            const isCompleted = steps.findIndex(x => x.id === step) > idx;

            return (
              <div key={s.id} className="flex items-center flex-1 last:flex-initial">
                <div className={`
                  flex flex-col items-center gap-1.5 transition-all duration-300
                  ${isActive ? 'scale-100' : 'opacity-40'}
                `}>
                  <div className={`
                    w-10 h-10 rounded-none border flex items-center justify-center transition-colors
                    ${isCompleted || isActive ? 'bg-fg text-bg border-fg' : 'bg-bg text-muted-fg border-border'}
                  `}>
                    {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-[8px] font-black uppercase tracking-widest ${isActive ? 'text-fg' : 'text-muted-fg'}`}>
                    {s.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className="flex-1 h-[1px] mx-4 bg-border relative -top-3">
                    <div className={`h-full bg-fg transition-all duration-500 ${isCompleted ? 'w-full' : 'w-0'}`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-6 pt-2 max-h-[70vh] overflow-y-auto">
          {step === 'shipping' && <ShippingForm />}
          
          {step === 'payment' && <VoucherUpload />}

          {step === 'confirm' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-muted border border-border p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-fg uppercase tracking-widest">Resumen del Pedido</span>
                  <span className="text-[9px] font-black text-muted-fg uppercase">{items.length} ítems</span>
                </div>
                
                <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-[10px] font-bold uppercase text-fg">
                      <span>{item.name} x{item.quantity} {item.size ? `(${item.size})` : ''}</span>
                      <span className="font-black">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-border flex justify-between items-center text-fg">
                  <span className="text-sm font-black uppercase tracking-tighter">Total</span>
                  <span className="text-2xl font-black tracking-tighter">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[10px]">
                <div className="space-y-1">
                  <span className="text-muted-fg font-black uppercase tracking-widest">Envío</span>
                  <p className="font-black text-fg leading-tight uppercase">
                    {shippingData.courier}<br/>
                    <span className="font-bold text-muted-fg">{shippingData.address}, {shippingData.city}</span>
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-fg font-black uppercase tracking-widest">Pago</span>
                  <div className="flex items-center gap-2 text-fg font-black uppercase">
                    <Check className="w-3 h-3" /> Listo
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={prevStep}
                  className="flex-1 font-black uppercase text-[10px] h-12"
                  disabled={loading}
                >
                  Volver
                </Button>
                <Button 
                  onClick={handleConfirm}
                  disabled={loading}
                  className="flex-[2] bg-fg text-bg hover:opacity-80 font-black text-sm uppercase tracking-widest h-12"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <Send className="w-5 h-5 mr-2" />
                  )}
                  Confirmar Pedido
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
