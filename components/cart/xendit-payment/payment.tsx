"use client"

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/client-store";
import { db } from "@/server";
import { updateStatusOrder } from "@/server/actions/update-status-order";
import { createXenditInvoice } from "@/server/actions/xendit/invoice";
import { auth } from "@/server/auth";
import { orders } from "@/server/schema";
import { and, eq } from "drizzle-orm";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function XenditPayment(
    { totalPrice }: { totalPrice: number }
) {
    const router = useRouter();
    const { cart, unpayedInvoice, clearCart } = useCartStore();

    const handlePay = async () => {
        if (unpayedInvoice.url !== '') {
            router.push(unpayedInvoice.url);
        }
    }



    return (
        <Button
            onClick={handlePay}
            type="submit"
            className=" my-4 w-full">
            Go to payment
        </Button>
    )
}