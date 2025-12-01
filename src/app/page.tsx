import { getPosts, getCategories } from "@/lib/api";
import { ContentWrapper } from "@/components/ContentWrapper";

export const revalidate = 60; // Revalidate page every 60 seconds

export default async function Home() {
  const [posts, categories] = await Promise.all([
    getPosts(1),
    getCategories()
  ]);

  return (
    <main className="min-h-screen">
      <ContentWrapper initialPosts={posts} categories={categories} />
    </main>
  );
}
