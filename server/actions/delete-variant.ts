"use server"

import { createSafeActionClient } from "next-safe-action"
import z from "zod";
import { db } from "..";
import { productVariants } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const action = createSafeActionClient();

const deleteVariantSchema = z.object({
    id: z.number(),
});

export const deleteVariant = action
    .schema(deleteVariantSchema)
    .action(async ({parsedInput: {id}}) => {
        try {
            const deletedVariant = await db.delete(productVariants)
                .where(eq(productVariants.id, id)).returning();

            revalidatePath('dashboard/products')
            return {success: `Deleted ${deletedVariant[0].productType}`}
        } catch (error) {
            return {error: 'Failed to delete variant'}   
        }
    })