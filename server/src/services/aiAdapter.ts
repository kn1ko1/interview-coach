export type PersonalityMode = 'confidence' | 'performance';

/**
 * Get personality-specific system prompt enhancement
 */
function getPersonalityPromptAddition(personality: PersonalityMode): string {
  if (personality === 'performance') {
    return `

PERSONALITY: You are a rigorous, performance-focused interview coach. Provide honest, detailed feedback.
- Give clear, constructive critique
- Highlight specific gaps in responses
- Challenge vague or incomplete answers
- Demand concrete examples and specifics
- Be direct about areas needing improvement
- Focus on performance gaps and actionable solutions`;
  }
  
  return `

PERSONALITY: You are a supportive, confidence-building interview coach. Provide constructive feedback.
- Acknowledge effort and strengths
- Frame feedback positively but honestly
- Suggest improvements gently
- Celebrate progress and growth
- Build confidence while maintaining honesty
- Focus on development and building skills`;
}

export async function chatComplete(systemPrompt: string, userPrompt: string, maxTokens = 600, personality: PersonalityMode = 'confidence') {
  const apiKey = process.env.LLM_API_KEY;
  if (!apiKey) throw new Error("LLM_API_KEY not set");
  
  const endpoint = process.env.LLM_CHAT_ENDPOINT || "https://api.anthropic.com/v1/messages";
  const isAnthropic = endpoint.includes('anthropic');
  
  // Add personality enhancement to system prompt
  const enhancedSystemPrompt = systemPrompt + getPersonalityPromptAddition(personality);
  
  // Prepare request body based on provider
  const body = isAnthropic ? {
    model: process.env.LLM_CHAT_MODEL || "claude-3-5-haiku-20241022",
    max_tokens: maxTokens,
    system: enhancedSystemPrompt,
    messages: [
      { role: "user", content: userPrompt },
    ],
    temperature: Number(process.env.LLM_TEMPERATURE || 0.2),
  } : {
    model: process.env.LLM_CHAT_MODEL || "gpt-4o-mini",
    messages: [
      { role: "system", content: enhancedSystemPrompt },
      { role: "user", content: userPrompt },
    ],
    max_tokens: maxTokens,
    temperature: Number(process.env.LLM_TEMPERATURE || 0.2),
  };

  // Prepare headers based on provider
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (isAnthropic) {
    headers["x-api-key"] = apiKey;
    headers["anthropic-version"] = "2023-06-01";
  } else {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const json = await res.json();
    
    if (!res.ok) {
      console.error("LLM API Error:", {
        status: res.status,
        provider: isAnthropic ? "Anthropic" : "OpenAI",
        error: json.error,
      });
      throw new Error(`LLM API error: ${json.error?.message || res.statusText}`);
    }

    // Extract response based on provider format
    if (isAnthropic) {
      return json?.content?.[0]?.text || "";
    } else {
      return json?.choices?.[0]?.message?.content || "";
    }
  } catch (err) {
    console.error("Chat completion error:", err);
    throw err;
  }
}

// install runtime deps
// npm install express @qdrant/js-client-rest

// install dev type deps
// npm install -D typescript @types/node @types/express

// (optional) if using node <18 or using node-fetch explicitly
// npm install node-fetch
// npm install -D @types/node-fetch

// quick TS check
// npx tsc --noEmit