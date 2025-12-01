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
    // Ideally we would fetch by category, but for now we'll fetch latest and filter
    const allPosts = await getPosts(1, 6);
    const relatedPosts = allPosts.filter(p => p.id !== post.id).slice(0, 4);

    const featuredImage =
        post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

    const authorName = post._embedded?.author?.[0]?.name || "Redacción";
    const date = new Date(post.date);

    return (
        <main className="min-h-screen bg-zinc-950 pb-20">
            {/* Header / Navigation */}
            <div className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
                <div className="max-w-2xl mx-auto px-4 h-14 flex items-center">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span className="font-medium">Volver</span>
                    </Link>
                </div>
            </div>

            <article className="max-w-2xl mx-auto px-4 py-8">
                {/* Header */}
                <header className="mb-8">
                    <h1
                        className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight"
                        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />

                    <div className="flex items-center gap-6 text-sm text-zinc-400 font-medium uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{authorName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{format(date, "d MMM, yyyy", { locale: es })}</span>
                        </div>
                    </div>
                </header>

                {/* Featured Image */}
                {featuredImage && (
                    <div className="mb-10 rounded-xl overflow-hidden bg-zinc-900 shadow-sm border border-zinc-800">
                        <img
                            src={featuredImage}
                            alt={post.title.rendered}
                            className="w-full h-auto object-cover"
                        />
                    </div>
                )}

                {/* Content */}
                <div
                    className="post-content space-y-4 text-zinc-300"
                    dangerouslySetInnerHTML={{ __html: post.content.rendered }}
                />

                {/* Related News Section */}
                {relatedPosts.length > 0 && (
                    <div className="mt-16 pt-8 border-t border-zinc-800">
                        <h3 className="text-xl font-bold text-white mb-6">Noticias Relacionadas</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {relatedPosts.map((related) => {
                                const relatedImage = related._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "https://via.placeholder.com/400x300?text=No+Image";
                                return (
                                    <Link key={related.id} href={`/${related.slug}`} className="group block bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-all">
                                        <div className="aspect-video w-full overflow-hidden bg-zinc-800">
                                            <img
                                                src={relatedImage}
                                                alt={related.title.rendered}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="p-3">
                                            <h4
                                                className="text-sm font-semibold text-zinc-200 group-hover:text-white line-clamp-2 leading-snug"
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
