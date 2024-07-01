import * as z from 'zod';

export const loginSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address"
    }).max(255).min(3),
    password: z.string().min(8).max(255).min(3),
    code: z.optional(z.string())
})

export const loginDefaultValues = {
    email: "",
    password: "",
    code: ""
}