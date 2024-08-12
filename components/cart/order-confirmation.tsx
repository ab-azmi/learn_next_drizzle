'use client'

import Link from "next/link"
import { Button } from "../ui/button"
import { useCartStore } from "@/lib/client-store"
import Lottie from 'lottie-react'
import orderConfirmed from '@/public/order-confirmed.json'
import {motion} from 'framer-motion'

export default function OrderConfirmation(){
    const {setCheckoutProgress, setCartOpen} = useCartStore()
    return (
        <div className="flex flex-col items-center gap-4">
            <h2 className="text-2xl font-medium">Thank you for your confirmation</h2>
            <motion.div
                animate={{ opacity:1,scale:1 }}
                initial={{ opacity:0, scale:0 }}
                transition={{ delay: 0.25 }}>
                <Lottie className="h-48 my-4" animationData={orderConfirmed} />
            </motion.div>
            <Link href={'/dashboard/orders'}>
                <Button onClick={() => {
                    setCheckoutProgress('cart-page')
                    setCartOpen(false)
                }}>
                    View your order
                </Button>
            </Link>
        </div>
    )
}