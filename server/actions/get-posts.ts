"use server"

import { db } from "@/server";
import { posts } from "../schema";

export default async function getPosts(){
    const data = await db.select().from(posts).limit(10);
    
    if(!data) return {error: "no posts found"};

    return {success: data}
}