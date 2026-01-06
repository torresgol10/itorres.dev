"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface TocItem {
    id: string;
    text: string;
    level: number;
}

interface TableOfContentsProps {
    items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: "-100px 0px -80% 0px" }
        );

        items.forEach((item) => {
            const element = document.getElementById(item.id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [items]);

    const handleClick = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <nav className="hidden xl:block">
            <div className="sticky top-24">
                <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    En este artículo
                </p>
                <ul className="space-y-2.5 text-sm">
                    {items.map((item) => (
                        <li key={item.id}>
                            <button
                                onClick={() => handleClick(item.id)}
                                className={cn(
                                    "block w-full text-left transition-colors duration-200",
                                    item.level === 3 && "pl-4",
                                    activeId === item.id
                                        ? "text-foreground font-medium"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {item.text}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
}

// Mobile TOC - shown below header on mobile/tablet
export function MobileTableOfContents({ items }: TableOfContentsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeId, setActiveId] = useState<string>(items[0]?.id || "");

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: "-100px 0px -80% 0px" }
        );

        items.forEach((item) => {
            const element = document.getElementById(item.id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [items]);

    const handleClick = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            setIsOpen(false);
        }
    };

    const activeItem = items.find(item => item.id === activeId);

    return (
        <div className="xl:hidden sticky top-16 z-30 border-b border-border bg-white dark:bg-zinc-950">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between px-6 py-3 text-sm"
            >
                <span className="text-muted-foreground">En este artículo</span>
                <span className="flex items-center gap-2 font-medium">
                    {activeItem?.text || items[0]?.text}
                    <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                </span>
            </button>

            {isOpen && (
                <div className="border-t border-border bg-white dark:bg-zinc-950 px-6 py-3">
                    <ul className="space-y-2">
                        {items.map((item) => (
                            <li key={item.id}>
                                <button
                                    onClick={() => handleClick(item.id)}
                                    className={cn(
                                        "block w-full text-left py-1.5 text-sm transition-colors",
                                        item.level === 3 && "pl-4",
                                        activeId === item.id
                                            ? "text-primary font-medium"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {item.text}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
