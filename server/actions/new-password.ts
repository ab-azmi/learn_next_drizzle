"use server"

import { newPasswordSchema } from "@/types/new-password-schema"
import { createSafeActionClient } from "next-safe-action"
import { getPassowrdResetTokenByToken } from "./tokens";
import { db } from "..";
import { passwordResetTokens, users } from "../schema";
import { eq } from "drizzle-orm";
import bcrypt from 'bcrypt';
import { Pool } from '@neondatabase/serverless';
import { drizzle } from "drizzle-orm/neon-serverless";

const action = createSafeActionClient();

const newPassword = action
    .schema(newPasswordSchema)
    .action(async ({parsedInput: {password, token}}) => {
        //perform pool connection to neon db for transaction
        const pool = new Pool({
            connectionString: process.env.POSTGRESS_URL!
        });
        const dbPool = drizzle(pool);

        //Check token exists
        if (!token) {
            return {error: 'Invalid token'}
        }

        //if the token is valid
        const existingToken = await getPassowrdResetTokenByToken(token);
        if(!existingToken){
            return {error: 'Invalid token'}
        }

        //Check if the token has expired
        const hasExpired = new Date(existingToken.expires) < new Date();
        if(hasExpired){
            return {error: 'Token has expired'}
        }

        //check if the user exists
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, existingToken.email)
        });
        if(!existingUser){
            return {error: 'User not found'}
        }

        //hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //transaction to update the user password and delete the token
        await dbPool.transaction(async tx => {
            await tx.update(users).set({
                password: hashedPassword
            }).where(eq(users.id, existingUser.id));

            await tx.delete(passwordResetTokens).where(
                eq(passwordResetTokens.id, existingToken.id)
            )
        })

        return {success: "Password updated successfully"}
});

export default newPassword