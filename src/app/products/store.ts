import { create } from "zustand";
import { product } from "@/schemas/zod";
import { z } from "zod";
import { getProducts } from "./actions";

interface ProductsStore {
  products: z.infer<typeof product>[];
  setProducts: (products: z.infer<typeof product>[]) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  fetchProducts: (userId: string) => Promise<void>;
}

export const useProductsStore = create<ProductsStore>((set) => ({
  products: [],
  setProducts: (products: z.infer<typeof product>[]) => set({ products }),
  isLoading: false,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  fetchProducts: async (userId: string) => {
    set({ isLoading: true });
    const products = await getProducts(userId);
    console.log(products);
    // set({ products });
    set({ isLoading: false });
  },
}));
