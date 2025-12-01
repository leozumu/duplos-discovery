"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { WPPost } from "@/lib/types";
import { getPosts } from "@/lib/api";
import { getRelatedPosts } from "@/lib/recommendations";
import { NewsCard, NewsCardSkeleton } from "./NewsCard";
import { cn } from "@/lib/utils";

interface FeedProps {
    initialPosts: WPPost[];
    selectedCategory?: number | null;
}

export function Feed({ initialPosts, selectedCategory }: FeedProps) {
    const [posts, setPosts] = useState<WPPost[]>(initialPosts);
    const [page, setPage] = useState(2); // Start from page 2 since initial is page 1
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef<IntersectionObserver | null>(null);

    // Reset feed when category changes
    useEffect(() => {
        const fetchCategoryPosts = async () => {
            setLoading(true);
            setPosts([]); // Clear current posts
            try {
                // Fetch page 1 for the new category (or all posts if null)
                const newPosts = await getPosts(1, 10, selectedCategory || undefined);
                setPosts(newPosts);
                setPage(2);
                setHasMore(newPosts.length > 0);
            } catch (error) {
                console.error("Error fetching category posts:", error);
            } finally {
                setLoading(false);
            }
        };

        // Only fetch if selectedCategory is defined (it can be null, which means "All")
        // We skip the initial render fetch if we want to use initialPosts, 
        // but since initialPosts are passed from server, we might want to use them.
        // However, if selectedCategory changes, we MUST fetch.
        // To avoid double fetch on mount (if selectedCategory is null initially), 
        // we can check if posts match initialPosts? 
        // Simpler: If selectedCategory is provided (even null) and different from what initialPosts represents...
        // But initialPosts represents "All" (null).
        // Let's just say: if this component mounts, we use initialPosts. 
        // If selectedCategory changes *after* mount, we fetch.
        // But selectedCategory comes from props.

        // Actually, the parent `ContentWrapper` initializes `selectedCategory` to `null`.
        // So on mount, `selectedCategory` is `null`.
        // We should NOT fetch on mount if we have initialPosts and category is null.

    }, [selectedCategory]);

    // Better approach for the useEffect to avoid initial double fetch:
    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const fetchCategoryPosts = async () => {
            setLoading(true);
            setPosts([]); // Clear current posts
            try {
                const newPosts = await getPosts(1, 10, selectedCategory || undefined);
                setPosts(newPosts);
                setPage(2);
                setHasMore(newPosts.length > 0);
            } catch (error) {
                console.error("Error fetching category posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryPosts();
    }, [selectedCategory]);


    const lastPostElementRef = useCallback(
        (node: HTMLDivElement) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    loadMorePosts();
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    const loadMorePosts = async () => {
        setLoading(true);
        try {
            const newPosts = await getPosts(page, 10, selectedCategory || undefined);
            if (newPosts.length === 0) {
                setHasMore(false);
            } else {
                setPosts((prev) => {
                    // Filter out duplicates just in case
                    const existingIds = new Set(prev.map(p => p.id));
                    const uniqueNewPosts = newPosts.filter(p => !existingIds.has(p.id));
                    return [...prev, ...uniqueNewPosts];
                });
                setPage((prev) => prev + 1);
            }
        } catch (error) {
            console.error("Error loading more posts:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 pt-24 pb-20 space-y-8">
            {posts.map((post, index) => {
                const isFeatured = index === 0 && page === 2; // First post of the first page load
                const related = getRelatedPosts(post, posts);

                return (
                    <div
                        ref={posts.length === index + 1 ? lastPostElementRef : null}
                        key={post.id}
                        className={cn(
                            "transition-all duration-500",
                            isFeatured ? "mb-10 scale-100" : "mb-6"
                        )}
                    >
                        {isFeatured && (
                            <div className="mb-4 flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                                <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                                    Destacado
                                </span>
                            </div>
                        )}
                        <NewsCard post={post} relatedPosts={related} />
                    </div>
                );
            })}

            {loading && (
                <div className="space-y-6">
                    <NewsCardSkeleton />
                    <NewsCardSkeleton />
                </div>
            )}

            {!hasMore && posts.length > 0 && (
                <div className="text-center py-12 text-zinc-500 text-sm font-medium">
                    Has llegado al final
                </div>
            )}

            {!loading && posts.length === 0 && (
                <div className="text-center py-32 text-zinc-500">
                    <p className="text-lg">No se encontraron noticias</p>
                </div>
            )}
        </div>
    );
}
