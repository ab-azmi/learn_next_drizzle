"use client"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import AuthCard from "./auth-card"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAction } from "next-safe-action/hooks";
import { useState } from "react"
import FormError from "./form-error"
import FormSuccess from "./form-success"
import { Loader2 } from "lucide-react"
import { ResetSchema, ResetSchemaDefaultValues } from "@/types/reset-schema"
import resetPassword from "@/server/actions/password-reset"

const ResetForm = () => {
    //form
    const form = useForm({
        //validation with zod
        resolver: zodResolver(ResetSchema),
        //default empty values
        defaultValues: ResetSchemaDefaultValues
    });

    //states
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    //action
    const { execute, status } = useAction(resetPassword, {
        onSuccess: (res) => {
            if(res?.data?.success){
                setSuccess(res.data.success)
            }
            if(res?.data?.error){
                setError(res.data.error)
            }
        }

    });

    //submit func
    const onSubmit = (values: z.infer<typeof ResetSchema>) => {
        execute(values);
    }

    return (
        <AuthCard
            cardTitle="Forgot your password?"
            backButtonHref="/auth/login"
            backButtonLabel="Back to login"
            showSocials={false}
            classes="max-w-xl mx-auto"
        >
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-3">
                            {/* Password */}
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
                                                autoComplete="email"
                                                placeholder="anjing@gmail.com" />
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                )}>
                            </FormField>
                            {/* Error */}
                            {error !== '' && <FormError message={error}/>}
                            {/* Success */}
                            {success !== '' && <FormSuccess message={success}/>}
                            {/* Submit */}
                            <Button disabled={status === 'executing'}>
                                {status === 'executing' && (
                                    <div>
                                        <Loader2 className="animate-spin inline-block mr-2" size={16} />
                                        Executing...
                                    </div>
                                )}
                                {status !== 'executing' && 'Reset Password'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </AuthCard>
    )
}

export default ResetForm