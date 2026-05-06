import { TIncomingTicketToAgent } from "../dto";

export type TOsdTicket = Record<string, unknown>;

export function transformOsdTicketsToIncomingTickets(
    osdTickets: Array<TOsdTicket>
): Array<TIncomingTicketToAgent> {
    return osdTickets
        .filter(isRoutableOsdTicket)
        .map(transformOsdTicketToIncomingTicket);
}

export function transformOsdTicketToIncomingTicket(
    osdTicket: TOsdTicket
): TIncomingTicketToAgent {
    const comments = readStringArray(osdTicket, "Comment")
        .filter(Boolean)
        .slice(-5);
    const organizations = readStringArray(osdTicket, "Custom field (Organizations)")
        .filter(Boolean);
    const environments = readStringArray(osdTicket, "Custom field (Environments)")
        .filter(Boolean);

    return {
        id: readString(osdTicket, "Issue key"),
        title: readString(osdTicket, "Summary"),
        priority: mapPriority(readString(osdTicket, "Priority")),
        textInputs: [
            `Issue type: ${readString(osdTicket, "Issue Type")}`,
            `Status: ${readString(osdTicket, "Status")}`,
            `Resolution: ${readString(osdTicket, "Resolution")}`,
            `Reporter: ${readString(osdTicket, "Reporter")}`,
            organizations.length > 0 ? `Organizations: ${organizations.join(", ")}` : "",
            environments.length > 0 ? `Environments: ${environments.join(", ")}` : "",
            `Description:\n${readString(osdTicket, "Description")}`,
            comments.length > 0 ? `Recent comments:\n${comments.join("\n\n")}` : "",
        ]
            .filter(Boolean)
            .join("\n\n"),
    };
}

function isRoutableOsdTicket(osdTicket: TOsdTicket): boolean {
    return (
        readString(osdTicket, "Issue key").length > 0 &&
        readString(osdTicket, "Summary").length > 0
    );
}

function mapPriority(priority: string): TIncomingTicketToAgent["priority"] {
    const normalizedPriority = priority.toLowerCase();

    if (normalizedPriority.includes("sev-1") || normalizedPriority.includes("critical")) {
        return "SEV-1 Critical";
    }

    if (normalizedPriority.includes("sev-2") || normalizedPriority.includes("fault")) {
        return "SEV-2 Fault";
    }

    if (normalizedPriority.includes("sev-3") || normalizedPriority.includes("minor")) {
        return "SEV-3 Minor";
    }

    return "None";
}

function readString(record: TOsdTicket, key: string): string {
    const value = record[key];

    if (typeof value === "string") {
        return value.trim();
    }

    if (Array.isArray(value)) {
        return value
            .filter((item): item is string => typeof item === "string")
            .filter(Boolean)
            .join(", ")
            .trim();
    }

    return "";
}

function readStringArray(record: TOsdTicket, key: string): Array<string> {
    const value = record[key];

    if (Array.isArray(value)) {
        return value.filter((item): item is string => typeof item === "string");
    }

    if (typeof value === "string") {
        return [value];
    }

    return [];
}
