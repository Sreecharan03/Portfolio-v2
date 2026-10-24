import type { ReplyLanguage } from "./prompt";

/**
 * Query understanding: a small, fast model turns the visitor's latest message (plus recent
 * turns) into an English search query and names its language and script. Retrieval then works
 * for Telugu, Hindi and follow-ups like "what stack did it use?", and the main model is told
 * exactly which language to reply in. Any failure or timeout simply skips this step.
 */

type Msg = { role: "user" | "assistant"; content: string };

export interface Analysis {
  query: string;
  reply: ReplyLanguage;
}

const ANALYZER_MODEL = process.env.GROQ_ANALYZER_MODEL ?? "llama-3.1-8b-instant";

const INSTRUCTIONS = `You prepare search queries for a portfolio website about Charan (Sree Charan Chintalapudi), an AI engineer.
Read the conversation and look at the visitor's LAST message.
Return JSON only, with these keys:
- "query": the last message rewritten as a short English search query (5 to 12 words). Resolve words like "it", "that project" or "there" from earlier turns. Translate if it is not English.
- "language": the language of the last message, in English (for example "English", "Telugu", "Hindi", "Tamil").
- "latin": true if a non-English language is typed in English letters (for example "charan evaru" or "kya kaam karta hai"), otherwise false.`;

export async function analyze(messages: Msg[], url: string, key: string): Promise<Analysis | null> {
  const transcript = messages
    .slice(-5)
    .map((m) => `${m.role === "user" ? "Visitor" : "Assistant"}: ${m.content.slice(0, 400)}`)
    .join("\n");
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({
        model: ANALYZER_MODEL,
        temperature: 0,
        max_completion_tokens: 120,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: INSTRUCTIONS },
          { role: "user", content: transcript },
        ],
      }),
      signal: AbortSignal.timeout(2500),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const parsed = JSON.parse(data.choices?.[0]?.message?.content ?? "{}") as Record<string, unknown>;
    const query = typeof parsed.query === "string" ? parsed.query.trim().slice(0, 200) : "";
    const language = typeof parsed.language === "string" ? parsed.language.trim().slice(0, 30) : "";
    if (!query || !/^[\p{L} ()-]{2,30}$/u.test(language)) return null;
    return { query, reply: { language, latin: parsed.latin === true } };
  } catch {
    return null;
  }
}
