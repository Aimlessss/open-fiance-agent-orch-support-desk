import { TIncomingTicketToAgent } from "../dto";

// builders/prompt.builder.ts
export class PromptBuilder {

  buildContext(results: any[]) {

    return results
      .map(r => r.payload?.text || "")
      .join("\n\n");

  }

  buildPrompt(context: string, ticket: TIncomingTicketToAgent) {

    return `
 You are a support desk routing agent.

Here is the related data to it:
${context}

Here is Ticket info:
${ticket}
    - Explain why.
    - Return valid JSON only.
    - Do not wrap the JSON in markdown.
    - Do not invent engineers or emails.
    - If confidence is below 0.70, set needsHumanReview to true.

    {
        "ticketId": "...",
        "assignedToName": "...",
        "assignedToEmail": "...",
        "confidence": 0.0,
        "reason": "...",
        "matchedSignals": ["..."]
    }
`;

  }

}