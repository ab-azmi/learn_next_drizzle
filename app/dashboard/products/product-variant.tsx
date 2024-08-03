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

export default function ProductVariant(
    { editMode, productID, variant, children }:
        {
            editMode: boolean,
            productID?: number,
            variant?: VariantsWithImagesTags,
            children: React.ReactNode
        }) {

    const form = useForm<z.infer<typeof VariantSchema>>({
        resolver: zodResolver(VariantSchema),
        defaultValues: VariantSchemaDefaultValues,
    });

    const onSubmit = (values: z.infer<typeof VariantSchema>) => {

    }

    return (
        <Dialog>
            <DialogTrigger>
                {children}
            </DialogTrigger>
            <DialogContent>
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
                                        {/* <InputTags> */}
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* <VariantImages/> */}
                        {editMode && variant && (
                            <Button
                                onClick={(e) => e.preventDefault()}
                                type="button">Delete Variant</Button>
                        )}
                        <Button type="submit">
                            {editMode ? 'Update Variant' : 'Add Variant'}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}