"use client"

import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'

export default function Socials() {
    return (
        <div className="flex flex-col items-center w-full gap-4">
            <Button 
                variant={"outline"}
                className="w-full flex gap-4"
                onClick={() => signIn("google", {
                    redirect: false,
                    callbackUrl: "/",
                })}
            >
                Sign in with Google
                <FcGoogle size={24} />
            </Button>
            <Button
                variant={"outline"}
                className="w-full flex gap-4"
                onClick={() => signIn("github", {
                    redirect: false,
                    callbackUrl: "/",
                })}
            >
                Sign in with Github
                <FaGithub size={24} />
            </Button>
        </div>
    )
}