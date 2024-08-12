'use client'

import { useCartStore } from "@/lib/client-store"
import { motion } from 'framer-motion';
import { DrawerDescription, DrawerTitle } from "../ui/drawer";
import { ArrowLeft } from "lucide-react";

export default function CartMessage(){
    const {checkoutProgress, setCheckoutProgress} = useCartStore()
    console.log(checkoutProgress)
    return (
        <motion.div className="flex flex-col items-center"
            animate={{ opacity:1, x:0 }}
            initial={{ opacity:0, x:10 }}>
                <DrawerTitle>
                    {checkoutProgress === "cart-page" && "Cart Items"}
                    {checkoutProgress === "payment-page" && "Payment Method"}
                    {checkoutProgress === "confirmation-page" && "Confirmation"}
                </DrawerTitle>
                <DrawerDescription className="py-1">
                    {checkoutProgress === "cart-page" && "Review your cart items"}
                    {checkoutProgress === "payment-page" && (
                        <span 
                            onClick={() => setCheckoutProgress("cart-page")}
                            className="flex items-center justify-center gap-1 cursor-pointer hover:text-primary">
                            <ArrowLeft size={14}/>
                            Back to cart
                        </span>
                    )}
                    {checkoutProgress === "confirmation-page" && "Confirm your order"}
                </DrawerDescription>
        </motion.div>
    )
}