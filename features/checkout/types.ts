
export type CheckoutStep = 'shipping' | 'payment' | 'confirm';

export type Courier = 'Shalom' | 'Olva' | 'Otro';

export interface ShippingData {
  fullName: string;
  dni: string;
  address: string;
  city: string;
  courier: Courier;
  phone: string;
}

export interface CheckoutState {
  step: CheckoutStep;
  shippingData: ShippingData;
  voucherUrl: string;
  orderId: string | null;
}
