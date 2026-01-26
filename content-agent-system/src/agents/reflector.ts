
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { AgentState } from "../state";

export const reflectorNode = async (state: typeof AgentState.State) => {
  const model = new ChatGoogleGenerativeAI({ model: "gemini-3-flash-preview", temperature: 0 });

  console.log("--- Reflector Agent (Gemini): Critiquing ---");

  const systemPrompt = `You are the strictest **Chief Editor** in the tech world.
  Your job is to ensure posts follow the "Midudev/Senior" style rules.
  
  ### RULES TO VERIFY:
  1. **Zero Fluff**: Does it start with greetings? Are there vague intros? (Must be removed).
  2. **Structure**: 
     - If short: Does it have Hook + Code + Senior Nuance?
     - If long: Does it have Real Context + Steps + Best Practices (Good vs Bad)?
  3. **Modern Code**: Does it use 'var'? Uses 2015 practices? (Must be current ES6+).
  4. **Tone**: Is it boring? It should be enthusiastic and use emojis (unless style dictates otherwise).
  
  If the draft meets all these criteria and is excellent: respond only "PERFECT".
  If it fails at something: List specific errors for the writer to fix. Be direct and harsh.
  `;

  const userContent = `Critique this draft about "${state.topic}":
  
  ${state.draft}
  
  Research info (to verify accuracy):
  ${state.researchData}`;

  const response = await model.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(userContent)
  ]);

  const critique = response.content as string;

  return {
    critique: critique,
    messages: [response],
  };
};
