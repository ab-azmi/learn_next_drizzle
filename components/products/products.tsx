"use client"

import { VariantsWithImagesTags, VariantsWithProduct } from "@/lib/infer-types"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "../ui/badge"
import { formatPrice } from "@/lib/format-price"

type ProductTypes = {
    variants: VariantsWithProduct[]
}

export default function Products({variants}: ProductTypes){
    return (
        <main className="grid sm:grid-cols-1 md:grid-cols-2 gap-12 lg:grid-cols-3">
            {variants.map((variant) => (
                <Link 
                    key={variant.id} 
                    href={`/products/${variant.id}?id=${variant.id}&productID=${variant.productID}&price=${variant.product.price}&title=${variant.product.title}&type=${variant.productType}&image=${variant.variantImages[0].url}&color=${variant.color}`}>
                        <Image src={variant.variantImages[0].url} className="rounded-md pb-2" alt={variant.productType} width={720} height={480} loading="lazy"/>

                        <div className="flex justify-between">
                            <div className="font-medium">
                                <h2>{variant.product.title}</h2>
                                <p className="text-sm text-muted-foreground">
                                    {variant.productType}
                                </p>
                            </div>
                            <div>
                                <Badge className="text-sm" variant={'secondary'}>
                                    {formatPrice(variant.product.price)}
                                </Badge>
                            </div>
                        </div>
                </Link>
            ))}
        </main>
    )
}