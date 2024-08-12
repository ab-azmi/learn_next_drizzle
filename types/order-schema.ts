import z from 'zod';

export const productSchema = z.object({
    productID: z.number(),
    variantID: z.number(),
    quantity: z.number(),
})

export const orderSchema = z.object({
    total: z.number(),
    status: z.string(),
    products: z.array(productSchema)
})