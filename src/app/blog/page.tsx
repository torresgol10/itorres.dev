import { Header } from "@/components/Header";
import { BlogList } from "@/components/BlogList";
import { getAllPosts } from "@/lib/posts";

export const metadata = {
    title: "Blog - Iván Torres",
    description: "Explora todos mis artículos sobre desarrollo web, react y tecnología.",
};

export default function BlogPage() {
    const posts = getAllPosts();

    return (
        <div className="min-h-screen bg-background antialiased">
            <Header />

            <main className="mx-auto max-w-6xl px-6 py-16 md:py-24">
                <div className="mb-12 text-center">
                    <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                        Blog
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                        Pensamientos, tutoriales y guías sobre desarrollo de software moderno.
                    </p>
                </div>

                <BlogList initialPosts={posts} />
            </main>
        </div>
    );
}
