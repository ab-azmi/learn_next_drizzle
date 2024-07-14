"use server"

import { SettingsSchema } from "@/types/settings-schema";
import { createSafeActionClient } from "next-safe-action"
import { auth } from "../auth";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import bcrypt from 'bcryptjs'
import { revalidatePath } from "next/cache";

const action = createSafeActionClient();

const settings = action
    .schema(SettingsSchema)
    .action(async ({parsedInput: values}) => {
        // Check if user is authenticated
        const session = await auth();
        if(!session){
            return {error: 'Unauthorized'}
        }
        // Check if user exists
        const dbUser = await db.query.users.findFirst({
            where: eq(users.id, session.user.id)
        })
        if(!dbUser){
            return {error: 'User not found'}
        }
        //check if user login using OAuth (Google, Github, etc)
        if(session.user.isOAuth){
            values.email = undefined;
            values.password = undefined;
            values.isTwoFactorEnabled = undefined;
            values.newPassword = undefined;
        }

        if(values.password && values.newPassword && dbUser.password){
            // Check if existing password match
            const passwordMatch = await bcrypt.compare(values.password, dbUser.password)
            if(!passwordMatch){
                return {error: 'Incorrect password'}
            }
            // Check if new password is the same as existing password
            const samePassword = await bcrypt.compare(values.newPassword, dbUser.password)
            if(samePassword){
                return {error: 'New password cannot be the same as the existing password'}
            }
            // Hash new password
            const hashedPassword = await bcrypt.hash(values.newPassword, 10)
            values.password = hashedPassword
            values.newPassword = undefined

        }
        // Update user
        const updatedUser = await db.update(users).set({
            name: values.name,
            email: values.email,
            password: values.password,
            twoFactorEnabled: values.isTwoFactorEnabled
        }).where(eq(users.id, session.user.id))

        //re render the page
        revalidatePath("/dashboard/settings")
        return {success: 'Settings updated'}
    })

export default settings