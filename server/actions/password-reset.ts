"use server"

import { ResetSchema } from "@/types/reset-schema"
import { eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action"
import { db } from "..";
import { users } from "../schema";
import { generatePasswordResetToken } from "./tokens";
import { sendPassowrdResetEmail } from "./email";

const action = createSafeActionClient();

const resetPassword =  action
    .schema(ResetSchema)
    .action(async ({parsedInput: {email}}) => {
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email)
        });
        if(!existingUser){
            return {error: 'User not found'}
        }

        //generate password reset token
        const passwordResetToken = await generatePasswordResetToken(email);

        if(!passwordResetToken){
            return {error: 'Failed to generate password reset token'}
        }

        //send password reset email
        await sendPassowrdResetEmail(passwordResetToken[0].email, passwordResetToken[0].token);

        return {success: 'Password reset email sent'}
    })

export default resetPassword