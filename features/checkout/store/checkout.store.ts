
import { create } from 'zustand';
import { CheckoutStep, ShippingData, CheckoutState } from '../types';

interface CheckoutActions {
  setStep: (step: CheckoutStep) => void;
  setShippingData: (data: ShippingData) => void;
  setVoucherUrl: (url: string) => void;
  setOrderId: (id: string) => void;
  reset: () => void;
  nextStep: () => void;
  prevStep: () => void;
}

const INITIAL_SHIPPING_DATA: ShippingData = {
  fullName: '',
  dni: '',
  address: '',
  city: '',
  courier: 'Shalom',
  phone: '',
};

export const useCheckoutStore = create<CheckoutState & CheckoutActions>((set, get) => ({
  step: 'shipping',
  shippingData: INITIAL_SHIPPING_DATA,
  voucherUrl: '',
  orderId: null,

  setStep: (step) => set({ step }),
  setShippingData: (shippingData) => set({ shippingData }),
  setVoucherUrl: (voucherUrl) => set({ voucherUrl }),
  setOrderId: (orderId) => set({ orderId }),
  
  reset: () => set({ 
    step: 'shipping', 
    shippingData: INITIAL_SHIPPING_DATA, 
    voucherUrl: '', 
    orderId: null 
  }),

  nextStep: () => {
    const { step } = get();
    if (step === 'shipping') set({ step: 'payment' });
    else if (step === 'payment') set({ step: 'confirm' });
  },

  prevStep: () => {
    const { step } = get();
    if (step === 'confirm') set({ step: 'payment' });
    else if (step === 'payment') set({ step: 'shipping' });
  },
}));
