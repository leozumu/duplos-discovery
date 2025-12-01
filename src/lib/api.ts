import { WPPost, Category } from "./types";

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || "https://www.duplos.cl/wp-json/wp/v2";

export async function getPosts(page: number = 1, perPage: number = 10, categoryId?: number): Promise<WPPost[]> {
    try {
        let url = `${API_URL}/posts?_embed&per_page=${perPage}&page=${page}`;
        if (categoryId) {
            url += `&categories=${categoryId}`;
        }

        const res = await fetch(url, {
            next: { revalidate: 60 }, // Revalidate every 60 seconds
        });

        if (!res.ok) {
            throw new Error("Failed to fetch posts");
        }

        return res.json();
    } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
    }
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
    try {
        const res = await fetch(`${API_URL}/posts?slug=${slug}&_embed`, {
            next: { revalidate: 60 },
        });

        if (!res.ok) {
            throw new Error("Failed to fetch post");
        }

        const posts = await res.json();
        return posts.length > 0 ? posts[0] : null;
    } catch (error) {
        console.error("Error fetching post by slug:", error);
        return null;
    }
}

export async function getCategories(): Promise<Category[]> {
    try {
        const res = await fetch(`${API_URL}/categories?per_page=20&orderby=count&order=desc`, {
            next: { revalidate: 3600 }
        });
        if (!res.ok) throw new Error("Failed to fetch categories");
        return res.json();
    } catch (error) {
        console.error("Error fetching categories", error);
        return [];
    }
}
