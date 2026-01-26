
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
    console.error("GOOGLE_API_KEY is not set in .env");
    process.exit(1);
}

async function listModels() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const models = data.models || [];

        console.log("Available Gemini Models:");
        models.forEach((model: any) => {
            if (model.name.includes("gemini")) {
                console.log(`- ${model.name} (${model.displayName}) - Version: ${model.version}`);
            }
        });

    } catch (error) {
        console.error("Error fetching models:", error);
    }
}

listModels();
