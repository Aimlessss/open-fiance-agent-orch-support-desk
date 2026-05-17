import { ContentEmbedding, GenerateContentResponse, GoogleGenAI } from "@google/genai";

export class GeminiEmbeddingProvider {
    private model : GoogleGenAI;
    constructor(key : string){
        this.model = new GoogleGenAI({
            apiKey : key
        })
    }

    async embed(text : string) : Promise<Array<ContentEmbedding> | undefined> {
        const result = await this.model.models.embedContent({
            model : "gemini-embedding-001",
            contents : text,
        });
        return result.embeddings;
    }
}