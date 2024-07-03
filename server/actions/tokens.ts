"use server"

import { eq } from "drizzle-orm"
import { db } from ".."
import { emailTokens } from "../schema"

export const getExistingTokenByEmail = async (email: string) => {
    try{
        const verificationToken = db.query.emailTokens.findFirst({
            where: eq(emailTokens.token, email)
        })
        return verificationToken;
    }catch(error){
        return null
    }   
}

export const generateEmailVerificationToken = async (email: string) => {
    const token = crypto.randomUUID();
    //24h
    const expires = new Date(new Date().getTime() + 1000 * 60 * 60 * 24);

    const existingToken = await getExistingTokenByEmail(email);

    //if token already exists, delete it
    if(existingToken){
        await db.delete(emailTokens).where(
            eq(emailTokens.id, existingToken.id)
        )
    }

    //insert new token
    const verificationToken = await db.insert(emailTokens).values({
        email, 
        token,
        expires
    })

    return verificationToken;
}

