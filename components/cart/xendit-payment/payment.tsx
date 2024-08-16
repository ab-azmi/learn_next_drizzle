"use client"

import { Button } from "@/components/ui/button";
import { createXenditInvoice } from "@/server/actions/xendit/invoice";
import { useRouter } from "next/navigation";

export default function XenditPayment() {
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await createXenditInvoice({
            amount: 10000,
            currency: 'usd',
            cart: []
        })
        
        if(res?.data?.success) {
            router.push(res.data.success.invoiceUrl)
            return
        }
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