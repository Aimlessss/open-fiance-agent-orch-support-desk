import { GoogleGenAI } from "@google/genai";
import { TAssignmentDecision, TIncomingTicketToAgent } from "../dto";
import { loadEngineerProfilesFromMarkdown } from "../routing/load-engineer-profiles";
import { createRoutingPrompt } from "./prompt.injection";

export class RagCoreMiddleware {

    private llm : GoogleGenAI;
    private path : string;
    private model : string;
    
    constructor(key : string, filePath : string, model = "gemini-2.5-flash"){
        this.llm = new GoogleGenAI({
            apiKey : key
        })
        this.path = filePath;
        this.model = model;
    }

    async onRequest(ticket : TIncomingTicketToAgent) : Promise<TAssignmentDecision> {
        const engineerProfiles = await loadEngineerProfilesFromMarkdown(this.path);
        const prompt = createRoutingPrompt(ticket, engineerProfiles);

        const response = await this.llm.models.generateContent({
            model: this.model,
            contents: [{
                        role: "user",
                        parts: [{ text: prompt }]
            }]
        })

        const responseText = response.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!responseText) {
            throw new Error("LLM did not return a routing decision.");
        }

        return parseAssignmentDecision(responseText);

    }
}

function parseAssignmentDecision(responseText: string): TAssignmentDecision {
    const jsonText = stripMarkdownJsonFence(responseText);

    try {
        return JSON.parse(jsonText) as TAssignmentDecision;
    } catch (error) {
        throw new Error(`Failed to parse assignment decision JSON: ${(error as Error).message}`);
    }
}

function stripMarkdownJsonFence(responseText: string): string {
    return responseText
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
}
