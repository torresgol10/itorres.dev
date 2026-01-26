
import { StateGraph, END, START } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { AgentState } from "./state";
import { researcherNode } from "./agents/researcher";
import { writerNode } from "./agents/writer";
import { reflectorNode } from "./agents/reflector";
import { scrapeUrlTool } from "./tools/scrape";
import { AIMessage } from "@langchain/core/messages";
import * as dotenv from "dotenv";
import * as fs from "fs/promises";

dotenv.config();

// Define ToolNode
const toolNode = new ToolNode([scrapeUrlTool] as any);

// Condition for Researcher: Call Tool or Go to Writer?
const shouldResearchContinue = (state: typeof AgentState.State) => {
    const messages = state.messages;
    const lastMessage = messages[messages.length - 1] as AIMessage;

    if (lastMessage.tool_calls?.length) {
        return "tools";
    }
    return "writer";
};

// Condition for Reflector: Loop or End?
const shouldReflectContinue = (state: typeof AgentState.State) => {
    const { critique, revisionCount } = state;
    const maxRevisions = 3;

    if (revisionCount > maxRevisions) {
        console.log("--- Max revisions reached. Stopping. ---");
        return "end";
    }

    if (critique.includes("PERFECT")) {
        console.log("--- Critique is positive. Stopping. ---");
        return "end";
    }

    console.log("--- Critique requires revision. Looping back. ---");
    return "continue";
};

// Build the Graph
const workflow = new StateGraph(AgentState)
    .addNode("researcher", researcherNode)
    .addNode("tools", toolNode)
    .addNode("writer", writerNode)
    .addNode("reflector", reflectorNode)

    // START deciding where to go: if there's a draft, go to reflector
    .addConditionalEdges(START, (state) => {
        if (state.draft) {
            console.log("--- Starting in REVIEW MODE (Existing Draft) ---");
            return "reflector";
        }
        return "researcher";
    }, {
        researcher: "researcher",
        reflector: "reflector"
    })

    // Researcher decision: Tool vs Writer
    .addConditionalEdges("researcher", shouldResearchContinue, {
        tools: "tools",
        writer: "writer",
    })

    .addEdge("tools", "researcher") // Tools go back to researcher to digest info

    .addEdge("writer", "reflector")

    // Reflector decision: Revise vs End
    .addConditionalEdges("reflector", shouldReflectContinue, {
        continue: "writer",
        end: END,
    });

const app = workflow.compile();

async function main() {
    const input = process.argv[2] || "Explain React 19 features";
    const style = process.argv[3] || "web-dev";

    // Check if input contains url roughly
    const hasUrl = input.includes("http");

    console.log(`Starting request: "${input}" [Style: ${style}]\n`);

    let initialDraft = "";
    let effectiveTopic = input;

    // Simple check: if input is a local file that exists, read it
    if (input.endsWith(".md") || input.endsWith(".mdx")) {
        try {
            initialDraft = await fs.readFile(input, "utf-8");
            console.log(`--- Detected file input. Reviewing ${input} ---`);
            effectiveTopic = `Reviewing existing post: ${input}`;
        } catch (e) {
            // Not a file or can't read, treat as topic
        }
    }

    // We construct the first message based on the CLI input
    const initialInputs = {
        messages: [{
            role: "user",
            content: initialDraft
                ? `Please review this existing post: ${input}`
                : `Please research and write a post about: ${input}. ${hasUrl ? "Use the tool to read the link." : ""}`
        }],
        topic: effectiveTopic,
        draft: initialDraft,
        writerStyle: style,
    } as any;

    const stream = await app.stream(initialInputs, { recursionLimit: 50 });

    let finalDraft = "";

    for await (const update of stream) {
        const nodeName = Object.keys(update)[0];
        const nodeState = update[nodeName];
        // console.log(`Update ${nodeName}`);
        if (nodeName === "writer") {
            console.log("\n--- DRAFT GENERATED ---");
            console.log(nodeState.draft.substring(0, 200) + "...");
            finalDraft = nodeState.draft;
        }
        if (nodeName === "reflector") {
            console.log("\n--- CRITIQUE ---");
            console.log(nodeState.critique);
        }
    }

    if (finalDraft) {
        // Improved regex to capture content after 'title:' even without quotes
        const titleMatch = finalDraft.match(/title:\s*(?:['"]([^'"]*)['"]|([^\n\r]*))/);
        const extractedTitle = (titleMatch ? (titleMatch[1] || titleMatch[2]) : input).trim();

        const slugify = (text: string) => text.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');

        const outputPath = `${slugify(extractedTitle)}.mdx`;
        await fs.writeFile(outputPath, finalDraft);
        console.log(`\n--- Result saved to ${outputPath} ---`);
    }

    console.log("\n--- Process Completed ---");
}

main().catch(console.error);
