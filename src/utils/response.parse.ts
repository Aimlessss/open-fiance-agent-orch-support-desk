import { TAssignmentDecision } from "../dto";

export function parseAssignmentDecision(responseText: string): TAssignmentDecision {
    const jsonText = stripMarkdownJsonFence(responseText);

    try {
        return JSON.parse(jsonText) as TAssignmentDecision;
    } catch (error) {
        throw new Error(`Failed to parse assignment decision JSON: ${(error as Error).message}`);
    }
}

function stripMarkdownJsonFence(responseText: string): string {
    return responseText
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
}
