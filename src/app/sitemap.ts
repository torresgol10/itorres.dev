import { getAllPosts } from "@/lib/posts";
import { MetadataRoute } from "next";

// Static build date to avoid Date.now() during SSG
const BUILD_DATE = "2026-02-01";

export default function sitemap(): MetadataRoute.Sitemap {
    const posts = getAllPosts();
    const baseUrl = "https://itorres.dev";

    const postsUrls = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.date,
    }));

    return [
        {
            url: baseUrl,
            lastModified: BUILD_DATE,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: BUILD_DATE,
        },
        {
            url: `${baseUrl}/projects`,
            lastModified: BUILD_DATE,
        },
        ...postsUrls,
    ];
}
