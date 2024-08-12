import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
    checkoutProgress: "cart-page" | "payment-page" | "confirmation-page";
    setCheckoutProgress: (progress: "cart-page" | "payment-page" | "confirmation-page") => void;
    addToCart: (item: CartItem) => void;
    removeFromCart: (item: CartItem) => void;
    clearCart: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
    (set) => ({
        cart: [],
        checkoutProgress: "confirmation-page",
        setCheckoutProgress: (progress) => set({ checkoutProgress: progress }),
        addToCart: (item) => 
            set((state) => {
                // Check if the item is already in the cart
            const existingItem = state.cart.find((cartItem) => cartItem.id === item.id && cartItem.variant.variantID === item.variant.variantID);
            if (existingItem) {
                // If the item is already in the cart, increase the quantity
                existingItem.variant.quantity += item.variant.quantity;
                return { cart: [...state.cart] };
            }
            // If the item is not in the cart, add it
            return { cart: [...state.cart, item] };
        }),
        removeFromCart: (item) =>
            set((state) => {
                const existingItem = state.cart.find((cartItem) => cartItem.id === item.id && cartItem.variant.variantID === item.variant.variantID);
                if (existingItem) {
                    if (existingItem.variant.quantity > 1) {
                        existingItem.variant.quantity -= 1;
                        return { cart: [...state.cart] };
                    }
                    return { cart: state.cart.filter((cartItem) => cartItem.id !== item.id && cartItem.variant.variantID !== item.variant.variantID) };
                }
                return { cart: state.cart };
            }),
        clearCart: () => set({ cart: [] }),
}), {name: 'cart-store'})

)