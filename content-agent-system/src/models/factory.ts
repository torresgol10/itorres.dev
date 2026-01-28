import { ChatOpenAI } from "@langchain/openai";
import { ChatOllama } from "@langchain/ollama";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { getAgentConfig, AgentModelConfig } from "./config";

import { Runnable } from "@langchain/core/runnables";

/**
 * Creates a model instance with fallback support.
 * @param agentName "researcher" | "writer" | "reflector"
 * @param options Options for the model (temperature, tools)
 */
export const createModel = (
    agentName: "researcher" | "writer" | "reflector",
    options: { temperature?: number, tools?: any[] } = {}
): Runnable => {
    const config = getAgentConfig(agentName);
    const temperature = options.temperature ?? 0.7;

    let primaryModel = createBaseModel(config, temperature);
    let backupModel = new ChatGoogleGenerativeAI({
        model: "gemini-3-pro-preview",
        temperature: temperature,
        maxRetries: 2,
        callbacks: [
            {
                handleLLMStart: async () => {
                    console.log("\n⚠️  PRIMARY MODEL FAILED. USING FALLBACK (Gemini)...\n");
                }
            }
        ]
    });

    if (options.tools && primaryModel) {
        primaryModel = (primaryModel as any).bindTools(options.tools);
        backupModel = (backupModel as any).bindTools(options.tools);
    }

    // If primary is NOT Gemini, we add Gemini as a fallback
    // This ensures if DeepSeek/Ollama fails, we default to the reliable Gemini
    if (config.provider !== "gemini") {
        console.log(`[Factory] creating ${agentName} with ${config.provider}:${config.modelName} (Backup: Gemini)`);
        return primaryModel.withFallbacks([backupModel]);
    }

    console.log(`[Factory] creating ${agentName} with ${config.provider}:${config.modelName}`);
    return primaryModel;
};

const createBaseModel = (config: AgentModelConfig, temperature: number): BaseChatModel => {
    if (config.provider === "openai_compatible") {
        return new ChatOpenAI({
            modelName: config.modelName,
            temperature: temperature,
            configuration: {
                baseURL: config.baseUrl,
                apiKey: config.apiKey,
            }
        });
    } else if (config.provider === "ollama") {
        return new ChatOllama({
            model: config.modelName,
            baseUrl: config.baseUrl,
            temperature: temperature,
            headers: config.apiKey ? {
                Authorization: `Bearer ${config.apiKey}`
            } : undefined
        });
    }

    // Default to Gemini
    return new ChatGoogleGenerativeAI({
        model: config.modelName,
        temperature: temperature,
    });
};
