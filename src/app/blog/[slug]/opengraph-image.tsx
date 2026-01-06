import { getPostBySlug } from "@/lib/posts";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export const alt = "Blog Post Image";
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    const title = post?.title || "itorres.dev Blog";
    const author = post?.author?.name || "Iván Torres";

    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 128,
                    background: "linear-gradient(to bottom right, #09090b, #18181b)",
                    color: "white",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    padding: 80,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        marginBottom: 40,
                    }}
                >
                    <div
                        style={{
                            width: 60,
                            height: 60,
                            background: "white",
                            borderRadius: 12,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "black",
                            fontSize: 32,
                            fontWeight: "bold",
                        }}
                    >
                        T
                    </div>
                    <div style={{ fontSize: 40, fontWeight: "bold", color: "#a1a1aa" }}>
                        itorres.dev
                    </div>
                </div>

                <div
                    style={{
                        fontSize: 80,
                        fontWeight: "bold",
                        lineHeight: 1.1,
                        marginBottom: 40,
                        background: "linear-gradient(to right, #ffffff, #a1a1aa)",
                        backgroundClip: "text",
                        color: "transparent",
                    }}
                >
                    {title}
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 20,
                        marginTop: "auto",
                    }}
                >
                    <div style={{ fontSize: 32, color: "#a1a1aa" }}>
                        Por <span style={{ color: "white", fontWeight: 600 }}>{author}</span>
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
