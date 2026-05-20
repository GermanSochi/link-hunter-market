import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartProduct = {
  id: string;
  title: string;
  priceCents: number;
  category: string;
  images: { url: string; alt?: string }[];
  slug: string;
};

export type TCartItem = {
  product: CartProduct;
};

type TCartState = {
  items: TCartItem[];
  addItem: (product: CartProduct) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

export const useCart = create<TCartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) =>
        set((state) => ({ items: [...state.items, { product }] })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== id),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
