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
import { useEffect, useState } from "react";
import FormError from "@/components/auth/form-error";
import { useRouter, useSearchParams } from "next/navigation";
import {toast} from "sonner";
import { revalidatePath } from "next/cache";
import { getProduct } from "@/server/actions/get-product";


export default function ProductForm() {
    const [error, setError] = useState<string | undefined>(undefined);
    const router = useRouter();
    const searchParams = useSearchParams();
    const editMode = searchParams.has('id');

    const checkProduct = async (id: number) => {
        if(editMode){
            const data = await getProduct(id);   
            if(data.error){
                toast.error(data.error);
                router.back();
                return;
            }
            if(data.success){
                const id = parseInt(searchParams.get('id') as string);
                form.setValue('title', data.success.title);
                form.setValue('description', data.success.description);
                form.setValue('price', data.success.price);
                form.setValue('id', id);
            }
        }
    }

    useEffect(() => {
        if(editMode){
            const id = parseInt(searchParams.get('id') as string);
            checkProduct(id);
        }
    })

    const form = useForm<z.infer<typeof ProductSchema>>({
        resolver: zodResolver(ProductSchema),
        defaultValues: ProductSchemaDefaultValues,
        mode: 'onChange'
    });

    const { execute, status } = useAction(createProduct, {
        onSuccess: (res) => {
            toast.dismiss();
            
            if (res?.data?.success) {
                toast.success(res.data.success);
                form.reset();
                router.push('/dashboard/products');
            }
            if (res?.data?.error) {
                setError(res.data.error);
            }
        },
        onExecute: () => {
            if(editMode){
                toast.loading('Updating product...');
            }else{
                toast.loading('Creating product...');
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
        <Card className="max-w-xl my-3 mx-6">
            <CardHeader>
                <CardTitle>
                    {editMode ? 'Edit Product' : 'Add New Product'}
                    </CardTitle>
                <CardDescription>
                    {editMode ? 'Make changes to existing product' : 'Create something wonderful'}
                </CardDescription>
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
                                            <DollarSign size={40} className="p-2 bg-muted rounded-l-md" />
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
                        <Button
                            disabled={status === 'executing' || !form.formState.isValid || !form.formState.isDirty}
                            type="submit">
                            {editMode ? 'Save Changes' : 'Create Product'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}