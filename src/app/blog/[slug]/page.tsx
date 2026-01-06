
import { Header } from "@/components/Header";
import { TableOfContents, MobileTableOfContents } from "@/components/TableOfContents";
import { PostCard } from "@/components/PostCard";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { notFound } from "next/navigation";
import {
    getPostBySlug,
    getRelatedPosts,
    getAllPosts,
    extractToc,
    formatDate,
    calculateReadingTime
} from "@/lib/posts";
import { rehypeExtractCode } from "@/lib/rehype-plugins";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { MDXRemote } from "next-mdx-remote/rsc";
import { useMDXComponents } from "../../../../mdx-components";

// ...

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const post = getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const tocItems = extractToc(post.content);
    const readingTime = calculateReadingTime(post.content);
    const relatedPosts = getRelatedPosts(slug, post.categories, 3);
    const components = useMDXComponents({});

    const mdxOptions = {
        rehypePlugins: [
            rehypeSlug,
            [rehypeAutolinkHeadings, { behavior: "wrap" }],
            [
                rehypePrettyCode,
                {
                    theme: "github-dark",
                    keepBackground: false,
                    onVisitLine(node: any) {
                        if (node.children.length === 0) {
                            node.children = [{ type: "text", value: " " }];
                        }
                    },
                },
            ],
            rehypeExtractCode,
        ],
    };


    return (
        <div className="min-h-screen bg-background antialiased">
            <Header />

            {/* Mobile TOC - sticky below header */}
            <MobileTableOfContents items={tocItems} />

            <main className="mx-auto max-w-6xl px-6 py-10">
                {/* Back button */}
                <Link
                    href="/"
                    className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver al blog
                </Link>

                {/* Two column layout: Article left, TOC right */}
                <div className="xl:grid xl:grid-cols-[1fr_200px] xl:gap-12">
                    {/* Left: Article content */}
                    <article className="min-w-0 max-w-3xl">
                        {/* Header */}
                        <header className="mb-10">
                            {/* Categories */}
                            <div className="mb-4 flex flex-wrap gap-2">
                                {post.categories.map((category) => (
                                    <span key={category} className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                                        {category}
                                    </span>
                                ))}
                            </div>

                            {/* Title */}
                            <h1 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                                {post.title}
                            </h1>

                            {/* Author and meta */}
                            <div className="flex flex-wrap items-center gap-4 border-b border-border pb-6">
                                {/* Author */}
                                {post.author && (
                                    <div className="flex items-center gap-3">
                                        <Image
                                            src={post.author.avatar}
                                            alt={post.author.name}
                                            width={44}
                                            height={44}
                                            className="rounded-full ring-2 ring-border"
                                        />
                                        <div>
                                            <p className="font-medium text-foreground">{post.author.name}</p>
                                            <p className="text-sm text-muted-foreground">{post.author.role}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Divider */}
                                <div className="hidden h-8 w-px bg-border sm:block" />

                                {/* Date and reading time */}
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="h-4 w-4" />
                                        <span>{formatDate(post.date)}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="h-4 w-4" />
                                        <span>{readingTime}</span>
                                    </div>
                                </div>
                            </div>
                        </header>

                        {/* Featured Image */}
                        {post.image && (
                            <div className="relative mb-10 aspect-video overflow-hidden rounded-xl border border-border">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        )}

                        {/* MDX Content */}
                        <div className="prose-custom">
                            <MDXRemote
                                source={post.content}
                                components={components}
                                options={{
                                    mdxOptions: mdxOptions as any
                                }}
                            />
                        </div>
                    </article>

                    {/* Right: Table of Contents (Desktop only) */}
                    <TableOfContents items={tocItems} />
                </div>

                {/* Related Posts Section */}
                {relatedPosts.length > 0 && (
                    <section className="mt-20 border-t border-border pt-16">
                        <h2 className="mb-8 text-2xl font-bold tracking-tight">
                            Artículos relacionados
                        </h2>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {relatedPosts.map((relatedPost) => (
                                <PostCard key={relatedPost.slug} {...relatedPost} />
                            ))}
                        </div>
                    </section>
                )}
            </main>

            {/* Footer */}
            <footer className="border-t border-border/40 mt-20">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
                    <p className="text-sm text-muted-foreground">
                        © 2025 Torres. Todos los derechos reservados.
                    </p>
                </div>
            </footer>
        </div>
    );
}
