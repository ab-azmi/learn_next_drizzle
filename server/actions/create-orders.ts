'use server'

import { orderSchema } from "@/types/order-schema";
import { createSafeActionClient } from "next-safe-action"
import { auth } from "../auth";
import { db } from "..";
import { orders } from "../schema";

const action = createSafeActionClient();

export const createOrder = action
    .schema(orderSchema)
    .action(async ({parsedInput: {products, status, total}}) => {
        const user = await auth();
        if(!user) return {error: 'user not found'};

        const order = await db.insert(orders).values({
            status,
            total,
            userID: user.user.id,
        }).returning()

        const orderProducts = products.map(async ({productID, quantity, variantID}: {productID:number, quantity:number, variantID:number}) => {
            const orderProduct = await db.insert(orderProducts).values({
                quantity,
                orderID: order[0].id,
                productID: productID,
                variantID: variantID,
            })
        })
        return {success: 'order created successfully'}
    })