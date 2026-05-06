import { readFile } from "node:fs/promises";
import { RagCoreMiddleware } from "./rag-core-middleware/rag.core";
import {
    TOsdTicket,
    transformOsdTicketsToIncomingTickets,
} from "./utils/osd.transformer";
import fs from "fs";
import path from "path";

async function main() {
    const apiKey = process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error("Missing GOOGLE_API_KEY or GEMINI_API_KEY environment variable.");
    }

    const ragCoreMiddleware = new RagCoreMiddleware(
        apiKey,
        "src/peoples-data-config.md",
        process.env.GEMINI_MODEL
    );

    const osdTickets = await loadSampleOsdTickets("test-data/sample-osd.json");
    const incomingTickets = transformOsdTicketsToIncomingTickets(osdTickets);
    const simulationLimit = readSimulationLimit(incomingTickets.length);
    const ticketsToSimulate = incomingTickets.slice(0, simulationLimit);

    console.log(`Loaded ${incomingTickets.length} routable OSD tickets from sample-osd.json.`);
    console.log(`Simulating ${ticketsToSimulate.length} tickets.`);
    console.log("");

    const outputDir = path.resolve("output");
    fs.mkdirSync(outputDir, { recursive: true });
    const outputFile = path.join(outputDir, `decisions.json`);
    const decisions = loadExistingDecisions(outputFile);

    for (const ticket of ticketsToSimulate) {
        console.log("Incoming ticket:");
        console.log(`${ticket.id} - ${ticket.title}`);

        try {
            const decision = await ragCoreMiddleware.onRequest(ticket);

            console.log("Assignment decision:");
            console.log(JSON.stringify(decision, null, 2));
            decisions.push(decision);
            fs.writeFileSync(outputFile, JSON.stringify(decisions, null, 2), "utf8");
        } catch (error) {
            console.error(`Failed to route ${ticket.id}: ${(error as Error).message}`);
        }

        console.log("");
    }
}

function loadExistingDecisions(outputFile: string): Array<unknown> {
    if (!fs.existsSync(outputFile)) {
        return [];
    }

    try {
        const existing = fs.readFileSync(outputFile, "utf8");
        const parsed = JSON.parse(existing);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

async function loadSampleOsdTickets(filePath: string): Promise<Array<TOsdTicket>> {
    const json = await readFile(filePath, "utf8");
    const data = JSON.parse(json) as unknown;

    if (!Array.isArray(data)) {
        throw new Error(`Expected ${filePath} to contain a JSON array.`);
    }

    return data.filter((item): item is TOsdTicket => {
        return typeof item === "object" && item !== null && !Array.isArray(item);
    });
}

function readSimulationLimit(defaultLimit: number): number {
    const rawLimit = process.env.SIMULATION_LIMIT;

    if (!rawLimit) {
        return defaultLimit;
    }

    const limit = Number.parseInt(rawLimit, 10);

    return Number.isFinite(limit) && limit > 0 ? limit : defaultLimit;
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
