# rag orch

this folder handles the rag flow for support ticket routing.

it:

- turns an incoming ticket into an embedding
- searches qdrant for related ticket data
- builds context from the search results
- creates a prompt for the model
- returns the model's routing answer

## files

- `embeddingprovider.ts` creates ticket embeddings with gemini
- `qdrantrepo.ts` searches stored ticket data in qdrant
- `promptbuilder.ts` builds the model context and prompt
- `llmproivder.ts` sends the prompt to gemini
- `ragservice.ts` connects the full flow together
- `ragfactory.ts` is meant to create the service with env values

## flow

`ticket -> embedding -> qdrant search -> context -> prompt -> model response`

## required env values

- `google_api_key`
- `qudrant_cluster_url`
- `qudrant_api_key`
