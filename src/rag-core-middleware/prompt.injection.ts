import { TEngineerRoutingProfile, TIncomingTicketToAgent } from "../dto";

export function createRoutingPrompt(ticket : TIncomingTicketToAgent, engineerProfiles : Array<TEngineerRoutingProfile>) : string {
        return `
    You are a support desk routing agent.

    Your job:
    - Pick the best engineer for this ticket.
    - Use only the engineer profiles provided.
    - Explain why.
    - Return valid JSON only.
    - Do not wrap the JSON in markdown.
    - Do not invent engineers or emails.
    - If confidence is below 0.70, set needsHumanReview to true.

    Ticket:
    ${JSON.stringify(ticket, null, 2)}

    Engineer profiles:
    ${JSON.stringify(engineerProfiles, null, 2)}

    Return JSON in this shape:
    {
    "ticketId": "...",
    "assignedToName": "...",
    "assignedToEmail": "...",
    "confidence": 0.0,
    "reason": "...",
    "matchedSignals": ["..."],
    "alternatives": [
        {
        "name": "...",
        "email": "...",
        "reason": "..."
        }
    ],
    "needsHumanReview": false
    }
    `;
}
