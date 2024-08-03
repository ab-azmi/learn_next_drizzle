"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { VariantsWithImagesTags } from "@/lib/infer-types"

export default function ProductVariant(
    { editMode, productID, variant, children }:
        {
            editMode: boolean,
            productID?: number,
            variant?: VariantsWithImagesTags,
            children: React.ReactNode
        }) {
    return (
        <Dialog>
            <DialogTrigger>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Lmao</DialogTitle>
                    <DialogDescription>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam, impedit.
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}