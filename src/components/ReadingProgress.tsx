import { cn } from "@/lib/utils";

export function ReadingProgress() {
    return (
        <div
            className={cn(
                "fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 z-[100] reading-progress-bar"
            )}
        />
    );
}
