"use server"

import { db } from "@/server"
import { posts } from "../schema"
import { revalidatePath } from "next/cache";

export default async function createPost(formData: FormData){

    const title = formData.get("title")?.toString();

    if(!title){
        return { error: "Title is required" }
    }

    const data = await db.insert(posts).values({
        title: title
    }).then(() => {
        revalidatePath("/");
    }).catch((error) => {
        return { error: error.message }
    });

    return {success: data}; 
}