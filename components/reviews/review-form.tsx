"use client"

import { reviewSchema, reviewSchemaDefaultValues } from "@/types/review-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Popover, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { PopoverContent } from "@radix-ui/react-popover"
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form"
import { Textarea } from "../ui/textarea"
import { Input } from "../ui/input"
import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ReviewForm() {
    const params = useSearchParams();
    const productID = Number(params.get('productID'));

    const form = useForm<z.infer<typeof reviewSchema>>({
        resolver: zodResolver(reviewSchema),
        defaultValues: reviewSchemaDefaultValues
    })

    const onSubmit = () => {

    }

    return (
        <Popover>
            <PopoverTrigger>
                <div className="w-full">
                    <Button className="font-medium w-full">Leave a review</Button>
                </div>
            </PopoverTrigger>
            <PopoverContent>
                <Form {...form}>
                    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField control={form.control} name="rating" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Leave your rating</FormLabel>
                                <FormControl>
                                    <Input type="hidden" placeholder="Star rating" {...field} />
                                </FormControl>
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <motion.div
                                            key={star}
                                            className="relative cursor-pointer"
                                            whileHover={{ scale: 1.2 }}
                                            whileTap={{ scale: 0.8 }}>
                                            <Star key={star} onClick={() => {
                                                form.setValue('rating', star)
                                            }}
                                                className={cn('text-priamry bg-transparent transition-all duration-300 ease-in-out',
                                                    form.getValues('rating') >= star ? 'text-primary' : 'text-muted'
                                                )} />
                                        </motion.div>
                                    ))}
                                </div>
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="comment" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Leave your review</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="How you would describe this product?" {...field} className="w-full" />
                                </FormControl>
                            </FormItem>
                        )} />

                        <Button className="w-full" type="submit">
                            Add review
                        </Button>
                    </form>
                </Form>
            </PopoverContent>
        </Popover>
    )
}