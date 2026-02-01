"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface ReadingTimeRemainingProps {
    totalMinutes: number;
}

export function ReadingTimeRemaining({ totalMinutes }: ReadingTimeRemainingProps) {
    const [remainingMinutes, setRemainingMinutes] = useState(totalMinutes);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;

            // Avoid division by zero for short pages
            if (docHeight <= 0) {
                setIsVisible(false);
                return;
            }

            const scrollPercent = Math.min(scrollTop / docHeight, 1);

            // Show after any scroll, hide near end
            setIsVisible(scrollPercent > 0.02 && scrollPercent < 0.95);

            // Calculate remaining time
            const remaining = Math.max(1, Math.ceil(totalMinutes * (1 - scrollPercent)));
            setRemainingMinutes(remaining);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        // Run once on mount
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, [totalMinutes]);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-xl animate-fadeIn">
            <Clock className="h-4 w-4" />
            <span>{remainingMinutes} min restante{remainingMinutes !== 1 ? "s" : ""}</span>
        </div>
    );
}
