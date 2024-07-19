"use client"

import { Toaster as Toasty } from "@/components/ui/sonner"; 
import { useTheme } from "next-themes";

export default function Toaster(){
    const {theme} = useTheme();
    if(typeof theme === "string"){
        return (
            <Toasty 
                richColors
                theme={theme as "light" | 'dark' | 'system' | undefined} />
        )
    }
}