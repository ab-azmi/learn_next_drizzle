"use client"

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { deleteProduct } from "@/server/actions/delete-product";
import { ColumnDef, Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ProductColumn = {
    id: number,
    title: string,
    price: number,
    variants: [],
    image: string,
}

const ActionCell = ({ row }: { row: Row<ProductColumn> }) => {
    const { status, execute } = useAction(deleteProduct, {
        onSuccess: (res) => {
            if (res?.data?.success) {
                toast.success(res.data.success);
            }
            if (res?.data?.error) {
                toast.error(res.data.error);
            }

            toast.dismiss();
        },
        onExecute: () => {
            toast.loading('Deleting product...');
        }
    });
    const product = row.original as ProductColumn;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size={'sm'} variant={'ghost'}>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem className="dark:focus:bg-primary focus:bg-primary/50 cursor-pointer">
                    <Link href={`/dashboard/add-product?id=${product.id}`}>
                        Edit Product
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => execute({ id: product.id })}
                    className="dark:focus:bg-destructive focus:bg-destructive/50 cursor-pointer">
                    Delete Product
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export const columns: ColumnDef<ProductColumn>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "variants",
        header: "Variants",
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => {
            const price = parseFloat(row.getValue("price"));
            const formatted = new Intl.NumberFormat("en-US", {
                currency: 'USD',
                style: 'currency',
            }).format(price);

            return formatted;
        }
    },
    {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }) => {
            const image = row.getValue("image") as string;
            const title = row.getValue("title") as string;
            return (
                <div>
                    <Image src={image} width={50} height={50} alt={title} className="rounded-md" />
                </div>
            );
        }
    },
    {
        accessorKey: "actions",
        header: "Actions",
        cell: ActionCell
    }
]
