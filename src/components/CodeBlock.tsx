"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
    rawCode?: string;
    language?: string;
    filename?: string;
    children?: React.ReactNode;
}

export function CodeBlock({ rawCode, language, filename, className, children, ...props }: CodeBlockProps) {
    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = async () => {
        if (rawCode) {
            await navigator.clipboard.writeText(rawCode);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    return (
        <div
            className={cn(
                "relative my-6 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 font-mono text-sm shadow-lg",
                className
            )}
            {...props}
        >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3">
                <div className="flex items-center gap-3">
                    {/* Window controls */}
                    <div className="flex items-center gap-1.5">
                        <div className="h-3 w-3 rounded-full bg-red-500" />
                        <div className="h-3 w-3 rounded-full bg-yellow-500" />
                        <div className="h-3 w-3 rounded-full bg-green-500" />
                    </div>
                    {/* Filename or language */}
                    <span className="text-xs font-medium text-zinc-600">
                        {filename || language}
                    </span>
                </div>

                {/* Copy button */}
                <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
                >
                    {isCopied ? (
                        <>
                            <Check className="h-3.5 w-3.5 text-green-600" />
                            <span className="text-green-600">Copiado</span>
                        </>
                    ) : (
                        <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copiar</span>
                        </>
                    )}
                </button>
            </div>

            {/* Code content */}
            <div className="overflow-x-auto p-4 bg-zinc-950">
                <pre className="!bg-transparent !m-0 !p-0 whitespace-pre">
                    {children}
                </pre>
            </div>
        </div>
    );
}
