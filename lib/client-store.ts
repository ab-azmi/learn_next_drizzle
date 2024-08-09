import { create } from 'zustand';

export type Variant = {
    variantID: number;
    quantity: number;
}

export type CartItem = {
    name: string;
    image: string;
    id: number;
    variant: Variant;
    price: number;
}

export type CartState = {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
}

export const useCartStore = create<CartState>((set) => ({
    cart: [],
    addToCart: (item) => set((state) => {
        const existingItem = state.cart.find((cartItem) => cartItem.id === item.id && cartItem.variant.variantID === item.variant.variantID);
        if (existingItem) {
            existingItem.variant.quantity += item.variant.quantity;
            return { cart: [...state.cart] };
        }
        return { cart: [...state.cart, item] };
    })
}))