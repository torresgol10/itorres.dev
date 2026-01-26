
import { tool } from "@langchain/core/tools";
import { z } from "zod";
// @ts-ignore
import { load } from "cheerio";

// Define schema separately to help TS inference
const scrapeSchema = z.object({
    url: z.string().describe("The URL to scrape"),
});

const scrapeImpl = async (input: z.infer<typeof scrapeSchema>) => {
    const { url } = input;
    console.log(`--- Tool: Scraping URL: ${url} ---`);
    try {
        const response = await fetch(url);
        const html = await response.text();
        // @ts-ignore
        const $ = load(html);

        // Clean up content
        $("script").remove();
        $("style").remove();
        $("nav").remove();
        $("footer").remove();

        const text = $("body").text().replace(/\s+/g, " ").trim();
        return text.slice(0, 10000); // Limit context window usage
    } catch (error) {
        return `Error scraping ${url}: ${error}`;
    }
};

export const scrapeUrlTool = tool(scrapeImpl, {
    name: "read_url",
    description: "Reads the content of a given URL. Use this when the user provides a link to source material.",
    schema: scrapeSchema as any,
}) as any;
