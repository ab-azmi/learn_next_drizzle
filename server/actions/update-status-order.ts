'use server'

import { orderSchema, updateStatusOrderSchema } from "@/types/order-schema";
import { createSafeActionClient } from "next-safe-action"
import { auth } from "../auth";
import { db } from "..";
import { orderProduct, orders } from "../schema";
import { eq } from "drizzle-orm";

const action = createSafeActionClient();

export const updateStatusOrder = action
    .schema(updateStatusOrderSchema)
    .action(async ({parsedInput: {status, invoiceID}}) => {
        const user = await auth();
        if(!user) return {error: 'user not found'};

        const existingOrder = await db.query.orders.findFirst({
            where: eq(orders.invoiceID, invoiceID)
        });

        if(!existingOrder) return {error: 'order not found'};

        const order = await db.update(orders).set({
            status,
        }).where(eq(orders.id, existingOrder.id)).returning();

        return {success: 'order updated successfully'}
    })