import NextAuth, {type DefaultSession} from 'next-auth';

// Extend the user object fot type autocompletion
export type ExtendUser = DefaultSession['user'] & {
    id: string;
    name: string;
    email: string;
    role: string;
    isOAuth: boolean;
    isTwoFactorEnabled: boolean;
    image: string;
}

declare module 'next-auth' {
    interface Session {
        user: ExtendUser;
    }
}