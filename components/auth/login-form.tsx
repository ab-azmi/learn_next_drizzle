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
import { useState } from "react"
import FormError from "./form-error"
import FormSuccess from "./form-success"
import { Loader2 } from "lucide-react"

const LoginForm = () => {
    //form
    const form = useForm({
        //validation with zod
        resolver: zodResolver(loginSchema),
        //default empty values
        defaultValues: loginDefaultValues
    });

    //states
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    //action
    const { execute, status } = useAction(emailSignIn, {
        onSuccess: (res) => {
            if (res?.data?.success) {
                setSuccess(res.data.success)
            }
            if (res?.data?.error) {
                setError(res.data.error)
            }
        }

    });

    //submit func
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
                            {/* Email */}
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
                            {/* Password */}
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
                            {/* Back */}
                            <Link href={'/auth/reset'}>Forgot your password?</Link>
                            {/* Error */}
                            {error !== '' && <FormError message={error} />}
                            {/* Success */}
                            {success !== '' && <FormSuccess message={success} />}
                            {/* Submit */}
                            <Button disabled={status === 'executing'}>
                                {status === 'executing' && (
                                    <div>
                                        <Loader2 className="animate-spin inline-block mr-2" size={16} />
                                        Logging...
                                    </div>
                                )}
                                {status !== 'executing' && 'Login'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </AuthCard>
    )
}

export default LoginForm