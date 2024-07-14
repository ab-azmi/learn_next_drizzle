"use server"
import getBaseURL from '@/lib/base-url';
import { Resend } from 'resend'
import {ResetPasswordEmailTemplate, VerifyEmailTemplate} from '@/components/auth/email-template';

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = getBaseURL();



export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`;
   
    const { data, error } = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: email,
        subject: 'Sprout and Scribble - Verify your email address',
        react: VerifyEmailTemplate({ confirmLink: confirmLink }),
        text: 'Please verify your email address by clicking the link below:',
      });
    
      if (error) {
        return {error: error};
      }
    
      return {success: data};
}

export const sendPassowrdResetEmail = async (email: string, token: string) => {
    const confirmLink = `${domain}/auth/new-password?token=${token}`;
   
    const { data, error } = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: email,
        subject: 'Sprout and Scribble - Reset your password',
        react: ResetPasswordEmailTemplate({ confirmLink: confirmLink }),
        text: 'Please reset your password by clicking the link below:',
      });
    
      if (error) {
        return {error: error};
      }
    
      return {success: data};
}

export const sendTwoFactorEmail = async (email: string, token: string) => {

  const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: 'Sprout and Scribble - 2 Factor Authentication Token',
      html: '<p>Your 2FA token is: <strong>' + token + '</strong></p>',
      text: 'Please reset your password by clicking the link below:',
    });
  
    if (error) {
      return {error: error};
    }
  
    return {success: data};
}