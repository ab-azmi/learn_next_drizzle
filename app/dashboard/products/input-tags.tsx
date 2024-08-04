"use client"

import { Input, InputProps } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Dispatch, forwardRef, SetStateAction, useState } from "react"
import { useFormContext } from "react-hook-form"
import { AnimatePresence, motion } from 'framer-motion'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

type InputTagsProps = InputProps & {
    value: string[],
    onChange: Dispatch<SetStateAction<string[]>>
}

const InputTags = forwardRef<HTMLInputElement, InputTagsProps>(({ onChange, value, ...props }, ref) => {
    const [pendingDataPoint, setPendingDataPoint] = useState('')
    const [focused, setFocused] = useState(false)

    function addPendingDataPoint() {
        if (pendingDataPoint) {
            const newDataPoints = new Set([...value, pendingDataPoint])
            onChange(Array.from(newDataPoints))
            setPendingDataPoint('')
        }
    }

    const { setFocus } = useFormContext()

    return (
        <div className={cn("min-h-[40px] flex h-fit w-full rounded-lg border border-input bg-background  text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            focused ? 'ring-offset-2 outline-none ring-2' : 'ring-offset-0 outline-none ring-0')}
            onClick={() => setFocus('tags')}>

            <motion.div className="rounded-md min-h-[2.5rem] p-2 flex gap-2 flex-wrap items-center">
                {/* Tags */}
                <AnimatePresence>
                    {value.map((tag) => (
                        <motion.div animate={{ scale: 1 }} initial={{ scale: 0 }} exit={{ scale: 0 }} key={tag}>
                            {/* Tag */}
                            <Badge className="text-xs flex items-center gap-1">
                                {tag}

                                {/* Delete tag */}
                                <button onClick={() => onChange(value.filter((i) => i !== tag))}>
                                    <XIcon className="w-3" />
                                </button>
                            </Badge>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {/* Input tag */}
                <div className="flex">
                    <Input
                        placeholder="Add tag"
                        className="focus-visible:border-transparent border-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                        onKeyDown={(e) => {
                            // Add tag on enter
                            if (e.key === 'Enter') {
                                e.preventDefault()
                                addPendingDataPoint()
                            }
                            // Remove tag on backspace
                            if (e.key === 'Backspace' && !pendingDataPoint && value.length > 0) {
                                e.preventDefault()
                                const newValue = [...value]
                                newValue.pop()
                                onChange(newValue)
                            }
                        }}
                        value={pendingDataPoint} onFocus={(e) => setFocused(true)} onBlurCapture={(e) => setFocused(false)} onChange={(e) => setPendingDataPoint(e.target.value)}
                        {...props} />
                </div>
            </motion.div>
        </div>
    )
})

InputTags.displayName = 'InputTags'

export default InputTags