"use server"

import { ProductSchema } from "@/types/product-schema";
import { eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action"
import { products } from "../schema";
import { db } from "..";

const action = createSafeActionClient();

export const createProduct = action
    .schema(ProductSchema)
    .action(async ({parsedInput: {title, description, price, id}}) => {
        try {
            if(id){
                // If iD exist, Create a new product
                const currentProduct = await db.query.products.findFirst({
                    where: eq(products.id, id)
                })

                if(!currentProduct){
                    return {error: 'Product not found'}
                }

                const newProduct = await db
                    .update(products)
                    .set({description, price, title})
                    .where(eq(products.id, id))
                    .returning()

                return {success: `Product ${newProduct[0].title} has been updated`}
            }
            if(!id){
                // If iD does not exist, Create a new product
                const newProduct = await db
                    .insert(products)
                    .values({description, price, title})
                    .returning()

                return {success: `Product ${newProduct[0].title} has been created`}
            }
        } catch (error) {
            
        }
    })