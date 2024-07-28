"use server"

import { createSafeActionClient } from "next-safe-action"
import { z } from "zod";
import { products } from "../schema";
import { db } from "..";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const schema = z.object({id: z.number()});

const action = createSafeActionClient();

export const deleteProduct = action
    .schema(schema)
    .action(async ({parsedInput: {id}}) => {
        try {
            const data = await db.delete(products).where(
                eq(products.id, id)
            ).returning();

            revalidatePath('/dashboard/products');
            return {
                success: `Product with title ${data[0].title} has been deleted`,
            }
        } catch (error) {
            return {error: 'Failed to delete product'};
        }
    })  