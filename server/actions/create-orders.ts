'use server'

import { orderSchema } from "@/types/order-schema";
import { createSafeActionClient } from "next-safe-action"
import { auth } from "../auth";
import { db } from "..";
import { orderProduct, orders } from "../schema";

const action = createSafeActionClient();

export const createOrder = action
    .schema(orderSchema)
    .action(async ({parsedInput: {products, status, total, paymentIntentID}}) => {
        const user = await auth();
        if(!user) return {error: 'user not found'};

        const order = await db.insert(orders).values({
            status,
            paymentIntentID,
            total,
            userID: user.user.id,
        }).returning()

        const productMap = products.map(async ({productID, quantity, variantID}: {productID:number, quantity:number, variantID:number}) => {
            const neworderProduct = await db.insert(orderProduct).values({
                quantity,
                orderID: order[0].id,
                productID: productID,
                productVariantID: variantID,
            }).returning()
        })
        return {success: 'order created successfully'}
    })