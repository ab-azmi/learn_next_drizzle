"use server"

import { loginSchema } from "@/types/login-schema"
import { createSafeActionClient } from "next-safe-action"

const action = createSafeActionClient()

const emailSignIn = action
    .schema(loginSchema)
    .action(async ({parsedInput: {email, password, code}}) => {
        console.log(email);
        return {success: 'anjing lu berhasil login!'}
    })

export default emailSignIn