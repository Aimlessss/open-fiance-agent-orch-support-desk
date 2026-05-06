import { GoogleGenAI } from "@google/genai";
import { TAssignmentDecision, TIncomingTicketToAgent } from "../dto";
import { loadEngineerProfilesFromMarkdown } from "../routing/load-engineer-profiles";
import { createRoutingPrompt } from "./prompt.injection";
import { parseAssignmentDecision } from "../utils/response.parse";

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