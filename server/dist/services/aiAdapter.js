"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatComplete = void 0;
async function chatComplete(systemPrompt, userPrompt, maxTokens = 600) {
    const apiKey = process.env.LLM_API_KEY;
    if (!apiKey)
        throw new Error("LLM_API_KEY not set");
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
exports.chatComplete = chatComplete;
// install runtime deps
// npm install express @qdrant/js-client-rest
// install dev type deps
// npm install -D typescript @types/node @types/express
// (optional) if using node <18 or using node-fetch explicitly
// npm install node-fetch
// npm install -D @types/node-fetch
// quick TS check
// npx tsc --noEmit
