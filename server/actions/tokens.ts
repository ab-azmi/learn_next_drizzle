"use server";

import { eq } from "drizzle-orm";
import { db } from "..";
import crypto from "crypto";
import { emailTokens, passwordResetTokens, twoFactorTokens, users } from "../schema";

export const getExistingTokenByEmail = async (email: string) => {
  try {
    const verificationToken = db.query.emailTokens.findFirst({
      where: eq(emailTokens.token, email),
    });
    return verificationToken;
  } catch (error) {
    return null;
  }
};

export const generateEmailVerificationToken = async (email: string) => {
  const token = crypto.randomUUID();
  //24h
  const expires = new Date(new Date().getTime() + 1000 * 60 * 60 * 24);

  const existingToken = await getExistingTokenByEmail(email);

  //if token already exists, delete it
  if (existingToken) {
    await db.delete(emailTokens).where(eq(emailTokens.id, existingToken.id));
  }

  //insert new token
  const verificationToken = await db
    .insert(emailTokens)
    .values({
      email,
      token,
      expires,
    })
    .returning();

  return verificationToken;
};

export const newVerification = async (token: string) => {
  //verify user

  const existingToken = await getExistingTokenByEmail(token);

  if (!existingToken) return { error: "Invalid token" };

  const hasExpired = new Date() > new Date(existingToken.expires);

  if (hasExpired) return { error: "Token has expired" };

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, existingToken.email),
  });

  if (!existingUser) return { error: "User not found" };

  //update user verified email
  await db.update(users).set({
    emailVerified: new Date(),
    email: existingToken.email,
  });
  //delete token from this user
  await db.delete(emailTokens).where(eq(emailTokens.id, existingToken.id));

  return { success: "Email verified successfully" };
};

export const getPassowrdResetTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = db.query.passwordResetTokens.findFirst({
      where: eq(passwordResetTokens.token, token),
    });
    return passwordResetToken;
  } catch (error) {
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await db.query.passwordResetTokens.findFirst({
      where: eq(passwordResetTokens.email, email),
    });
    return passwordResetToken;
  } catch (error) {
    return null;
  }
};

export const generatePasswordResetToken = async (email: string) => {
  try {
    const token = crypto.randomUUID();

    //hour expiry
    const expires = new Date(new Date().getTime() + 1000 * 60 * 60);

    const existingToken = await getPasswordResetTokenByEmail(email);

    if (existingToken) {
      await db
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.id, existingToken.id));
    }

    const passwordResetToken = await db.insert(passwordResetTokens).values({
      email,
      token,
      expires,
    }).returning();

    return passwordResetToken;
  } catch (error) {
    return null
  }
};

export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const twoFactorToken = await db.query.twoFactorTokens.findFirst({
      where: eq(twoFactorTokens.email, email),
    });
    return twoFactorToken;
  } catch (error) {
    return null;
  }
};

export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    const twoFactorToken = db.query.twoFactorTokens.findFirst({
      where: eq(twoFactorTokens.token, token),
    });
    return twoFactorToken;
  } catch (error) {
    return null;
  }
};

export const generateTwoFactorToken = async (email: string) => {
  try {
    const token = crypto.randomInt(100_000, 1_000_000).toString();

    //hour expiry
    const expires = new Date(new Date().getTime() + 1000 * 60 * 60);

    const existingToken = await getTwoFactorTokenByEmail(email);

    if (existingToken) {
      await db
        .delete(twoFactorTokens)
        .where(eq(twoFactorTokens.id, existingToken.id));
    }

    const twoFactorToken = await db.insert(twoFactorTokens).values({
      email,
      token,
      expires,
    }).returning();

    return twoFactorToken;
  } catch (error) {
    return null
  }
};