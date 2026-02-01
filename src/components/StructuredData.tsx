import { Post } from "@/lib/posts";

export function StructuredData({ post }: { post: Post }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        datePublished: post.date,
        dateModified: post.date,
        description: post.excerpt,
        image: post.image ? [post.image] : [],
        url: `https://itorres.dev/blog/${post.slug}`,
        author: {
            "@type": "Person",
            name: post.author?.name || "Iván Torres",
            url: "https://itorres.dev",
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
