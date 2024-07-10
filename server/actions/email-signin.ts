"use server"

import { loginSchema } from "@/types/login-schema"
import { createSafeActionClient } from "next-safe-action"
import { db } from ".."
import { eq } from "drizzle-orm"
import { users } from "@/server/schema"
import { generateEmailVerificationToken } from "./tokens"
import{ sendVerificationEmail} from "./email"
import { AuthError } from "next-auth"
import { signIn } from "../auth"

const action = createSafeActionClient()
//Signin via email and password
const emailSignIn = action
    .schema(loginSchema)
    .action(async ({parsedInput: {email, password}}) => {
        try {
            const existingUser = await db.query.users.findFirst({
                where: eq(users.email, email)
            })
    
            if(existingUser?.email !== email){
                return {error: "Email not found"}
            }
    
            if(!existingUser?.emailVerified){
                //Send verification email
                const verificationToken = await generateEmailVerificationToken(existingUser?.email!)
                await sendVerificationEmail(verificationToken[0].email, verificationToken[0].token)
                return {success: "Email not verified, verification email sent"}
            }
    
            //2FA Authentication TODO
    
            //signin
            await signIn('credentials', {
                email,
                password,
                redirectTo: '/'
            })
    
            return {success: 'berhasil login!'}
            
        } catch (error) {
            //Handle AuthError
            if(error instanceof AuthError){
                switch(error.type){
                    case "CredentialsSignin":
                        return {error: 'Email or password is incorrect'}
                    case "AccessDenied":
                        return {error: error.name}
                    case 'OAuthSignInError':
                        return {error: error.name}
                    default:
                        return {error: "Something went wrong"}
                }
            }

            throw error;
        }
    })

export default emailSignIn