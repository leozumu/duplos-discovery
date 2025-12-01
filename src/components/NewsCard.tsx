import React, { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, User } from "lucide-react";
import { WPPost } from "@/lib/types";
import { cn } from "@/lib/utils";

interface NewsCardProps {
    post: WPPost;
    relatedPosts?: WPPost[];
}

export function NewsCard({ post }: NewsCardProps) {
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    const featuredImage =
        post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
        "https://via.placeholder.com/800x400?text=No+Image";

    const authorName = post._embedded?.author?.[0]?.name || "Redacción";
    const date = new Date(post.date);

    return (
        <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-zinc-900 transition-all hover:bg-zinc-800/80 mb-6">
            {/* Image Section - Clickable */}
            <Link href={`/${post.slug}`} className="block w-full">
                <div className="relative aspect-video w-full overflow-hidden bg-zinc-800">
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
            <div className="flex flex-col px-4 pt-3 pb-4">
                {/* Title */}
                <Link href={`/${post.slug}`} className="block">
                    <h2
                        className="text-lg font-bold leading-tight text-zinc-100 group-hover:text-white transition-colors line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />
                </Link>

                {/* Metadata Footer */}
                <div className="mt-3 flex items-center gap-3 text-xs text-zinc-500 font-medium">
                    <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span className="truncate max-w-[100px]">{authorName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{format(date, "d MMM", { locale: es })}</span>
                    </div>
                </div>
            </div>
        </article>
    );
}

export function NewsCardSkeleton() {
    return (
        <div className="mb-6 overflow-hidden rounded-2xl bg-zinc-900">
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
