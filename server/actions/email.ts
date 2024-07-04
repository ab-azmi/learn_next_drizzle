"use server"
import getBaseURL from '@/lib/base-url';
import { Resend } from 'resend'
import EmailTemplate from '@/components/auth/email-template';

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = getBaseURL();



const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `${domain}/new-verification?token=${token}`;
   
    const { data, error } = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: email,
        subject: 'Sprout and Scribble - Verify your email address',
        react: EmailTemplate({ confirmLink: confirmLink }),
        text: 'Please verify your email address by clicking the link below:',
      });
    
      if (error) {
        return {error: error};
      }
    
      return {success: data};
}

export default sendVerificationEmail;