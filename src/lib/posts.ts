import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content/posts");

export interface PostMeta {
    slug: string;
    title: string;
    date: string;
    categories: string[];
    excerpt: string;
    image: string;
    imageAlt: string;
    draft?: boolean;
    author?: {
        name: string;
        role: string;
        avatar: string;
    };
}

export interface Post extends PostMeta {
    content: string;
}

export interface TocItem {
    id: string;
    text: string;
    level: number;
}

// Get all post slugs
export function getPostSlugs(): string[] {
    if (!fs.existsSync(postsDirectory)) {
        return [];
    }
    return fs.readdirSync(postsDirectory).filter((file) => file.endsWith(".mdx"));
}

// Get post by slug
export function getPostBySlug(slug: string): Post | null {
    const realSlug = slug.replace(/\.mdx$/, "");
    const fullPath = path.join(postsDirectory, `${realSlug}.mdx`);

    if (!fs.existsSync(fullPath)) {
        return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    // Handle legacy category vs new categories vs tags
    let categories: string[] = [];
    if (data.categories && Array.isArray(data.categories)) {
        categories = data.categories;
    } else if (data.tags && Array.isArray(data.tags)) {
        categories = data.tags; // Fallback: use tags as categories
    } else if (data.category) {
        categories = [data.category];
    } else {
        categories = ["General"];
    }

    return {
        slug: realSlug,
        title: data.title || "Untitled",
        date: data.date || new Date().toISOString(),
        categories,
        excerpt: data.excerpt || data.description || "",
        image: data.image || "",
        imageAlt: data.imageAlt || data.title || "Blog post image",
        draft: data.draft === true,
        author: data.author || {
            name: "Iván Torres",
            role: "Software Developer",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        },
        content,
    };
}

// Get all posts sorted by date
// In production, filter out drafts. In development, include them.
export function getAllPosts(includeDrafts = false): PostMeta[] {
    const isDevMode = process.env.NODE_ENV === "development";
    const slugs = getPostSlugs();
    const posts = slugs
        .map((slug) => {
            const post = getPostBySlug(slug.replace(/\.mdx$/, ""));
            if (!post) return null;
            // Return metadata only, not content
            const { content, ...meta } = post;
            return meta;
        })
        .filter((post): post is PostMeta => {
            if (post === null) return false;
            // Include drafts only in dev mode or when explicitly requested
            if (post.draft && !isDevMode && !includeDrafts) return false;
            return true;
        })
        .sort((a, b) => (new Date(b.date) > new Date(a.date) ? 1 : -1));

    return posts;
}

// Get related posts by category
export function getRelatedPosts(currentSlug: string, categories: string[], limit = 3): PostMeta[] {
    const allPosts = getAllPosts();
    return allPosts
        .filter((post) => {
            if (post.slug === currentSlug) return false;
            // Check if any category overlaps
            return post.categories.some(cat => categories.includes(cat));
        })
        .slice(0, limit);
}

// Get previous and next posts for navigation
export function getAdjacentPosts(currentSlug: string): { previous: PostMeta | null; next: PostMeta | null } {
    const allPosts = getAllPosts(); // Already sorted by date desc
    const currentIndex = allPosts.findIndex(post => post.slug === currentSlug);

    if (currentIndex === -1) {
        return { previous: null, next: null };
    }

    // Previous = newer post (lower index), Next = older post (higher index)
    const previous = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
    const next = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

    return { previous, next };
}

// Extract TOC from markdown content
export function extractToc(content: string): TocItem[] {
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    const toc: TocItem[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
        toc.push({ id, text, level });
    }

    return toc;
}

// Format date for display
export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

// Calculate reading time
export function calculateReadingTime(content: string): string {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min de lectura`;
}
