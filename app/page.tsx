import createPost from "@/server/actions/create-post";
import getPosts from "@/server/actions/get-posts";

export default async function Home() {
  const {error, success} = await getPosts();

  if (error) throw new Error(error);

  return (
   <main>
    {success?.map(post => (
      <div key={post.id}>
        <h2>{post.title}</h2>
      </div>
    ))}
    <h1>Welcome to next d JS</h1>
    <form action={createPost}>
      <input className="text-black" type="text" name="title" id="title" />
      <button type="submit">Submit</button>
    </form>
   </main>
  );
}
