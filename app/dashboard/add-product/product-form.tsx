"use client";

import { ProductSchema, ProductSchemaDefaultValues } from "@/types/product-schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { DollarSign } from "lucide-react";
import Tiptap from "./tiptap";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { createProduct } from "@/server/actions/create-product";
import { useState } from "react";
import FormError from "@/components/auth/form-error";
import FormSuccess from "@/components/auth/form-success";


export default function ProductForm() {
    const [error, setError] = useState<string | undefined>(undefined);
    const [success, setSuccess] = useState<string | undefined>(undefined);

    const form = useForm<z.infer<typeof ProductSchema>>({
        resolver: zodResolver(ProductSchema),
        defaultValues: ProductSchemaDefaultValues,
    });

    const {execute, status} = useAction(createProduct, {
        onSuccess: (res) => {
            if(res?.data?.success){
                setSuccess(res.data.success);
            }
            if(res?.data?.error){
                setError(res.data.error);
            }
        },
        onError: (error) => {
            console.log(error);
        }
    });

    const onSubmit = (values: z.infer<typeof ProductSchema>) => {
        execute(values);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-xl">
                        {/* Title */}
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Asus Zephyrus" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Description */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Tiptap val={field.value}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Price */}
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Price</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center">
                                            <DollarSign size={40} className="p-2 bg-muted rounded-l-md"/>
                                            <Input 
                                                type="number" 
                                                placeholder="Price in USD" 
                                                step={0.1} min={0} {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormError message={error} />
                        <FormSuccess message={success} />
                        <Button 
                            disabled={status === 'executing' || !form.formState.isValid || !form.formState.isDirty} 
                            type="submit">Submit</Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter>
                <p>Card Footer</p>
            </CardFooter>
        </Card>
    )
}