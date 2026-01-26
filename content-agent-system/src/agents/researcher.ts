
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, ToolMessage } from "@langchain/core/messages";
import { AgentState } from "../state";
import { scrapeUrlTool } from "../tools/scrape";

export const researcherNode = async (state: typeof AgentState.State) => {
  const model = new ChatGoogleGenerativeAI({
    model: "gemini-3-flash-preview",
    temperature: 0
  }).bindTools([scrapeUrlTool]);

  console.log("--- Researcher Agent (Gemini): Analyzing request ---");

  // Keep history to see tool responses
  const messages = state.messages;
  const lastMessage = messages[messages.length - 1];

  let prompt = "";

  // If we just came back from a tool, summarize data. 
  // If it's the first call, ask to research.
  if (lastMessage instanceof ToolMessage) {
    prompt = `You have received the content from the URL. 
      Now, summarize the key findings from this content that are relevant to the topic: "${state.topic}".
      Output a structured research summary to be passed to the writer.`;
  } else {
    // Initial prompting
    prompt = `You are an expert researcher. 
    The user wants a post about: "${state.topic}".
    
    If the user provided a URL in the message history, USE THE 'read_url' TOOL to read it.
    If no URL is provided, rely on your internal knowledge to gather key facts.
    
    Focus on:
    1. Key statistics.
    2. Novel ideas.
    3. Technical accuracy.
    `;
  }

  // We only send the prompt if it's not a tool-response turn, or we append it? 
  // LangGraph handles message history. We just invoke with history.
  // Actually, for simple tool use, we can just invoke the model with the state messages.

  // Create a new message if it's the start, otherwise let the model react to history
  const inputs = messages.length > 0 ? messages : [new HumanMessage(prompt)];

  // If we are starting freshly or need to reinject instructions (optional)
  // For simplicity: just pass state.messages if they exist, or the prompt.

  const response = await model.invoke(inputs);

  // If response has tool_calls, returning it will trigger the ToolNode in the graph.
  // If response is text, it updates researchData.

  if (response.tool_calls && response.tool_calls.length > 0) {
    return { messages: [response] };
  }

  return {
    researchData: response.content as string,
    messages: [response],
  };
};
