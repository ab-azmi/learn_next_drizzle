'use client'

import { useCartStore } from "@/lib/client-store"
import { useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { formatPrice } from "@/lib/format-price";
import Image from "next/image";
import { MinusCircle, PlusCircle } from "lucide-react";
import { AnimatePresence, motion } from 'framer-motion';
import Lottie from 'lottie-react'
import emptyCart from '@/public/empty-box.json'
import { createId } from '@paralleldrive/cuid2'
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { createXenditInvoice } from "@/server/actions/xendit/invoice";

export default function CartItems() {
    const { cart, addToCart, removeFromCart, setCheckoutProgress, setUnpayedInvoice } = useCartStore();
    const totalPrice = useMemo(() => {
        return cart.reduce((acc, item) => acc + item.price! * item.variant.quantity, 0)
    }, [cart])


    const priceLetters = useMemo(() => {
        return [...formatPrice(totalPrice)].map(letter => {
            return { letter, id: createId() }
        })
    }, [totalPrice])

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createXenditInvoice({
            amount: totalPrice,
            currency: 'IDR',
            cart: cart.map(item => ({
                quantity: item.variant.quantity,
                productID: item.id,
                title: item.name,
                price: item.price,
                image: item.image
            }))
        })
            .then((res) => {
                if (res?.data?.success) {
                    // clearCart()
                    setCheckoutProgress('payment-page')
                    setUnpayedInvoice(res.data.success.invoiceUrl, res.data.success.externalId)
                    router.push(res.data.success.invoiceUrl)
                    return
                }
            })

    }

    return (
        <motion.div className="w-full flex flex-col items-center">
            {cart.length === 0 && (
                <div className="my-1 flex-col w-full justify-center flex items-center">
                    <motion.div
                        animate={{ opacity: 1 }}
                        initial={{ opacity: 0 }}
                        transition={{ delay: 0.3 }}>
                        <h2 className="text-2xl text-muted-foreground text-center">
                            Cart is Empty
                        </h2>
                        <Lottie animationData={emptyCart} className="h-64" />
                    </motion.div>
                </div>
            )}
            {cart.length > 0 && (
                <div className="max-w-4xl mx-auto max-h-80 overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableCell>Product</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Image</TableCell>
                                <TableCell>Quantity</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {cart.map((item) => (
                                <TableRow key={`${item.id}-${item.variant.variantID}`}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{formatPrice(item.price)}</TableCell>
                                    <TableCell>
                                        <div>
                                            <Image className="rounded-md" width={48} height={48} src={item.image} alt={item.name} priority />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-between">
                                            <MinusCircle
                                                className="cursor-pointer hover:text-muted-foreground duration-300 transition-colors"
                                                size={14}
                                                onClick={() => {
                                                    removeFromCart({
                                                        ...item,
                                                        variant: {
                                                            quantity: 1,
                                                            variantID: item.variant.variantID
                                                        }
                                                    })
                                                }} />
                                            <p className="text-medium font-bold">{item.variant.quantity}</p>
                                            <PlusCircle
                                                className="cursor-pointer hover:text-muted-foreground duration-300 transition-colors"
                                                size={14}
                                                onClick={() => {
                                                    addToCart({
                                                        ...item,
                                                        variant: {
                                                            quantity: 1,
                                                            variantID: item.variant.variantID
                                                        }
                                                    })
                                                }} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
            {cart.length > 0 && (
                <motion.div className="flex my-4 items-center justify-center overflow-hidden relative">
                    <span className="text-md">Total: </span>
                    <AnimatePresence mode="popLayout">
                        {priceLetters.map((letter, i) => (
                            <motion.div key={letter.id}>
                                <motion.span
                                    initial={{ y: 20 }}
                                    animate={{ y: 0 }}
                                    exit={{ y: -20 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="text-md inline-block">
                                    {letter.letter}
                                </motion.span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
            <form onSubmit={handleSubmit}>
                {cart.length > 0 && (
                    <Button
                        type="submit"
                        disabled={cart.length === 0} className="max-w-md w-full">
                        Choose Payment Method
                    </Button>
                )}
            </form>
        </motion.div>
    )
}