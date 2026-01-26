
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { AgentState } from "../state";
import { styles, WriterStyle } from "../prompts/styles";

export const writerNode = async (state: typeof AgentState.State) => {
    const model = new ChatGoogleGenerativeAI({ model: "gemini-3-pro-preview", temperature: 0.7 });

    const isRevision = state.revisionCount > 0 || !!state.critique;
    const styleKey = (state.writerStyle as WriterStyle) || "web-dev";
    const selectedStylePrompt = styles[styleKey] || styles["web-dev"];

    const today = new Date().toISOString().split('T')[0];

    console.log(isRevision
        ? `--- Writer Agent (Gemini): Revising (Iteration ${state.revisionCount}) [Style: ${styleKey}] ---`
        : `--- Writer Agent (Gemini): Writing Content [Style: ${styleKey}] ---`);

    // --- SYSTEM PROMPT DEFINITION ---
    const systemPrompt = `${selectedStylePrompt}

### MANDATORY: FRONTMATTER (METADATA)
Every post MUST begin EXACTLY with this metadata block (Frontmatter) in YAML format:
---
title: '[Impactful Title]'
excerpt: '[Compelling 1-2 sentence summary]'
categories: ['[Category1]', '[Category2]']
date: '${today}'

author:
  name: "Iván Torres"
  role: "Software Developer"
---

### MODE DYNAMICS (AUTO-SELECTOR)
Analyze the input and choose:
1. **MICRO MODE (Default):** Quick tips, snippets. (200-300 words). Structure: Title, Hook, Solution (API), Code, Senior Nuance.
2. **DEEP MODE:** If "guide", "tutorial", "depth" is requested. (500-800 words). Structure: Title (Promise), Real Context, Key Concepts, Step-by-Step Implementation, Best Practices vs Errors, Conclusion.

### STYLE RULES (CRITICAL)
- **Zero Fluff:** Remove greetings ("Hello everyone"), obvious intros, or empty conclusions. STRAIGHT TO THE POINT.
- **Tone:** Technical, modern, enthusiastic.
- **Code:** Specify language. Use ES6+, semantic HTML, modern CSS.
- **Philosophy:** How it is used TODAY in production. No irrelevant history.

### SOURCES
Use this researched information (if applicable) but DO NOT mention "I searched on the internet":
${state.researchData}
`;

    let userContent = "";

    if (isRevision) {
        userContent = `Refine the previous post based strictly on this CRITIQUE:
    ${state.critique}
    
    PREVIOUS POST:
    ${state.draft}
    
    Maintain the style and fix ONLY what is necessary.`;
    } else {
        userContent = `Write a post about: "${state.topic}". 
    Decide yourself if MICRO MODE or DEEP MODE is appropriate for the topic.`;
    }

    const response = await model.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage(userContent)
    ]);

    return {
        draft: response.content as string,
        revisionCount: isRevision ? state.revisionCount + 1 : 1,
        messages: [response],
    };
};
