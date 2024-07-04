"use client"

import { newVerification } from "@/server/actions/tokens"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import AuthCard from "./auth-card"
import FormSuccess from "./form-success"
import FormError from "./form-error"

export const EmailVerificationForm = () => {
    const token = useSearchParams().get("token")
    const router = useRouter()
    const [error, setError] = useState<string>('')
    const [success, setSuccess] = useState<string>('')

    const handleVerification = useCallback(async () => {
        if(success || error)
            return
        if(!token){
            setError("Invalid token")
            return
        }

        newVerification(token).then(data => {
            if(data.error){
                setError(data.error)
            }
            if(data.success){
                setSuccess(data.success)
                router.push("/")
            }
        })
    }, [])

    useEffect(() => {
        handleVerification()
    }, [])

    return (
        <AuthCard 
            backButtonHref="/auth/login"
            backButtonLabel="Back to login"
            cardTitle="Verify your account!"
            showSocials={false}>
            <div className="flex items-center flex-col w-full justify-center">
                <p>{!success && !error ? 'Verifying email...' : null}</p>
                {success !== '' && <FormSuccess message={success}/> }
                {error !== '' && <FormError message={error}/> }
            </div>
        </AuthCard>
    )
}