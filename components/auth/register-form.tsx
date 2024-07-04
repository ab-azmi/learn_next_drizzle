"use client"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import AuthCard from "./auth-card"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { RegisterSchema, registerDefaultValues } from "@/types/register-schema"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAction } from "next-safe-action/hooks";
import { useState } from "react"
import emailRegister from "@/server/actions/email-register"
import FormSuccess from "./form-success"
import FormError from "./form-error"
import { Loader2 } from "lucide-react"

const RegisterForm = () => {
    //form
    const form = useForm({
        //validation with zod
        resolver: zodResolver(RegisterSchema),
        //default empty values
        defaultValues: registerDefaultValues
    });

    //states
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    //action
    const {execute, status} = useAction(emailRegister, {
        onSuccess(res){
            if(res?.data?.success){
                setSuccess(res.data.success)
            }
            if(res?.data?.error){
                setError(res.data.error)
            }
        }
    })

    //submit func
    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        execute(values)
    }

    return (
        <AuthCard
            cardTitle="Create an account 🎉"
            backButtonHref="/auth/login"
            backButtonLabel="Already have an account?"
            showSocials={true}
            classes="max-w-xl mx-auto"
        >
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-3">
                            {/* Name */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                {...field}
                                                placeholder="johnsnow555"
                                                autoComplete="name" />
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                )}>
                            </FormField>
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
                            {/* Success */}
                            <FormSuccess message={success || ''}/>
                            {/* Error */}
                            <FormError message={error || ''}/>
                            {/* Submit */}
                            <Button disabled={status === 'executing'}>
                                {status === 'executing' && (
                                    <div>
                                        <Loader2 className="animate-spin inline-block mr-2" size={16} />
                                        Registering...
                                    </div>
                                )}
                                {status !== 'executing' && 'Register'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </AuthCard>
    )
}

export default RegisterForm