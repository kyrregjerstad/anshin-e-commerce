import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  devtools((set) => ({
    items: [],
    addItem: (item) =>
      set((state) => ({
        items: [...state.items, item],
      })),
    removeItem: (itemId) =>
      set((state) => ({
        items: state.items.filter((item) => item.id !== itemId),
      })),
    updateItemQuantity: (itemId, quantity) =>
      set((state) => ({
        items: state.items.map((item) =>
          item.id === itemId ? { ...item, quantity: quantity } : item
        ),
      })),
    clearCart: () => set({ items: [] }),
  }))
);
