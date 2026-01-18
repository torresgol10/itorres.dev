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
                "group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-black/5",
                className
            )}
        >
            <div className="flex flex-1 flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <span key={category} className="inline-flex items-center rounded-md bg-secondary/80 px-2.5 py-1 text-xs font-medium text-secondary-foreground ring-1 ring-inset ring-secondary-foreground/10">
                                {category}
                            </span>
                        ))}
                    </div>
                    <time className="text-xs text-muted-foreground whitespace-nowrap ml-2">{date}</time>
                </div>

                <div className="space-y-3">
                    <h3 className="text-xl font-bold leading-snug tracking-tight text-foreground group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                    <p className="line-clamp-3 text-base leading-relaxed text-muted-foreground">
                        {excerpt}
                    </p>
                </div>

                <div className="mt-auto pt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    Leer más
                    <ArrowUpRight className="h-4 w-4" />
                </div>
            </div>
        </Link>
    );
}
