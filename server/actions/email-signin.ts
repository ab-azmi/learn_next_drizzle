"use server";

import { loginSchema } from "@/types/login-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { twoFactorTokens, users } from "@/server/schema";
import {
  generateEmailVerificationToken,
  generateTwoFactorToken,
  getTwoFactorTokenByEmail,
} from "./tokens";
import { sendTwoFactorEmail, sendVerificationEmail } from "./email";
import { AuthError } from "next-auth";
import { signIn } from "../auth";

const action = createSafeActionClient();
//Signin via email and password
const emailSignIn = action
  .schema(loginSchema)
  .action(async ({ parsedInput: { email, password, code } }) => {
    try {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (existingUser?.email !== email) {
        return { error: "Email not found" };
      }

      if (!existingUser?.emailVerified) {
        //Send verification email
        const verificationToken = await generateEmailVerificationToken(
          existingUser?.email!
        );
        await sendVerificationEmail(
          verificationToken[0].email,
          verificationToken[0].token
        );
        return { success: "Email not verified, verification email sent" };
      }

      //2FA Authentication TODO
      if (existingUser?.twoFactorEnabled && existingUser?.email) {
        //if code is provided
        if (code) {
          //get token by email
          const twoFactorToken = await getTwoFactorTokenByEmail(
            existingUser?.email
          );
          if (!twoFactorToken) return { error: "Invalid code" };

          //check if code is correct
          if (twoFactorToken.token !== code) return { error: "Invalid code" };

          //check if code has expired
          const hasExpired = new Date() > new Date(twoFactorToken.expires);
          if (hasExpired) return { error: "Code has expired" };

          //delete token
          await db
            .delete(twoFactorTokens)
            .where(eq(twoFactorTokens.id, twoFactorToken.id));
        } else {
          //if code is not provided, generate new code
          const token = await generateTwoFactorToken(existingUser?.email!);
          if (!token) return { error: "Something went wrong" };
          //send email
          await sendTwoFactorEmail(token[0].email, token[0].token);
          return { twoFactor: "Code verified, new code sent" };
        }
      }

      //signin
      await signIn("credentials", {
        email,
        password,
        redirectTo: "/",
      });

      return { success: "berhasil login!" };
    } catch (error) {
      //Handle AuthError
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return { error: "Email or password is incorrect" };
          case "AccessDenied":
            return { error: error.name };
          case "OAuthSignInError":
            return { error: error.name };
          default:
            return { error: "Something went wrong" };
        }
      }

      throw error;
    }
  });

export default emailSignIn;
