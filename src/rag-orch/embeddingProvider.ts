import { ContentEmbedding, GenerateContentResponse, GoogleGenAI } from "@google/genai";
import { TIncomingTicketToAgent } from "../dto";

export class GeminiEmbeddingProvider {
    private model : GoogleGenAI;
    constructor(key : string){
        this.model = new GoogleGenAI({
            apiKey : key
        })
    }

async embed(ticket: TIncomingTicketToAgent): Promise<number[] | undefined> {
  const searchableText = `
    Title: ${ticket.title}
    Priority: ${ticket.priority}
    Description: ${ticket.textInputs}
  `;

  const result = await this.model.models.embedContent({
    model: "gemini-embedding-001",
    contents: searchableText,
  });

  return result.embeddings?.[0]?.values;
}
}