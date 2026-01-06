"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ZoomIn } from "lucide-react";

interface ZoomableImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    alt: string;
}

export function ZoomableImage({ src, alt, className, ...props }: ZoomableImageProps) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    if (!src) return null;

    return (
        <>
            <div
                className={`relative group cursor-zoom-in my-8 rounded-lg overflow-hidden ${className || ''}`}
                onClick={() => setIsOpen(true)}
            >
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-auto block transition-transform duration-300 group-hover:scale-[1.02]"
                    {...props}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100">
                    <ZoomIn className="text-white drop-shadow-md w-10 h-10" />
                </div>
            </div>

            {isOpen && typeof document !== "undefined" && createPortal(
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm animate-fadeIn"
                    onClick={() => setIsOpen(false)}
                >
                    <div className="relative w-full h-full p-4 md:p-10 flex items-center justify-center">
                        <button
                            className="absolute top-6 right-6 text-white/70 hover:text-white p-2 z-50 rounded-full hover:bg-white/10 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsOpen(false);
                            }}
                            aria-label="Close lightbox"
                        >
                            <X size={36} />
                        </button>

                        <img
                            src={src}
                            alt={alt}
                            className="max-w-full max-h-full object-contain shadow-2xl animate-zoomIn cursor-zoom-out select-none"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
