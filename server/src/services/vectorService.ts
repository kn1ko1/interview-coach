import { QdrantClient } from "@qdrant/js-client-rest";

const QDRANT_URL = process.env.QDRANT_URL || "http://localhost:6333";
const QDRANT_API_KEY = process.env.QDRANT_API_KEY || "";
const COLLECTION = process.env.QDRANT_COLLECTION || "interview_context";

const client = new QdrantClient({ url: QDRANT_URL, apiKey: QDRANT_API_KEY || undefined });

async function ensureCollection() {
    try {
        await client.getCollection(COLLECTION);
    } catch {
        await client.createCollection(COLLECTION, {
            vectors: { size: Number(process.env.EMBEDDING_DIM || 1536), distance: "Cosine" },
        });
    }
}

export async function upsertDocument(id: string, vector: number[], meta: Record<string, unknown>) {
    await ensureCollection();
    await client.upsert(COLLECTION, {
        points: [{ id, vector, payload: meta }],
    });
}

export async function querySimilar(vector: number[], topK = 5) {
    await ensureCollection();
    const resp = await client.search(COLLECTION, {
        vector,
        limit: topK,
        with_payload: true,
    });
    return resp;
}