import { QdrantClient } from "@qdrant/js-client-rest";
import { osdTicketQdrant, sdtTicketsQdrant } from "../dto";

export class QdrantRepo{
    private client : QdrantClient;
    constructor(url : string, key : string){
        this.client = new QdrantClient({
            url,
            apiKey : key
        });
    }
    async searchText(vector : Array<number>){
        const osdTickets = await this.client.search(osdTicketQdrant, {
            vector,
            limit : 500
        })
        const sdtTickets = await this.client.search(sdtTicketsQdrant, {
            vector,
            limit : 500
        })
        return [...osdTicketQdrant, ...sdtTickets];
    }
}