export type EmbeddingResult = {
    vector: number[];
};

export async function embedText(text: string): Promise<EmbeddingResult> {
    // Minimal pluggable adapter: replace fetch with your provider SDK as needed.
    const apiKey = process.env.LLM_API_KEY;
    if (!apiKey) throw new Error("LLM_API_KEY not set");
    const endpoint = process.env.EMBEDDING_ENDPOINT || "https://api.openai.com/v1/embeddings";
    const body = { input: text, model: process.env.EMBEDDING_MODEL || "text-embedding-3-small" };
    const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify(body),
    });
    const json = await res.json();
    const vector = json?.data?.[0]?.embedding;
    if (!vector) throw new Error("Failed to get embedding");
    return { vector };
}