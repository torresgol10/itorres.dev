"use client";

import { useState } from "react";
import { PostCard } from "./PostCard";
import { Search } from "lucide-react";
import { PostMeta } from "@/lib/posts";

interface BlogListProps {
    initialPosts: PostMeta[];
}

export function BlogList({ initialPosts }: BlogListProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredPosts = initialPosts.filter((post) => {
        const query = searchQuery.toLowerCase();
        return (
            post.title.toLowerCase().includes(query) ||
            post.excerpt.toLowerCase().includes(query) ||
            post.categories.some((cat) => cat.toLowerCase().includes(query))
        );
    });

    return (
        <div className="space-y-10">
            {/* Search Input */}
            <div className="relative mx-auto max-w-2xl">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                    type="text"
                    placeholder="Buscar artículos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12 w-full rounded-full border border-border bg-background pl-11 pr-4 text-foreground shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
            </div>

            {/* Results */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                        <PostCard key={post.slug} {...post} />
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center text-muted-foreground">
                        <p className="text-lg">No se encontraron artículos para "{searchQuery}"</p>
                    </div>
                )}
            </div>
        </div>
    );
}
