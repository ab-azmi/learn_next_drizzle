import { db } from "@/server";
import { DataTable } from "./data-table";
import { columns, ProductColumn } from "./columns";
import placeholder from "@/public/placeholder.svg";

export default async function Products(){
    const products = await db.query.products.findMany({
        orderBy: (products, {desc}) => [desc(products.id)],
    });

    if(!products) throw new Error('No products found');

    const dataTable = products.map<ProductColumn>(product => {
        return {
            id: product.id,
            title: product.title,
            price: product.price,
            variants: [],
            image: placeholder.src,
        }
    })

    return (
        <div>
            <DataTable columns={columns} data={dataTable}/>
        </div>
    );
}