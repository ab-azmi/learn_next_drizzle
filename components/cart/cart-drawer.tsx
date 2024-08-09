'use client'

import { useCartStore } from "@/lib/client-store"
import { ShoppingCart } from "lucide-react";

export default function CartDrawer() {
    const {cart} = useCartStore();

    return (
        <div>
            <ShoppingCart/>
        </div>
    )
}