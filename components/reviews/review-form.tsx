"use client"

import { reviewSchema, reviewSchemaDefaultValues } from "@/types/review-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover"
import { Button } from "../ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Textarea } from "../ui/textarea"
import { Input } from "../ui/input"
import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAction } from "next-safe-action/hooks"
import { addReview } from "@/server/actions/add-review"
import { toast } from "sonner"

export default function ReviewForm() {
    const params = useSearchParams();
    const productID = Number(params.get('productID'));

    const form = useForm<z.infer<typeof reviewSchema>>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            rating: 0,
            comment: '',
            productID
        }
    })

    const {execute, status} = useAction(addReview, {
        onSuccess: (res) => {
            if(res.data?.error){
                toast.error(res.data.error);
            }
            if(res.data?.success){
                toast.success('Review added successfully');
                form.reset();
            }
        },
    });

    const onSubmit = (values: z.infer<typeof reviewSchema>) => {
        execute({rating: values.rating, comment: values.comment, productID});
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <div className="w-full">
                    <Button className="font-medium w-full">Leave a review</Button>
                </div>
            </PopoverTrigger>
            <PopoverContent className="p-4 rounded-lg bg-background">
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
                                                    form.getValues('rating') >= star ? 'fill-primary text-primary' : 'fill-muted text-muted'
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
                                <FormMessage/>
                            </FormItem>
                        )} />

                        <Button 
                            disabled={status === 'executing'}
                            className="" 
                            type="submit">
                            {status === 'executing' ? 'Submitting...' : 'Submit'}
                        </Button>
                    </form>
                </Form>
            </PopoverContent>
        </Popover>
    )
}