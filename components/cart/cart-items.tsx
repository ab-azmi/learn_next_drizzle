'use client'

import { useCartStore } from "@/lib/client-store"
import { useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { formatPrice } from "@/lib/format-price";
import Image from "next/image";
import { MinusCircle, PlusCircle } from "lucide-react";

export default function CartItems() {
    const { cart, addToCart, removeFromCart } = useCartStore();
    const totalPrice = useMemo(() => {
        return cart.reduce((acc, item) => acc + item.price! * item.variant.quantity, 0)
    }, [cart])

    return (
        <div className="w-full">
            {cart.length === 0 && (
                <div className="my-1 flex justify-center">
                    <h1>Cart is Empty</h1>
                </div>
            )}
            {cart.length > 0 && (
                <div className="w-full">
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
                                <TableRow key={item.id}>
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
        </div>
    )
}