import { visit } from "unist-util-visit";

export function rehypeExtractCode() {
    return (tree: any) => {
        visit(tree, (node) => {
            if (node?.type === "element" && node?.tagName === "pre") {
                const [codeEl] = node.children;
                if (codeEl?.tagName !== "code") return;

                // Recursively extract text from all children
                const getText = (n: any): string => {
                    if (n.type === "text") return n.value;
                    if (n.children) return n.children.map(getText).join("");
                    return "";
                };

                node.properties.rawCode = getText(codeEl);
            }
        });
    };
}

