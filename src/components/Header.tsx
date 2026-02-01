"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface HeaderProps {
    tocItems?: { id: string; text: string; level: number }[];
}

export function Header({ tocItems }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleTocClick = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            setIsMenuOpen(false);
        }
    };

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background">
                            <span className="text-sm font-bold">T</span>
                        </div>
                        <span className="text-lg font-semibold tracking-tight">Torres.dev</span>
                    </Link>

                    <nav className="hidden items-center gap-8 md:flex">
                        <Link
                            href="/blog"
                            className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                        >
                            Blog
                        </Link>
                        <Link
                            href="/about"
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Sobre mí
                        </Link>
                        <Link
                            href="/projects"
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Proyectos
                        </Link>
                        <ThemeToggle />
                    </nav>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-foreground md:hidden"
                    >
                        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        <span className="sr-only">Toggle menu</span>
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 top-16 z-40 bg-background md:hidden">
                    <nav className="border-b border-border px-6 py-4">
                        <Link
                            href="/blog"
                            onClick={() => setIsMenuOpen(false)}
                            className="block py-2 text-lg font-medium"
                        >
                            Blog
                        </Link>
                        <Link
                            href="/about"
                            onClick={() => setIsMenuOpen(false)}
                            className="block py-2 text-lg font-medium text-muted-foreground"
                        >
                            Sobre mí
                        </Link>
                        <Link
                            href="/projects"
                            onClick={() => setIsMenuOpen(false)}
                            className="block py-2 text-lg font-medium text-muted-foreground"
                        >
                            Proyectos
                        </Link>
                    </nav>

                    {/* TOC in mobile menu */}
                    {tocItems && tocItems.length > 0 && (
                        <div className="px-6 py-4">
                            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                En este artículo
                            </p>
                            <ul className="space-y-2">
                                {tocItems.map((item) => (
                                    <li key={item.id}>
                                        <button
                                            onClick={() => handleTocClick(item.id)}
                                            className="block w-full text-left py-2 text-base text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {item.text}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
