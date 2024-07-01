"use client"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import AuthCard from "./auth-card"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginDefaultValues, loginSchema } from "@/types/login-schema"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import emailSignIn from "@/server/actions/email-signin"
import { useAction } from "next-safe-action/hooks";

const LoginForm = () => {
    //form
    const form = useForm({
        //validation with zod
        resolver: zodResolver(loginSchema),
        //default empty values
        defaultValues: loginDefaultValues
    });

    //action
    const { execute, status } = useAction(emailSignIn);

    const onSubmit = (values: z.infer<typeof loginSchema>) => {
        execute(values);
    }

    return (
        <AuthCard
            cardTitle="Welcome Back"
            backButtonHref="/auth/register"
            backButtonLabel="Create an account"
            showSocials={true}
            classes="max-w-xl mx-auto"
        >
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-3">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                {...field}
                                                placeholder="spiderwoman@gmail.com"
                                                autoComplete="email" />
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                )}>
                            </FormField>
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                {...field}
                                                placeholder="*******" />
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                )}>
                            </FormField>
                            <Button size={'sm'} variant={'link'} asChild className="w-fit">
                                <Link href={'/auth/reset'}>Forgot your password?</Link>
                            </Button>
                            <Button className={status === 'executing' ? 'animate-pulse' : ''}>
                                Login
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </AuthCard>
    )
}

export default LoginForm