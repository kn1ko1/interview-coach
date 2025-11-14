"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.querySimilar = exports.upsertDocument = void 0;
const js_client_rest_1 = require("@qdrant/js-client-rest");
const QDRANT_URL = process.env.QDRANT_URL || "http://localhost:6333";
const QDRANT_API_KEY = process.env.QDRANT_API_KEY || "";
const COLLECTION = process.env.QDRANT_COLLECTION || "interview_context";
const client = new js_client_rest_1.QdrantClient({ url: QDRANT_URL, apiKey: QDRANT_API_KEY || undefined });
async function ensureCollection() {
    try {
        await client.getCollection(COLLECTION);
    }
    catch {
        await client.createCollection(COLLECTION, {
            vectors: { size: Number(process.env.EMBEDDING_DIM || 1536), distance: "Cosine" },
        });
    }
}
async function upsertDocument(id, vector, meta) {
    await ensureCollection();
    await client.upsert(COLLECTION, {
        points: [{ id, vector, payload: meta }],
    });
}
exports.upsertDocument = upsertDocument;
async function querySimilar(vector, topK = 5) {
    await ensureCollection();
    const resp = await client.search(COLLECTION, {
        vector,
        limit: topK,
        with_payload: true,
    });
    return resp;
}
exports.querySimilar = querySimilar;
