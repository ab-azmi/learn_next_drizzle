import * as z from 'zod'

export const RegisterSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address"
    }).max(255).min(3),
    password: z.string().min(8).max(255).min(3),
    name: z.string().min(4).max(255)
})

export const registerDefaultValues = {
    email: "",
    password: "",
    name: ""
}