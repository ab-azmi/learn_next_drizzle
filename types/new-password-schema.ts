import { z } from "zod";

export const newPasswordSchema = z.object({
    password: z.string().min(8),
    token: z.string().nullable().optional()
});

export const newPasswordSchemaDefaultValues = {
    password: '',
    token: ''
}