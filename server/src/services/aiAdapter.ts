export async function chatComplete(systemPrompt: string, userPrompt: string, maxTokens = 600) {
    const apiKey = process.env.LLM_API_KEY;
    if (!apiKey) throw new Error("LLM_API_KEY not set");
    const endpoint = process.env.LLM_CHAT_ENDPOINT || "https://api.openai.com/v1/chat/completions";
    const body = {
        model: process.env.LLM_CHAT_MODEL || "gpt-4o-mini",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
        ],
        max_tokens: maxTokens,
        temperature: Number(process.env.LLM_TEMPERATURE || 0.2),
    };
    const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify(body),
    });
    const json = await res.json();
    return json?.choices?.[0]?.message?.content || "";
}