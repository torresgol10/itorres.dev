import { Header } from "@/components/Header";
import { PostCard } from "@/components/PostCard";
import { Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/posts";

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-background antialiased">
      <Header />

      <main className="mx-auto max-w-5xl px-6">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-primary/10 via-accent/5 to-transparent blur-3xl" />
            <div className="absolute -bottom-20 left-0 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-secondary/20 via-muted/10 to-transparent blur-3xl" />
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
              </span>
              Disponible para proyectos freelance
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Hola, soy <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">Torres</span>
            </h1>

            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Soy un desarrollador de software apasionado por crear aplicaciones web modernas y escalables.
              Este es mi espacio digital donde comparto mis aprendizajes, pensamientos y experimentos con código.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <Link
                href="https://github.com"
                target="_blank"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Posts Section */}
        <section className="pb-20">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Últimos artículos</h2>
            <Link
              href="/blog"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Ver todos →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {posts.map((post) => (
              <PostCard
                key={post.slug}
                slug={post.slug}
                title={post.title}
                excerpt={post.excerpt}
                date={formatDate(post.date)}
                category={post.category}
                image={post.image}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-8">
          <p className="text-sm text-muted-foreground">
            © 2025 Torres. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/rss" className="text-sm text-muted-foreground hover:text-foreground">
              RSS
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
