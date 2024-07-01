"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

const BackButton = (
    {href, label}: 
    {href: string, label: string}
) => {
    return (
        <Button className="font-medium w-full">
            <Link aria-label={label} href={href}>
                {label}
            </Link>
        </Button>
    )
}

export default BackButton