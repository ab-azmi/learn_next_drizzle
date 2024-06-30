"use client"

import { useEffect } from "react"

export default function Error({
    error, reset
}: {
    error: Error & {digest?: string},
    reset: () => void
}){
    useEffect(() => {
        //log the error to the a service
        console.error(error)
    }, [error])

    return (
        <div className="w-full min-h-56 text-lg flex items-center justify-center flex-col">
            <h2>{error.message}</h2>
            <button onClick={() => reset()}>
                Try again
            </button>
        </div>
    )
}