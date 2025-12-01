import React, { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, User, ArrowRight } from "lucide-react";
import { WPPost } from "@/lib/types";
import { cn } from "@/lib/utils";

interface NewsCardProps {
    post: WPPost;
    relatedPosts?: WPPost[];
}

export function NewsCard({ post, relatedPosts = [] }: NewsCardProps) {
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    const featuredImage =
        post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
        "https://via.placeholder.com/800x400?text=No+Image";

    const authorName = post._embedded?.author?.[0]?.name || "Redacción";
    const date = new Date(post.date);

    return (
        <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-zinc-900/50 border border-zinc-800/50 transition-all hover:bg-zinc-900 hover:border-zinc-700 mb-6">
            {/* Image Section - Clickable */}
            <Link href={`/${post.slug}`} className="block w-full">
                <div className="relative aspect-video w-full overflow-hidden bg-zinc-800 rounded-t-2xl">
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
            <div className="flex flex-col p-4">
                {/* Title */}
                <Link href={`/${post.slug}`} className="block">
                    <h2
                        className="text-[17px] font-semibold leading-snug text-zinc-100 group-hover:text-white transition-colors line-clamp-2 tracking-tight"
                        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />
                </Link>

                {/* Metadata Footer */}
                <div className="mt-3 flex items-center justify-between text-xs text-zinc-500 font-medium">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                            <User className="h-3 w-3 opacity-70" />
                            <span className="truncate max-w-[100px]">{authorName}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Calendar className="h-3 w-3 opacity-70" />
                            <span>{format(date, "d MMM", { locale: es })}</span>
                        </div>
                    </div>
                </div>

                {/* Related Threads (Sticky UX) */}
                {relatedPosts.length > 0 && (
                    <div className="mt-4 border-t border-zinc-800/50 pt-3">
                        <ul className="space-y-2">
                            {relatedPosts.slice(0, 2).map((related) => (
                                <li key={related.id}>
                                    <Link
                                        href={`/${related.slug}`}
                                        className="flex items-center gap-2 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors group/link"
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
