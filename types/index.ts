export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: string;

  createdAt: Date;
  variants?: { size: string; stock: number }[];
}

export interface CartItem extends Product {
  quantity: number;
  size?: string;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  purchaseCount: number;
  totalSpent: number;
  createdAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  items: CartItem[];
  total: number;
  discount: number;
  finalTotal: number;
  status: 'pending' | 'approved' | 'rejected';
  whatsappSent: boolean;
  createdAt: Date;
}
