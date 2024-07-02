"use server"

import { RegisterSchema } from "@/types/register-schema"
import { createSafeActionClient } from "next-safe-action"
import bcrypt from 'bcrypt'
import { db } from "@/server";
import { eq } from "drizzle-orm";
import { users } from "@/server/schema";

const action = createSafeActionClient();

const emailRegister = action
    .schema(RegisterSchema)
    .action(async ({parsedInput: {email, name, password}}) => {
        const hasedPassword = await bcrypt.hash(password, 10);
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email)
        })

        //check if email already in the db, then register
        if(existingUser){
            if(!existingUser.emailVerified){
                //if not register and send verification
                // const verificationToken = ''
            }
            return {error: 'Email already in use'}
        }

        return {success: 'Register success'}
    });

export default emailRegister;