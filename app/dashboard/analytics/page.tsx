import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/server";
import { orderProduct } from "@/server/schema";
import { desc } from "drizzle-orm";
import Sales from "./sales";
import Earnings from "./earnings";

export const revalidate = 0

export default async function Analytics(){
    const totalOrders = await db.query.orderProduct.findMany({
        orderBy: [desc(orderProduct.id)],
        limit: 10,
        with: {
            order: {with: {user: true}},
            product: true,
            productVariant: {with: {variantImages: true}}
        }
    })
    if(totalOrders.length === 0){
        return (
            <Card>
                <CardHeader>
                    <CardTitle>No Orders</CardTitle>
                </CardHeader>
            </Card>
        )
    }

    if(totalOrders){
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Your Analytics</CardTitle>
                    <CardDescription>Check your sales, new customer and more</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                    <Sales totalOrders={totalOrders}/>
                    <Earnings totalOrders={totalOrders}/>
                </CardContent>
            </Card>
        )
    }
}