'use client'

import { useCartStore } from "@/lib/client-store"
import { ShoppingCart } from "lucide-react";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer";
import { AnimatePresence, motion } from "framer-motion";
import CartItems from "./cart-items";

export default function CartDrawer() {
    const { cart } = useCartStore();

    return (
        <div>
            <Drawer>
                <DrawerTrigger>
                    <div className="relative px-2">
                        <AnimatePresence>
                            {cart.length > 0 && (
                                <motion.span
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    className="text-xs absolute -top-2 -right-2 bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center">
                                    {cart.length}
                                </motion.span>
                            )}
                        </AnimatePresence>
                        <ShoppingCart />
                    </div>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader className="flex flex-col justify-center items-center">
                        <DrawerTitle>Cart Items</DrawerTitle>
                        <DrawerDescription>
                            Items in your cart
                        </DrawerDescription>
                        <CartItems />
                    </DrawerHeader>
                </DrawerContent>
            </Drawer>
        </div>
    )
}