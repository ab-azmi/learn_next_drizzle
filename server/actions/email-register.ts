"use server"

import { RegisterSchema } from "@/types/register-schema"
import { createSafeActionClient } from "next-safe-action"
import bcrypt from 'bcrypt'
import { db } from "@/server";
import { eq } from "drizzle-orm";
import { users } from "@/server/schema";
import { generateEmailVerificationToken } from "./tokens";

const action = createSafeActionClient();

const emailRegister = action
    .schema(RegisterSchema)
    .action(async ({parsedInput: {email, name, password}}) => {
        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email)
        })

        //check if email already in the db, then register
        if(existingUser){
            if(!existingUser.emailVerified){
                //if not register and send verification
                const verificationToken = await generateEmailVerificationToken(email);
                // await sendVerificationEmail(email);

                return {success: 'Email Confirmation resent'};
            }
            return {error: 'Email already in use'}
        }

        //if user is not registered
        await db.insert(users).values({
            email,
            name,
            password: hashedPassword
        })

        const verificationToken = await generateEmailVerificationToken(email);
        // await sendVerificationEmail(email);

        return {success: 'Register success. Check your email for verification link.'}
    });

export default emailRegister;