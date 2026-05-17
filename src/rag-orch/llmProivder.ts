import { GoogleGenAI } from "@google/genai";
export class GeminiLLMProvider {

  private llm : GoogleGenAI

  constructor(apiKey: string) {

    this.llm = new GoogleGenAI({
        apiKey : apiKey
    })

  }
  async generate(prompt: string): Promise<string | undefined> {

        const res = await this.llm.models.generateContent({
            model : "",
            contents : [
                {
                    role : "user",
                    parts : [
                        {
                            text : prompt
                        }
                    ]
                }
            ]
        })
        const responseText = res.candidates?.[0]?.content?.parts?.[0]?.text;
        return responseText;
  }

}