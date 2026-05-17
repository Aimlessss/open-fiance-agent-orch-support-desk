import { readEnv } from "../utils/readEnv";
import { GeminiEmbeddingProvider } from "./embeddingProvider";
import { GeminiLLMProvider } from "./llmProivder";
import { PromptBuilder } from "./promptBuilder";
import { QdrantRepo } from "./qdrantRepo";

export function createRagService(){
    const key = readEnv("GOOGLE_API_KEY");
    const qdrantUrl = readEnv("QUDRANT_CLUSTER_URL");
    const qdrantKey = readEnv("QUDRANT_API_KEY");

    const embedder = new GeminiEmbeddingProvider(key);

    const repo = new QdrantRepo(qdrantUrl, qdrantKey);

    const promptBuilder = new PromptBuilder();

    const llm = new GeminiLLMProvider(key);

    
}