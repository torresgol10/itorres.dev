
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

// ... imports
import inquirer from "inquirer";

// ... existing code ...

async function main() {
    let input = process.argv[2];
    let style = process.argv[3];

    // Interactive Mode if no args provided
    if (!input) {
        console.log("\n🚀 Content Agent System - Interactive Mode\n");

        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What do you want to do?',
                choices: [
                    { name: '✨ Create New Post', value: 'create' },
                    { name: '🔍 Review/Improve Existing Post', value: 'review' }
                ]
            },
            {
                type: 'input',
                name: 'topic',
                message: 'Enter the Topic describe what you want:',
                when: (answers: any) => answers.action === 'create',
                validate: (input: string) => input ? true : 'Topic is required'
            },
            {
                type: 'input',
                name: 'filePath',
                message: 'Enter the Absolute File Path to review:',
                when: (answers: any) => answers.action === 'review',
                validate: (input: string) => input ? true : 'File path is required'
            },
            {
                type: 'list',
                name: 'style',
                message: 'Select Writing Style:',
                choices: [
                    { name: 'vercel-web-dev (Technical, No Emojis)', value: 'web-dev' },
                    // Keeping other options hidden as per user request, but code allows expansion
                ],
                default: 'web-dev'
            }
        ]);

        if (answers.action === 'create') {
            input = answers.topic;
        } else {
            input = answers.filePath;
        }
        style = answers.style;
    }

    style = style || "web-dev";

    // Check if input contains url roughly
    const hasUrl = input.includes("http");

    console.log(`\nStarting request: "${input}" [Style: ${style}]\n`);

    let initialDraft = "";
    let effectiveTopic = input;

    // Simple check: if input is a local file that exists, read it
    const isFile = input.endsWith(".md") || input.endsWith(".mdx") || (input.includes(":") && !input.startsWith("http")); // Naive absolute path check

    if (isFile) {
        try {
            // Trim quotes if user pasted path with quotes
            const cleanPath = input.replace(/['"]/g, '');
            initialDraft = await fs.readFile(cleanPath, "utf-8");
            console.log(`--- Detected file input. Reviewing ${cleanPath} ---`);
            effectiveTopic = `Reviewing existing post: ${cleanPath}`;
            input = cleanPath; // update input to clean path
        } catch (e) {
            // Not a file or can't read, treat as topic if action was create, or error if review
            if (!input.includes(" ")) {
                console.warn(`⚠️  Warning: Could not read file '${input}'. Treating as topic.`);
            }
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
        filePath: isFile ? input : "",
    } as any;

    // ... rest of the function ...

    const stream = await app.stream(initialInputs, { recursionLimit: 50 });

    let finalDraft = "";
    let finalState: any = {};

    for await (const update of stream) {
        const nodeName = Object.keys(update)[0];
        const nodeState = update[nodeName];
        finalState = nodeState; // Capture latest state
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

        // If reviewing, use existing path. Else create new slug.
        // Check if finalState has filePath (it might be nested depending on how langgraph returns updates)
        // Actually, stream returns partial updates. We need to rely on our initial input logic or if we can access final state better.
        // But simply, we can check if 'isFile' was true at start and use process.argv or 'input' variable which we cleaned.

        let outputPath = "";
        if (isFile && input) {
            outputPath = input;
            console.log(`\n--- Overwriting existing file: ${outputPath} ---`);
        } else {
            outputPath = `${slugify(extractedTitle)}.mdx`;
        }

        await fs.writeFile(outputPath, finalDraft);
        console.log(`\n--- Result saved to ${outputPath} ---`);
    }

    console.log("\n--- Process Completed ---");
}

main().catch(console.error);
