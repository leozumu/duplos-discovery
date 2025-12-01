import { getPostBySlug } from "@/lib/api";
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

    const featuredImage =
        post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

    const authorName = post._embedded?.author?.[0]?.name || "Redacción";
    const date = new Date(post.date);

    return (
        <main className="min-h-screen bg-white pb-20">
            {/* Header / Navigation */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-2xl mx-auto px-4 h-14 flex items-center">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
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
                        className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight"
                        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />

                    <div className="flex items-center gap-6 text-sm text-gray-500 font-medium uppercase tracking-wider">
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
                    <div className="mb-10 rounded-xl overflow-hidden bg-gray-100 shadow-sm">
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
            </article>
        </main>
    );
}
