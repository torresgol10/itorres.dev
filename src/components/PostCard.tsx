import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

interface PostCardProps {
    title: string;
    excerpt: string;
    date: string;
    categories: string[];
    slug: string;
    className?: string;
}

export function PostCard({
    title,
    excerpt,
    date,
    categories,
    slug,
    className,
}: PostCardProps) {
    return (
        <Link
            href={`/blog/${slug}`}
            className={cn(
                "group relative flex flex-col overflow-hidden rounded-2xl border border-border/40 bg-card/50 p-8 transition-all duration-300 hover:border-primary/20 hover:bg-card hover:shadow-xl hover:shadow-primary/5",
                className
            )}
        >
            <div className="flex flex-1 flex-col gap-5">
                <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <span key={category} className="inline-flex items-center rounded-md bg-secondary/50 px-2.5 py-1 text-xs font-medium text-secondary-foreground ring-1 ring-inset ring-secondary-foreground/10 transition-colors group-hover:bg-secondary">
                                {category}
                            </span>
                        ))}
                    </div>
                    <time className="text-xs font-medium text-muted-foreground whitespace-nowrap ml-2">{date}</time>
                </div>

                <div className="space-y-3">
                    <h3 className="text-2xl font-bold leading-tight tracking-tight text-foreground group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                    <p className="line-clamp-3 text-base leading-relaxed text-muted-foreground group-hover:text-muted-foreground/80">
                        {excerpt}
                    </p>
                </div>

                <div className="mt-auto pt-6 flex items-center gap-2 text-sm font-medium text-primary translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    Leer artículo
                    <ArrowUpRight className="h-4 w-4" />
                </div>
            </div>
        </Link>
    );
}
