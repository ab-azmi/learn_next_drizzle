import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TotalOrders } from "@/lib/infer-types";
import Image from "next/image";

export default function Sales({ totalOrders }: { totalOrders: TotalOrders[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>New Sales</CardTitle>
                <CardDescription>Here are your recent sales</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Item</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Image</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {totalOrders.map(({ order, product, quantity, productVariant }) => (
                            <TableRow key={order.id} className="font-medium">
                                <TableCell>
                                    {order.user.image && order.user.name ? (
                                        <div className="flex w-32 gap-2 items-center">
                                            <Image
                                                src={order.user.image}
                                                alt={order.user.name}
                                                width={25} height={25}
                                                className="rounded-full" />
                                            <p className="text-xs font-medium">{order.user.name}</p>
                                        </div>
                                    ) : (
                                        <div className="flex w-32 gap-2 items-center">
                                            <Image
                                                src='https://plachttps://placehold.co/250x250?text=Image'
                                                alt={'user not found'}
                                                width={25} height={25}
                                                className="rounded-full" />
                                            <p className="text-xs font-medium">
                                                User not found
                                            </p>
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {product.title}
                                </TableCell>
                                <TableCell>
                                    ${product.price}
                                </TableCell>
                                <TableCell>
                                    {quantity}
                                </TableCell>
                                <TableCell>
                                    <Image
                                        src={productVariant.variantImages[0].url}
                                        alt={product.title}
                                        width={48}
                                        height={48}/>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}