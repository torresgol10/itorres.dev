"use client";

import { useState, useMemo } from "react";
import { PostCard } from "./PostCard";
import { Search, X } from "lucide-react";
import { PostMeta } from "@/lib/posts";

interface BlogListProps {
    initialPosts: PostMeta[];
}

export function BlogList({ initialPosts }: BlogListProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Extract unique categories from all posts
    const allCategories = useMemo(() => {
        const categories = new Set<string>();
        initialPosts.forEach((post) => {
            post.categories.forEach((cat) => categories.add(cat));
        });
        return Array.from(categories).sort();
    }, [initialPosts]);

    const filteredPosts = initialPosts.filter((post) => {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
            post.title.toLowerCase().includes(query) ||
            post.excerpt.toLowerCase().includes(query) ||
            post.categories.some((cat) => cat.toLowerCase().includes(query));

        const matchesCategory = !selectedCategory || post.categories.includes(selectedCategory);

        return matchesSearch && matchesCategory;
    });

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedCategory(null);
    };

    return (
        <div className="space-y-8">
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

            {/* Category Filters */}
            <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                    onClick={() => setSelectedCategory(null)}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${selectedCategory === null
                            ? "bg-foreground text-background"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                >
                    Todos
                </button>
                {allCategories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${selectedCategory === category
                                ? "bg-foreground text-background"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Active filters indicator */}
            {(searchQuery || selectedCategory) && (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <span>
                        {filteredPosts.length} resultado{filteredPosts.length !== 1 ? "s" : ""}
                    </span>
                    <button
                        onClick={clearFilters}
                        className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs hover:bg-muted/80"
                    >
                        <X className="h-3 w-3" />
                        Limpiar
                    </button>
                </div>
            )}

            {/* Results */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                        <PostCard key={post.slug} {...post} />
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center text-muted-foreground">
                        <p className="text-lg">No se encontraron artículos</p>
                        <button
                            onClick={clearFilters}
                            className="mt-2 text-primary hover:underline"
                        >
                            Limpiar filtros
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
