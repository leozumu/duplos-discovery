import { WPPost } from "./types";

export function getRelatedPosts(currentPost: WPPost, allPosts: WPPost[], limit: number = 3): WPPost[] {
    if (!allPosts || allPosts.length === 0) return [];

    const currentTags = new Set(currentPost.tags);
    const currentCategories = new Set(currentPost.categories);

    const scoredPosts = allPosts
        .filter((post) => post.id !== currentPost.id) // Exclude current post
        .map((post) => {
            let score = 0;

            // Check for matching tags
            const matchingTags = post.tags.filter((tag) => currentTags.has(tag)).length;
            score += matchingTags * 2; // Tags are worth more

            // Check for matching categories
            const matchingCategories = post.categories.filter((cat) => currentCategories.has(cat)).length;
            score += matchingCategories * 1;

            return { post, score };
        });

    // Filter by minimum relevance (e.g., at least 1 match) and sort by score
    return scoredPosts
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((item) => item.post);
}
