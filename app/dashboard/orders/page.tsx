import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { db } from "@/server";
import { auth } from "@/server/auth";
import { orders } from "@/server/schema";
import { DialogDescription } from "@radix-ui/react-dialog";
import { formatDistance, subMinutes } from "date-fns";
import { eq } from "drizzle-orm";
import { MoreHorizontal, Tangent } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {
    const user = await auth();
    if (!user) return redirect('/login');

    const userOrders = await db.query.orders.findMany({
        where: eq(orders.userID, user.user.id),
        with: {
            orderProduct: {
                with: {
                    product: true,
                    productVariant: {
                        with: {
                            variantImages: true
                        }
                    },
                    order: true
                }
            }
        },
        orderBy: (orders, {desc}) => [desc(orders.created)]
    })

    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Orders</CardTitle>
                <CardDescription>Check status of your orders</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableCaption>A List of your recent orders</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order Number</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {userOrders.map(order => (
                            <TableRow key={order.id}>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>${order.total}</TableCell>
                                <TableCell>
                                    <Badge className={order.status === 'succeeded' ? 'bg-green-700' : 'bg-yellow-700'}>{order.status}</Badge>
                                </TableCell>
                                <TableCell>
                                    {formatDistance(subMinutes(order.created!, 0), new Date(), {
                                        addSuffix: true
                                    })}
                                </TableCell>
                                <TableCell>
                                    <Dialog>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant={'ghost'}>
                                                    <MoreHorizontal size={16} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem>
                                                    <DialogTrigger>
                                                        <Button className="w-full" variant={'ghost'}>
                                                            View Detail
                                                        </Button>
                                                    </DialogTrigger>
                                                </DropdownMenuItem>
                                                {order.receiptURL ? (
                                                <DropdownMenuItem>
                                                    <Button asChild className="w-full" variant={'ghost'}>
                                                        <Link href={order.receiptURL!} target="__blank">
                                                            Downdload Receipt
                                                        </Link>
                                                    </Button>
                                                </DropdownMenuItem>
                                                ) : null}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <DialogContent className="rounded-md">
                                            <DialogHeader>
                                                <DialogTitle>Order Details #{order.id}</DialogTitle>
                                                <DialogDescription>
                                                    Total is ${order.total}
                                                </DialogDescription>
                                            </DialogHeader>
                                            <Card className="overflow-auto p-2 flex flex-col gap-4">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Image</TableHead>
                                                            <TableHead>Price</TableHead>
                                                            <TableHead>Product</TableHead>
                                                            <TableHead>Color</TableHead>
                                                            <TableHead>Quantity</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {order.orderProduct.map(({ product, productVariant, quantity }) => (
                                                            <TableRow key={product.id}>
                                                                <TableCell>
                                                                    <Image src={productVariant.variantImages[0].url} width={50} height={50} alt={product.title} />
                                                                </TableCell>
                                                                <TableCell>
                                                                    ${product.price}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <span className="font-bold text-sm">{product.title}</span>
                                                                    <p className="text-xs">{productVariant.productType}</p>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div style={{ background: productVariant.color }} className='h-4 w-4 rounded-full'></div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    {quantity}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </Card>
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}