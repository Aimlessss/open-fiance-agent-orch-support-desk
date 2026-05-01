import { GoogleGenAI } from "@google/genai";
import { TIncomingTicketToAgent } from "../dto";

export class RagCoreMiddleware {

    private llm : GoogleGenAI;
    
    constructor(key : string){
        this.llm = new GoogleGenAI({
            apiKey : key
        })
    }

    async onRequest(request : TIncomingTicketToAgent) {
        
    }
}
