import type { MDXComponents } from "mdx/types";
import { CodeBlock } from "@/components/CodeBlock";
import { ZoomableImage } from "@/components/ZoomableImage";

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        // Custom heading components with IDs for TOC
        h1: ({ children, ...props }) => (
            <h1 className="text-3xl font-bold tracking-tight mt-8 mb-4" {...props}>
                {children}
            </h1>
        ),
        h2: ({ children, ...props }) => {
            const id = typeof children === "string"
                ? children.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "")
                : undefined;
            return (
                <h2 id={id} className="text-2xl font-bold tracking-tight mt-10 mb-4" {...props}>
                    {children}
                </h2>
            );
        },
        h3: ({ children, ...props }) => {
            const id = typeof children === "string"
                ? children.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "")
                : undefined;
            return (
                <h3 id={id} className="text-xl font-semibold mt-8 mb-3" {...props}>
                    {children}
                </h3>
            );
        },
        // Paragraphs
        p: ({ children }) => (
            <p className="mb-6 leading-7 text-foreground/90">{children}</p>
        ),
        // Code blocks
        pre: ({ children, ...props }) => {
            // Check if it's a code block processed by our plugins
            // It should have rawCode from rehype-extract-code
            const rawCode = (props as any).rawCode;
            const language = (props as any)["data-language"];

            return (
                <CodeBlock
                    rawCode={rawCode}
                    language={language}
                    {...props}
                >
                    {children}
                </CodeBlock>
            );
        },
        // Inline code
        code: ({ children, className }) => {
            // If it has a className, it's a code block (handled by pre)
            if (className) {
                return <code className={className}>{children}</code>;
            }
            // Inline code
            return (
                <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
                    {children}
                </code>
            );
        },
        // Lists
        ul: ({ children }) => (
            <ul className="mb-6 ml-6 list-disc space-y-2">{children}</ul>
        ),
        ol: ({ children }) => (
            <ol className="mb-6 ml-6 list-decimal space-y-2">{children}</ol>
        ),
        li: ({ children }) => <li className="leading-7">{children}</li>,
        // Blockquote
        blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary/50 pl-4 my-6 italic text-muted-foreground">
                {children}
            </blockquote>
        ),
        // Links
        a: ({ children, href }) => (
            <a
                href={href}
                className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
                target={href?.startsWith("http") ? "_blank" : undefined}
                rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            >
                {children}
            </a>
        ),
        // Strong/Bold
        strong: ({ children }) => (
            <strong className="font-semibold">{children}</strong>
        ),
        // Emphasis/Italic
        em: ({ children }) => <em className="italic">{children}</em>,
        // Horizontal rule
        hr: () => <hr className="my-8 border-border" />,
        // Images
        img: (props) => (
            <ZoomableImage
                {...(props as any)}
                alt={props.alt || ""}
            />
        ),
        ...components,
    };
}
