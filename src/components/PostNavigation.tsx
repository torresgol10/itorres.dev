import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { PostMeta } from "@/lib/posts";

interface PostNavigationProps {
    previousPost: PostMeta | null;
    nextPost: PostMeta | null;
}

export function PostNavigation({ previousPost, nextPost }: PostNavigationProps) {
    if (!previousPost && !nextPost) return null;

    return (
        <nav className="mt-16 grid gap-4 sm:grid-cols-2" aria-label="Navegación entre artículos">
            {/* Previous Post */}
            <div>
                {previousPost && (
                    <Link
                        href={`/blog/${previousPost.slug}`}
                        className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md"
                    >
                        <span className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                            Anterior
                        </span>
                        <span className="font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                            {previousPost.title}
                        </span>
                    </Link>
                )}
            </div>

            {/* Next Post */}
            <div className="sm:text-right">
                {nextPost && (
                    <Link
                        href={`/blog/${nextPost.slug}`}
                        className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md sm:items-end"
                    >
                        <span className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Siguiente
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </span>
                        <span className="font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                            {nextPost.title}
                        </span>
                    </Link>
                )}
            </div>
        </nav>
    );
}
