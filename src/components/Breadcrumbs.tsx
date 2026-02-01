import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
    // Build JSON-LD for BreadcrumbList
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.label,
            item: item.href ? `https://itorres.dev${item.href}` : undefined,
        })),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <nav aria-label="Breadcrumb" className="mb-6">
                <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    {items.map((item, index) => (
                        <li key={index} className="flex items-center gap-1.5">
                            {index > 0 && <ChevronRight className="h-3.5 w-3.5" />}
                            {item.href ? (
                                <Link
                                    href={item.href}
                                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                                >
                                    {index === 0 && <Home className="h-3.5 w-3.5" />}
                                    <span>{item.label}</span>
                                </Link>
                            ) : (
                                <span className="text-foreground font-medium truncate max-w-[200px]">
                                    {item.label}
                                </span>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>
        </>
    );
}
