"use client"

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/client-store";
import { createXenditInvoice } from "@/server/actions/xendit/invoice";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function XenditPayment(
    { totalPrice }: { totalPrice: number }
) {
    const router = useRouter();
    const { cart, setCheckoutProgress, clearCart } = useCartStore();
    const [paymentMethod, setPaymentMethod] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createXenditInvoice({
            amount: totalPrice,
            currency: 'IDR',
            paymentMethod,
            cart: cart.map(item => ({
                quantity: item.variant.quantity,
                productID: item.id,
                title: item.name,
                price: item.price,
                image: item.image
            }))
        })
        .then((res) => {
            if(res?.data?.success) {
                // clearCart()
                // setCheckoutProgress('confirmation-page')
                router.push(res.data.success.invoiceUrl)
                return
            }
        })
        
    }

    return (
        <form onSubmit={handleSubmit}>
            
            <Button
                type="submit"
                className=" my-4 w-full">
                XenPay
            </Button>
        </form>
    )
}