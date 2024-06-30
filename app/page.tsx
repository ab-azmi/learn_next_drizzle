import getPosts from "@/server/actions/get-posts";
import Image from "next/image";

export default async function Home() {
  const {error, success} = await getPosts();
  console.log(success);
  if (error) throw new Error(error);

  return (
   <main>
    {success?.map(post => (
      <div key={post.id}>
        <h2>{post.title}</h2>
      </div>
    ))}
    <h1>Welcome to next d JS</h1>
   </main>
  );
}
