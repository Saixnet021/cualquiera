
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartStore {
    items: CartItem[];
    addItem: (product: Product, size?: string, stock?: number) => void;
    removeItem: (productId: string, size?: string) => void;
    updateQuantity: (productId: string, quantity: number, size?: string) => void;
    clearCart: () => void;
    getTotal: () => number;
}

export const useCart = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (product, size, stock) =>
                set((state) => {
                    const existingItem = state.items.find(
                        (item) => item.id === product.id && item.size === size
                    );

                    const currentQuantity = existingItem ? existingItem.quantity : 0;
                    
                    if (stock !== undefined && currentQuantity + 1 > stock) {
                        throw new Error('Stock insuficiente');
                    }

                    if (existingItem) {
                        return {
                            items: state.items.map((item) =>
                                item.id === product.id && item.size === size
                                    ? { ...item, quantity: item.quantity + 1 }
                                    : item
                            ),
                        };
                    }
                    return { items: [...state.items, { ...product, quantity: 1, ...(size ? { size } : {}) }] };
                }),
            removeItem: (productId, size) =>
                set((state) => ({
                    items: state.items.filter(
                        (item) => !(item.id === productId && item.size === size)
                    ),
                })),
            updateQuantity: (productId, quantity, size) =>
                set((state) => ({
                    items: state.items.map((item) =>
                        (item.id === productId && item.size === size) 
                            ? { ...item, quantity } 
                            : item
                    ),
                })),
            clearCart: () => set({ items: [] }),
            getTotal: () => {
                const { items } = get();
                return items.reduce((total, item) => total + item.price * item.quantity, 0);
            },
        }),
        {
            name: 'pedro-sms-cart',
        }
    )
);
