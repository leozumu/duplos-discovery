import { getPostBySlug, getPosts } from "@/lib/api";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        return {
            title: "Not Found",
        };
    }

    return {
        title: post.title.rendered,
        description: post.excerpt.rendered.replace(/<[^>]*>?/gm, "").slice(0, 160),
    };
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    // Fetch related posts (latest posts excluding current one)
    const allPosts = await getPosts(1, 6);
    const relatedPosts = allPosts.filter(p => p.id !== post.id).slice(0, 4);

    const featuredImage =
        post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

    const authorName = post._embedded?.author?.[0]?.name || "Redacción";
    const date = new Date(post.date);

    return (
        <main className="min-h-screen bg-white dark:bg-zinc-950 pb-20 transition-colors duration-300">
            {/* Header / Navigation */}
            <div className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-zinc-800/50 transition-colors duration-300">
                <div className="max-w-2xl mx-auto px-4 h-14 flex items-center">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-gray-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                        <span className="font-medium text-sm">Volver</span>
                    </Link>
                </div>
            </div>

            <article className="max-w-2xl mx-auto px-4 py-8">
                {/* Header */}
                <header className="mb-8">
                    <h1
                        className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight tracking-tight transition-colors duration-300"
                        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />

                    <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-zinc-400 font-medium uppercase tracking-wider transition-colors duration-300">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 opacity-70" />
                            <span>{authorName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 opacity-70" />
                            <span>{format(date, "d MMM, yyyy", { locale: es })}</span>
                        </div>
                    </div>
                </header>

                {/* Featured Image */}
                {featuredImage && (
                    <div className="mb-10 rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-900 shadow-lg border border-gray-200 dark:border-zinc-800/50 transition-colors duration-300">
                        <img
                            src={featuredImage}
                            alt={post.title.rendered}
                            className="w-full h-auto object-cover"
                        />
                    </div>
                )}

                {/* Content */}
                <div
                    className="post-content"
                    dangerouslySetInnerHTML={{ __html: post.content.rendered }}
                />

                {/* Related News Section */}
                {relatedPosts.length > 0 && (
                    <div className="mt-16 pt-8 border-t border-gray-200 dark:border-zinc-800 transition-colors duration-300">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">Noticias Relacionadas</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {relatedPosts.map((related) => {
                                const relatedImage = related._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "https://via.placeholder.com/400x300?text=No+Image";
                                return (
                                    <Link key={related.id} href={`/${related.slug}`} className="group block bg-gray-50 dark:bg-zinc-900/50 rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-800/50 hover:border-gray-300 dark:hover:border-zinc-700 hover:bg-white dark:hover:bg-zinc-900 transition-all duration-300">
                                        <div className="aspect-video w-full overflow-hidden bg-gray-200 dark:bg-zinc-800">
                                            <img
                                                src={relatedImage}
                                                alt={related.title.rendered}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="p-3">
                                            <h4
                                                className="text-sm font-semibold text-gray-800 dark:text-zinc-200 group-hover:text-black dark:group-hover:text-white line-clamp-2 leading-snug transition-colors duration-300"
                                                dangerouslySetInnerHTML={{ __html: related.title.rendered }}
                                            />
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </article>
        </main>
    );
}
