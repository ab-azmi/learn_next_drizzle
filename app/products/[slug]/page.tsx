import ProductPick from "@/components/products/product-pick";
import ProductShowcase from "@/components/products/product-showcase";
import ProductType from "@/components/products/product-type";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/format-price";
import { db } from "@/server"
import { productVariants } from "@/server/schema"
import { eq } from "drizzle-orm";

export async function generateStaticParams() {
    const data = await db.query.productVariants.findMany({
        with: {
            variantImages: true,
            variantTags: true,
            product: true
        },
        orderBy: (productVariants, { desc }) => [desc(productVariants.id)]
    })

    if (data) {
        const slugID = data.map((variant) => ({ slug: variant.id.toString() }))
        return slugID;
    }

    return []
}

export default async function Page({params}: {params: {slug: string}}) {
    const variant = await db.query.productVariants.findFirst({
        where: eq(productVariants.id, Number(params.slug)),
        // variant
        with: {product: {
            // with products
            with:{
                // with variants
                productVariants: {
                    // with images and tags and product again
                    with: {
                        variantImages: true,
                        variantTags: true,
                        product: true
                    }
                }
            }
        }}
    })

    if(!variant){
        return null;
    }

    return (
        <main>
            <section className="flex flex-col lg:flex-row gap-4 lg:gap-12">
                <div className="flex-1">
                    <ProductShowcase variants={variant.product.productVariants}/>
                </div>
                <div className="flex gap-2 flex-col flex-1">
                    <h1 className="text-2xl font-bold">{variant?.product.title}</h1>
                    <div>
                        <ProductType variants={variant.product.productVariants}/>
                    </div>
                    <Separator className="my-2"/>
                    <p className="text-2xl font-medium py-2">
                        {formatPrice(variant.product.price)}
                    </p>
                    <div dangerouslySetInnerHTML={{ __html: variant.product.description }}>
                    </div>
                    <p className="text-secondary-foreground font-medium my-2">
                        Availabel Colors
                    </p>
                    <div className="flex gap-4">
                        {variant.product.productVariants.map((vari) => (
                            <ProductPick 
                                key={vari.id} 
                                productID={vari.productID}
                                productType={vari.productType}
                                id={vari.id}
                                color={vari.color}
                                price={vari.product.price}
                                title={vari.product.title}
                                image={vari.variantImages[0].url}/>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    )
}