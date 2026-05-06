import { TIncomingTicketToAgent } from "./dto";
import { RagCoreMiddleware } from "./rag-core-middleware/rag.core";

async function main() {
    const apiKey = process.env.GOOGLE_API_KEY!

    const ticket: TIncomingTicketToAgent = {
        id: "TICKET-001",
        title: "SABSARI token endpoint returning 502",
        priority: "SEV-2 Fault",
        textInputs: `
            SABSARI production token endpoint is returning 502 Bad Gateway.
            This started after certificate renewal.
            TPPs are also reporting invalid_client errors.
        `,
    };

    const ragCoreMiddleware = new RagCoreMiddleware(
        apiKey,
        "src/peoples-data-config.md",
        process.env.GEMINI_MODEL
    );
    const decision = await ragCoreMiddleware.onRequest(ticket);

    console.log("Incoming ticket:");
    console.log(`${ticket.id} - ${ticket.title}`);
    console.log("");
    console.log("Assignment decision:");
    console.log(JSON.stringify(decision, null, 2));
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
