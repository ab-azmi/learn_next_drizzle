import z from 'zod';

const paymentCartSchema = z.object({
    quantity: z.number(),
    productID: z.number(),
    title: z.string(),
    price: z.number(),
    image: z.string(),
})

export const paymentIntentSchema = z.object({
    amount: z.number(),
    currency : z.string(),
    cart: z.array(paymentCartSchema),
})