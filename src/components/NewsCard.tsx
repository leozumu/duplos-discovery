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
        <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-md border border-gray-100 mb-6">
            {/* Image Section */}
            <Link href={`/${post.slug}`} className="block">
                <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
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
                        <div className="absolute inset-0 animate-pulse bg-gray-200" />
                    )}
                </div>
            </Link>

            {/* Content Section */}
            <div className="flex flex-col p-5">
                {/* Metadata */}
                <div className="mb-3 flex items-center gap-4 text-xs text-gray-500 font-medium uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{authorName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{format(date, "d MMM, yyyy", { locale: es })}</span>
                    </div>
                </div>

                {/* Title */}
                <Link href={`/${post.slug}`}>
                    <h2
                        className="mb-3 text-xl font-bold leading-tight text-gray-900 group-hover:text-blue-600 transition-colors"
                        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />
                </Link>

                {/* Excerpt */}
                <div
                    className="mb-4 text-sm text-gray-600 line-clamp-3 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                />

                {/* Related Threads (Sticky UX) */}
                {relatedPosts.length > 0 && (
                    <div className="mt-4 border-t border-gray-100 pt-4">
                        <h3 className="mb-2 text-xs font-semibold uppercase text-gray-400">
                            Hilos Relacionados
                        </h3>
                        <ul className="space-y-2">
                            {relatedPosts.map((related) => (
                                <li key={related.id}>
                                    <a
                                        href={related.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                                    >
                                        <span dangerouslySetInnerHTML={{ __html: related.title.rendered }} className="line-clamp-1" />
                                        <ArrowRight className="h-3 w-3 opacity-50" />
                                    </a>
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
        <div className="mb-6 overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
            <div className="aspect-video w-full animate-pulse bg-gray-200" />
            <div className="p-5">
                <div className="mb-3 flex gap-4">
                    <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
                    <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
                </div>
                <div className="mb-3 h-6 w-3/4 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-full animate-pulse rounded bg-gray-200 mb-2" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
            </div>
        </div>
    );
}
