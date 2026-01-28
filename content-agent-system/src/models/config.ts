import { z } from "zod";
import * as dotenv from "dotenv";

dotenv.config();

// Define supported providers
export const ProviderSchema = z.enum(["gemini", "openai_compatible", "ollama"]);
export type Provider = z.infer<typeof ProviderSchema>;

// Schema for environment variables
const ConfigSchema = z.object({
    // Google Gemini Config
    GOOGLE_API_KEY: z.string().min(1, "GOOGLE_API_KEY is required"),

    // OpenAI Compatible Config (Ollama, DeepSeek, etc.)
    OPENAI_COMPATIBLE_BASE_URL: z.string().url().optional(),
    OPENAI_COMPATIBLE_API_KEY: z.string().optional().default("ollama"), // Default dummy key for Ollama

    // Agent Specific Configurations
    // Format: "provider:model_name"
    RESEARCHER_MODEL_KP: z.string().default("gemini:gemini-3-pro-preview"),
    WRITER_MODEL_KP: z.string().default("gemini:gemini-3-pro-preview"),
    REFLECTOR_MODEL_KP: z.string().default("gemini:gemini-3-pro-preview"),
});

// Parse env vars
const env = ConfigSchema.parse(process.env);

export interface AgentModelConfig {
    provider: Provider;
    modelName: string;
    baseUrl?: string;
    apiKey?: string;
}

export const getAgentConfig = (agent: "researcher" | "writer" | "reflector"): AgentModelConfig => {
    let configString = "";
    switch (agent) {
        case "researcher": configString = env.RESEARCHER_MODEL_KP; break;
        case "writer": configString = env.WRITER_MODEL_KP; break;
        case "reflector": configString = env.REFLECTOR_MODEL_KP; break;
    }

    const firstColonIndex = configString.indexOf(":");
    const providerRaw = configString.substring(0, firstColonIndex);
    const modelName = configString.substring(firstColonIndex + 1);
    const provider = ProviderSchema.parse(providerRaw);

    const isCustom = provider === "openai_compatible" || provider === "ollama";

    return {
        provider,
        modelName,
        baseUrl: isCustom ? env.OPENAI_COMPATIBLE_BASE_URL : undefined,
        apiKey: isCustom ? env.OPENAI_COMPATIBLE_API_KEY : env.GOOGLE_API_KEY,
    };
};
