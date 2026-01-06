import * as React from "react";
import { ThemeProvider } from "@/lib/theme-context";

export function Providers({ children }: { children: React.ReactNode }) {
    return <ThemeProvider defaultTheme="system" storageKey="blog-theme">{children}</ThemeProvider>;
}
