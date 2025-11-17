# LLM Migration: Ollama → Claude Haiku API

## Overview
This guide explains how to migrate from Ollama (local, unreliable for laptops) to **Anthropic's Claude Haiku API** (the next cheapest alternative).

## Why Claude Haiku?

| Metric | Ollama | Claude Haiku | GPT-4o Mini |
|--------|--------|-------------|------------|
| **Cost** | $0 upfront | $0.80 / 1M tokens | $0.15 / 1M tokens |
| **Speed** | 5-30s/response | 0.5-2s/response | 0.5-2s/response |
| **Quality** | Good | Excellent | Excellent |
| **Reliability** | Poor on laptops | ✅ Excellent | ✅ Excellent |
| **Setup** | Complex (needs GPU) | Simple (API key) | Simple (API key) |
| **Better for laptops?** | ❌ No | ✅ Yes | ✅ Yes |

**Cost Comparison for typical usage:**
- 1M tokens ≈ 200,000 words
- Interview coach: ~100-500 responses/month = ~100K tokens/month
- **Claude Haiku: ~$0.08/month** (extremely cheap)
- **GPT-4o Mini: $0.015/month** (cheaper, but less consistent)

**Recommendation: Claude Haiku** because:
1. ✅ Works perfectly on laptops (zero hardware requirements)
2. ✅ Excellent quality (better than GPT-4o Mini for interview prep)
3. ✅ Fast responses
4. ✅ Affordable ($0.08/month estimate)

---

## Setup Instructions

### 1. Get Claude API Key

1. Go to https://console.anthropic.com/account/keys
2. Sign up or log in
3. Create new API key
4. Copy the key (looks like: `sk-ant-...`)

### 2. Update Environment Variables

**`.env` in server directory:**
```bash
# Remove these (Ollama):
# OLLAMA_API_URL=http://localhost:11434
# OLLAMA_MODEL=mistral

# Add these (Claude):
LLM_API_KEY=sk-ant-... (your API key)
LLM_CHAT_MODEL=claude-3-5-haiku-20241022
LLM_CHAT_ENDPOINT=https://api.anthropic.com/v1/messages
LLM_TEMPERATURE=0.2
```

### 3. Update aiAdapter.ts

The current `aiAdapter.ts` already supports Claude-compatible APIs. Just verify:

**Current file path:** `server/src/services/aiAdapter.ts`

Key differences when using Claude:
- Endpoint: `https://api.anthropic.com/v1/messages`
- Model: `claude-3-5-haiku-20241022` (latest model)
- API key header: `x-api-key` (Claude uses this instead of Authorization)

**Update needed in aiAdapter.ts:**

```typescript
export async function chatComplete(systemPrompt: string, userPrompt: string, maxTokens = 600) {
  const apiKey = process.env.LLM_API_KEY;
  if (!apiKey) throw new Error("LLM_API_KEY not set");
  
  // Check if using Claude or OpenAI
  const isAnthropic = process.env.LLM_CHAT_ENDPOINT?.includes('anthropic');
  
  const body = isAnthropic ? {
    model: process.env.LLM_CHAT_MODEL || "claude-3-5-haiku-20241022",
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [
      { role: "user", content: userPrompt },
    ],
    temperature: Number(process.env.LLM_TEMPERATURE || 0.2),
  } : {
    model: process.env.LLM_CHAT_MODEL || "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    max_tokens: maxTokens,
    temperature: Number(process.env.LLM_TEMPERATURE || 0.2),
  };

  const headers = isAnthropic ? {
    "Content-Type": "application/json",
    "x-api-key": apiKey,
    "anthropic-version": "2023-06-01",
  } : {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`,
  };

  const res = await fetch(process.env.LLM_CHAT_ENDPOINT || "https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const json = await res.json();
  
  if (!res.ok) {
    throw new Error(`LLM API error: ${json.error?.message || res.statusText}`);
  }

  // Handle different response formats
  if (isAnthropic) {
    return json?.content?.[0]?.text || "";
  } else {
    return json?.choices?.[0]?.message?.content || "";
  }
}
```

### 4. Install Dependencies (Optional)

The current setup should work, but ensure your packages are up-to-date:

```bash
cd server
npm install
```

### 5. Test the Setup

```bash
cd server
npm run dev
```

Try a login → interview flow. The AI responses should come from Claude Haiku now.

---

## Monitoring & Costs

### Track API Usage

**Claude API Dashboard:**
- Go to https://console.anthropic.com/usage
- Monitor usage in real-time
- Set up billing alerts

**Estimate costs:**
- Each interview session: ~2-5 API calls
- Per call: ~100-300 tokens
- **100 sessions/month = ~250K tokens = $0.20/month**

### Logs

Check server logs for any API errors:
```bash
# If you see 401 errors: API key is wrong
# If you see rate limit errors: You've hit API quota (very unlikely at these volumes)
```

---

## Rollback to OpenAI GPT-4o Mini (Alternative)

If you want to switch back to GPT-4o Mini later:

1. Get OpenAI API key from https://platform.openai.com/api-keys
2. Update `.env`:
   ```bash
   LLM_API_KEY=sk-proj-... (OpenAI key)
   LLM_CHAT_MODEL=gpt-4o-mini
   LLM_CHAT_ENDPOINT=https://api.openai.com/v1/chat/completions
   ```
3. Restart server
4. Done! Code already supports both.

---

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| `LLM_API_KEY not set` | Environment variable missing | Add to `.env` and restart |
| `401 Unauthorized` | Wrong API key | Verify key from Anthropic console |
| `Model not found` | Wrong model name | Use `claude-3-5-haiku-20241022` |
| `Rate limited` | Too many requests | Wait 1 minute, check quota usage |
| Slow responses | API issue or network | Check Anthropic status page |

---

## Next Steps

1. ✅ Get Claude API key
2. ✅ Update `.env`
3. ✅ Update `aiAdapter.ts` (if needed)
4. ✅ Test login → interview flow
5. ✅ Monitor costs for first week
6. ✅ Celebrate! Your laptop can now handle interviews 🎉

---

**Questions?** Check Anthropic's docs: https://docs.anthropic.com/
