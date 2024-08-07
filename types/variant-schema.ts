import z from "zod";

export const VariantSchema = z.object({
    productID: z.number(),
    id: z.number().optional(),
    editMode: z.boolean(),
    productType: z.string().min(3),
    color: z.string().min(3),
    tags: z.array(z.string()).min(1),
    variantImages: z.array(z.object({
        url: z.string().refine((url) => url.search('blob:') !== 0, {
            message: 'Please wait for image to upload'
        }),
        size: z.number(),
        key: z.string().optional(),
        id: z.number().optional(),
        name: z.string(),
    })).min(1)
})

export const VariantSchemaDefaultValues = {
    productID: undefined,
    id: undefined,
    editMode: false,
    productType: 'Black Notebook',
    color: '#000000',
    tags: [],
    variantImages: []
}