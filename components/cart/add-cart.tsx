'use client'

import { useCartStore } from "@/lib/client-store"
import { useState } from "react";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { redirect, useSearchParams } from "next/navigation";

export default function AddCart() {
    const { addToCart } = useCartStore();
    const [quantity, setQuantity] = useState<number>(1);
    const params = useSearchParams();
    const id = Number(params.get('id'));
    const productID = Number(params.get('productID'));
    const title = params.get('title');
    const type = params.get('type');
    const price = Number(params.get('price'));
    const image = params.get('image');

    if (!id || !productID || !title || !type || !price || !image) {
        toast.error('Invalid product');
        return redirect('/');
    }

    return (
        <>
            <div className="flex items-center gap-4 justify-stretch my-4">
                <Button disabled={quantity <= 1} variant={'secondary'} className="text-primary" onClick={() => setQuantity(quantity - 1)}>
                    <Minus size={16} strokeWidth={3} />
                </Button>
                <h1>{quantity}</h1>
                <Button variant={'secondary'} className="text-primary" onClick={() => setQuantity(quantity + 1)}>
                    <Plus size={16} strokeWidth={3} />
                </Button>
            </div>
            <Button onClick={() => {
                toast.success('Added to cart');
                addToCart({
                    id: productID,
                    variant: {
                        variantID: id,
                        quantity
                    },
                    name: title + ' ' + type,
                    image: image,
                    price
                })
            }}>Add to cart</Button>
        </>
    )
}