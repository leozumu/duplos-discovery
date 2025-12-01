import React, { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, User, ArrowRight } from "lucide-react";
import { WPPost } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useDominantColor } from "@/hooks/useDominantColor";

interface NewsCardProps {
    post: WPPost;
    relatedPosts?: WPPost[];
}

export function NewsCard({ post, relatedPosts = [] }: NewsCardProps) {
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    const featuredImage =
        post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
        "https://via.placeholder.com/800x400?text=No+Image";

    const { color, isDark } = useDominantColor(featuredImage);

    const authorName = post._embedded?.author?.[0]?.name || "Redacción";
    const date = new Date(post.date);

    return (
        <article
            className="group relative flex flex-col overflow-hidden rounded-2xl transition-all duration-500 mb-6 shadow-sm hover:shadow-md"
            style={{
                backgroundColor: color || 'rgb(24, 24, 27)', // Fallback to zinc-900
                color: isDark ? '#f4f4f5' : '#18181b' // zinc-100 or zinc-900
            }}
        >
            {/* Image Section - Clickable */}
            <Link href={`/${post.slug}`} className="block w-full">
                <div className="relative aspect-video w-full overflow-hidden rounded-t-2xl">
                    <img
                        src={featuredImage}
                        alt={post.title.rendered}
                        className={cn(
                            "h-full w-full object-cover transition-opacity duration-500",
                            isImageLoaded ? "opacity-100" : "opacity-0"
                        )}
                        onLoad={() => setIsImageLoaded(true)}
                        loading="lazy"
                    />
                    {!isImageLoaded && (
                        <div className="absolute inset-0 animate-pulse bg-zinc-800" />
                    )}
                </div>
            </Link>

            {/* Content Section */}
            <div className="flex flex-col p-5">
                {/* Title */}
                <Link href={`/${post.slug}`} className="block">
                    <h2
                        className="text-[19px] font-bold leading-tight transition-colors line-clamp-3 tracking-tight mb-3"
                        style={{ color: isDark ? '#ffffff' : '#000000' }}
                        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />
                </Link>

                {/* Metadata Footer */}
                <div
                    className="flex items-center justify-between text-xs font-medium opacity-80"
                    style={{ color: isDark ? '#a1a1aa' : '#52525b' }} // zinc-400 or zinc-600
                >
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                            <User className="h-3 w-3" />
                            <span className="truncate max-w-[100px]">{authorName}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Calendar className="h-3 w-3" />
                            <span>{format(date, "d MMM", { locale: es })}</span>
                        </div>
                    </div>
                </div>

                {/* Related Threads (Sticky UX) */}
                {relatedPosts.length > 0 && (
                    <div
                        className="mt-4 border-t pt-3"
                        style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
                    >
                        <ul className="space-y-2">
                            {relatedPosts.slice(0, 2).map((related) => (
                                <li key={related.id}>
                                    <Link
                                        href={`/${related.slug}`}
                                        className="flex items-center gap-2 text-xs font-medium transition-colors group/link"
                                        style={{ color: isDark ? '#60a5fa' : '#2563eb' }} // blue-400 or blue-600
                                    >
                                        <ArrowRight className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5" />
                                        <span dangerouslySetInnerHTML={{ __html: related.title.rendered }} className="line-clamp-1" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </article>
    );
}

export function NewsCardSkeleton() {
    return (
        <div className="mb-6 overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800">
            <div className="aspect-video w-full animate-pulse bg-zinc-800" />
            <div className="p-4">
                <div className="mb-3 h-6 w-3/4 animate-pulse rounded bg-zinc-800" />
                <div className="flex gap-3">
                    <div className="h-3 w-16 animate-pulse rounded bg-zinc-800" />
                    <div className="h-3 w-16 animate-pulse rounded bg-zinc-800" />
                </div>
            </div>
        </div>
    );
}
