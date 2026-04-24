import { GoogleGenAI } from "@google/genai";

export class RagCoreMiddleware {

    private llm : GoogleGenAI;
    
    constructor(key : string){
        this.llm = new GoogleGenAI({
            apiKey : key
        })
    }

    async onRequest(request : any){
        
    }
}
