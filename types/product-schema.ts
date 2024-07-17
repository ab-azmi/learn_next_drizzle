import { z } from "zod";

export const ProductSchema = z.object({
    id: z.number().optional(), //for edit mode
    title: z.string().min(5).max(200),
    description: z.string().min(40),
    price: z.coerce.number().min(0, {
        message: "Price must be a positive number",
    }),
})

export const ProductSchemaDefaultValues = {
    title: "",
    description: "",
    price: 0,
}