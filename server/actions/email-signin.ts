"use server"

import { loginSchema } from "@/types/login-schema"
import { createSafeActionClient } from "next-safe-action"
import { db } from ".."
import { eq } from "drizzle-orm"
import { users } from "@/server/schema"

const action = createSafeActionClient()

const emailSignIn = action
    .schema(loginSchema)
    .action(async ({parsedInput: {email, password, code}}) => {
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email)
        })

        if(existingUser?.email !== email){
            return {error: "Email not found"}
        }

        return {success: 'berhasil login!'}
    })

export default emailSignIn