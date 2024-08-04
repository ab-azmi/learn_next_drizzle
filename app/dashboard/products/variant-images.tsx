"use client"

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { VariantSchema } from "@/types/variant-schema";
import { useFieldArray, useFormContext } from "react-hook-form"
import { z } from "zod";
import { UploadDropzone } from "@/app/api/uploadthing/upload";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LoaderCircle, Trash } from "lucide-react";
import { Reorder } from 'framer-motion';
import { useState } from "react";
import { ClientUploadedFileData } from "uploadthing/types";

export default function VariantImages() {
    const { getValues, control, setError } = useFormContext<z.infer<typeof VariantSchema>>();

    const { fields, remove, append, update, move } = useFieldArray({
        control,
        name: "variantImages"
    })

    const [active, setActive] = useState(0);

    const onImageUploadComplete = (files: ClientUploadedFileData<null>[]) => {
        const images = getValues('variantImages');
        images.map((field, index) => {
            if (field.url.search('blob:') == 0) {
                const image = files.find((img) => img.name === field.name)
                if (image) {
                    update(index, {
                        url: image.url,
                        name: image.name,
                        size: image.size,
                        key: image.key
                    })
                }
            }
        })
        return;
    }

    return (
        <div>
            <FormField
                control={control}
                name="variantImages"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Variant Tags</FormLabel>
                        <FormControl>
                            <UploadDropzone
                                className="ut-allowed-content:text-secondary-foreground ut-label:text-primary ut-upload-icon:text-primary/50 hover:bg-primary/10 transition-all duration-500 ease-in-out ut-button:bg-primary/75 ut-button:ut-readying:bg-secondary"
                                onUploadError={(error) => {
                                    setError('variantImages', {
                                        type: 'validate',
                                        message: error.message
                                    })
                                    return
                                }}
                                onBeforeUploadBegin={(files) => {
                                    files.map(file => append({
                                        name: file.name,
                                        size: file.size,
                                        url: URL.createObjectURL(file),
                                    }))
                                    return files;
                                }}
                                onClientUploadComplete={(files) => onImageUploadComplete(files)}
                                config={{ mode: 'auto' }}
                                endpoint="variantUploader" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <div className="rounded-md overflow-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead>Image</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <Reorder.Group
                        as="tbody"
                        values={fields}
                        onReorder={(e) => {
                            const activeElement = fields[active];
                            e.map((item, index) => {
                                if (item === activeElement) {
                                    move(active, index)
                                    setActive(index);
                                    return
                                }
                                return;
                            })
                        }}>
                        {fields.map((field, index) => (
                            <Reorder.Item as="tr"
                                id={field.id}
                                onDragStart={() => setActive(index)}
                                value={field}
                                key={field.id}
                                className={cn(
                                    field.url.search('blob:') == 0
                                        ? 'animate-pulse transition-all'
                                        : '',
                                    'text-sm font-bold text-muted-foreground hover:text-primary cursor-grab'
                                )}>
                                <TableCell>{index}</TableCell>
                                <TableCell>{field.name}</TableCell>
                                <TableCell>{(field.size / (1024 * 1024)).toFixed(2)} MB</TableCell>
                                <TableCell>
                                    {field.url.search('blob:') == 0 ? (
                                        <LoaderCircle className="animate-spin transition-all" />
                                    ) : (
                                        <div className="flex items-center justify-center">
                                            <Image
                                                src={field.url}
                                                alt={field.name}
                                                className="rounded-md object-cover"
                                                width={72}
                                                height={48} />
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            remove(index);
                                        }}
                                        variant={'ghost'}
                                        className="scale-75">
                                        <Trash className="h-4" />
                                    </Button>
                                </TableCell>
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>

                </Table>
            </div>
        </div>
    )
}