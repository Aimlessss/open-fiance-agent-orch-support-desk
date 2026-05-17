import { readEnv } from "../utils/readEnv";

export function createRagService(){
    const key = readEnv("GOOGLE_API_KEY");
    const qdrantUrl = readEnv("QUDRANT_CLUSTER_URL");
    const qdrantKey = readEnv("QUDRANT_API_KEY");

    
}