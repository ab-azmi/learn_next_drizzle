import z from 'zod';

export const productSchema = z.object({
    productID: z.number(),
    variantID: z.number(),
    quantity: z.number(),
})

export const orderSchema = z.object({
    id: z.number().optional(),
    total: z.number(),
    status: z.string(),
    paymentIntentID: z.string(),
    products: z.array(productSchema),
    invoiceID: z.string(),
})

export const updateStatusOrderSchema = z.object({
    status: z.string(),
    invoiceID: z.string(),
})