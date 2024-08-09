import z from 'zod'

export const reviewSchema = z.object({
    rating: z.number().int().min(1).max(5),
    comment: z.string().min(10)
})

export const reviewSchemaDefaultValues = {
    rating: 1,
    comment: ''
}