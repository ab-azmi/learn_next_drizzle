"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { VariantsWithImagesTags } from "@/lib/infer-types"
import { VariantSchema, VariantSchemaDefaultValues } from "@/types/variant-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputTags from "./input-tags";
import VariantImages from "./variant-images";
import { useAction } from "next-safe-action/hooks";
import createVariants from "@/server/actions/create-variants";
import { toast } from "sonner";
import { forwardRef, useEffect, useState } from "react";
import { deleteVariant } from "@/server/actions/delete-variant";

type ProductVariantProps = {
    editMode: boolean,
    productID?: number,
    variant?: VariantsWithImagesTags,
    children: React.ReactNode
};

const ProductVariant = forwardRef<HTMLDivElement, ProductVariantProps>((
    { editMode, productID, variant, children }, ref) => {

    const [open, setOpen] = useState(false);

    const form = useForm<z.infer<typeof VariantSchema>>({
        resolver: zodResolver(VariantSchema),
        defaultValues: {
            productID: productID,
            id: undefined,
            editMode: false,
            productType: 'Black Notebook',
            color: '#000000',
            tags: [],
            variantImages: []
        },
    });

    const { execute, status } = useAction(createVariants, {
        onExecute() {
            toast.loading('Creating variant', { duration: 500 })
            setOpen(false);
        },
        onSuccess(res) {
            toast.dismiss();

            if (res?.data?.success) {
                toast.success(res.data.success)
            }
            if (res?.data?.error) {
                toast.error(res.data.error)
            }

        }
    })
    const variantAction = useAction(deleteVariant, {
        onExecute() {
            toast.loading('Deleting variant', { duration: 500 })
            setOpen(false);
        },
        onSuccess(res) {
            toast.dismiss();

            if (res?.data?.success) {
                toast.success(res.data.success)
            }
            if (res?.data?.error) {
                toast.error(res.data.error)
            }

        }
    })

    const onSubmit = (values: z.infer<typeof VariantSchema>) => {
        execute(values);
    }

    const setEdit = () => {
        if (!editMode) {
            form.reset();
            return;
        }
        if (editMode && variant) {
            form.setValue('editMode', true);
            form.setValue('id', variant.id);
            form.setValue('productID', variant.productID);
            form.setValue('productType', variant.productType);
            form.setValue('tags', variant.variantTags.map(tag => tag.tag));
            form.setValue('variantImages', variant.variantImages.map(img => ({
                name: img.name,
                size: img.size,
                url: img.url
            })));
            form.setValue('color', variant.color);
        }
    }

    useEffect(() => {
        setEdit();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                {children}
            </DialogTrigger>
            <DialogContent className="lg:max-w-screen-lg overflow-y-scroll max-h-[640px] rounded-md">
                <DialogHeader>
                    <DialogTitle>
                        {editMode ? 'Edit Variant' : 'Add Variant'}
                    </DialogTitle>
                    <DialogDescription>
                        Manage your product variants. You can add or edit variants here.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="productType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Variant Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Pick a title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="color"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Variant Color</FormLabel>
                                    <FormControl>
                                        <Input type="color" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Variant Tags</FormLabel>
                                    <FormControl>
                                        <InputTags {...field} onChange={(e) => field.onChange(e)} />
                                    </FormControl>
                                    <FormDescription>
                                        Press enter to input tags
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <VariantImages />
                        <div className="flex gap-3">
                            {editMode && variant && (
                                <Button
                                    disabled={variantAction.status === 'executing'}
                                    variant={'destructive'}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        variantAction.execute({id: variant.id})
                                    }}
                                    type="button">Delete Variant</Button>
                            )}
                            <Button type="submit" disabled={status === 'executing' || !form.formState.isValid || !form.formState.isDirty}>
                                {editMode ? 'Update Variant' : 'Add Variant'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
})

ProductVariant.displayName = 'ProductVariant';

export default ProductVariant;