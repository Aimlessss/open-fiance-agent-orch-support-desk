import { TIncomingTicketToAgent } from "../dto";
import { GeminiEmbeddingProvider } from "./embeddingProvider";
import { GeminiLLMProvider } from "./llmProivder";
import { PromptBuilder } from "./promptBuilder";
import { QdrantRepo } from "./qdrantRepo";

export class RagService {
    constructor(
        private embedder : GeminiEmbeddingProvider,
        private repository : QdrantRepo,
        private promptBuild : PromptBuilder,
        private llm : GeminiLLMProvider
    ){}

    async ask(question : TIncomingTicketToAgent) : Promise<string | undefined>{
        const vector = await this.embedder.embed(question);
        const textRes = await this.repository.searchText(vector!);
        const context = await this.promptBuild.buildContext(textRes);
        const prompt = await this.promptBuild.buildPrompt(context, question);
        const answer = await this.llm.generate(prompt);
        return answer;
    }
}