import { analyze } from "@/lib/assistant/analyze";
import { buildSystem } from "@/lib/assistant/prompt";
import { buildContext, retrieve } from "@/lib/assistant/retrieve";

/**
 * Portfolio assistant. The Groq key stays on the server; the browser only ever sees the
 * answer text. Messages are not logged or stored here — they are forwarded to Groq to
 * generate the reply and then discarded.
 */

export const runtime = "nodejs";
export const maxDuration = 30;

const GROQ_URL = `${process.env.GROQ_BASE_URL ?? "https://api.groq.com/openai/v1"}/chat/completions`;
// Tried in order. A model that is busy (rate-limited), retired or failing hands over to the next,
// and each has its own Groq quota. Kimi K2 leads for natural, multilingual writing and close
// instruction-following; GPT-OSS 120B, Llama 3.3 70B and Qwen3 32B back it up.
const MODELS = (
  process.env.GROQ_MODEL ?? "moonshotai/kimi-k2-instruct-0905,openai/gpt-oss-120b,llama-3.3-70b-versatile,qwen/qwen3-32b"
)
  .split(",")
  .map((m) => m.trim())
  .filter(Boolean);

/** Per-model options. Token limits are generous so answers never stop mid-sentence; the prompt keeps them short. */
function modelOptions(model: string): Record<string, unknown> {
  // GPT-OSS reasons before answering; its reasoning streams separately and counts toward the limit.
  if (model.startsWith("openai/gpt-oss")) return { reasoning_effort: "low", max_completion_tokens: 1400, temperature: 0.3 };
  // Qwen3 answers directly with thinking switched off.
  if (model.startsWith("qwen/qwen3")) return { reasoning_effort: "none", max_completion_tokens: 700, temperature: 0.4 };
  return { max_completion_tokens: 700, temperature: 0.4 };
}

const MAX_MESSAGES = 8; // the recent turns sent upstream
const MAX_USER_CHARS = 500;
const MAX_ASSISTANT_CHARS = 1200;

// Best-effort, per-instance limits. They stop casual abuse of the key; Groq's own limits are the backstop.
const LIMITS = [
  { windowMs: 60_000, max: 8 },
  { windowMs: 24 * 60 * 60_000, max: 60 },
];
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const longest = Math.max(...LIMITS.map((l) => l.windowMs));
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < longest);
  if (LIMITS.some((l) => recent.filter((t) => now - t < l.windowMs).length >= l.max)) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [key, times] of hits) if (times.every((t) => now - t >= longest)) hits.delete(key);
  }
  return false;
}

type Msg = { role: "user" | "assistant"; content: string };

function parseMessages(body: unknown): Msg[] | null {
  if (!body || typeof body !== "object" || !Array.isArray((body as { messages?: unknown }).messages)) return null;
  const raw = (body as { messages: unknown[] }).messages.slice(-MAX_MESSAGES);
  const out: Msg[] = [];
  for (const m of raw) {
    if (!m || typeof m !== "object") return null;
    const { role, content } = m as { role?: unknown; content?: unknown };
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    const text = content.trim().slice(0, role === "user" ? MAX_USER_CHARS : MAX_ASSISTANT_CHARS);
    if (text) out.push({ role, content: text });
  }
  return out.length > 0 && out[out.length - 1]?.role === "user" ? out : null;
}

/** Streams text through, removing any <think>…</think> block and leading whitespace. */
function thinkFilter() {
  let pending = "";
  let thinking = false;
  let started = false;
  const emit = (text: string) => {
    if (!started) {
      text = text.replace(/^\s+/, "");
      if (text) started = true;
    }
    return text;
  };
  return {
    push(chunk: string): string {
      pending += chunk;
      let out = "";
      for (;;) {
        if (thinking) {
          const close = pending.indexOf("</think>");
          if (close < 0) {
            pending = pending.slice(-8);
            return emit(out);
          }
          pending = pending.slice(close + 8);
          thinking = false;
        } else {
          const open = pending.indexOf("<think>");
          if (open < 0) {
            // hold back a possible partial "<think" at the end
            const keep = Math.min(pending.length, 6);
            const safe = pending.lastIndexOf("<") >= pending.length - keep ? pending.lastIndexOf("<") : pending.length;
            out += pending.slice(0, safe);
            pending = pending.slice(safe);
            return emit(out);
          }
          out += pending.slice(0, open);
          pending = pending.slice(open + 7);
          thinking = true;
        }
      }
    },
    end(): string {
      return thinking ? "" : emit(pending);
    },
  };
}

const json = (status: number, error: string) =>
  Response.json({ error }, { status, headers: { "cache-control": "no-store" } });

export async function POST(req: Request) {
  const key = process.env.GROQ_API_KEY;
  if (!key) return json(503, "offline");

  // Only this site's pages may call the endpoint from a browser.
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (origin && host) {
    let originHost: string | null = null;
    try {
      originHost = new URL(origin).host;
    } catch {
      originHost = null;
    }
    if (originHost !== host) return json(403, "forbidden");
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
  if (rateLimited(ip)) return json(429, "rate_limited");

  let messages: Msg[] | null = null;
  try {
    messages = parseMessages(await req.json());
  } catch {
    messages = null;
  }
  if (!messages) return json(400, "bad_request");

  const started = Date.now();
  const userTurns = messages.filter((m) => m.role === "user");
  const latest = userTurns[userTurns.length - 1]?.content ?? "";
  const previous = userTurns[userTurns.length - 2]?.content ?? "";

  // Understand the question first (language, script, resolved follow-ups); fall back to the raw text.
  const analysis = await analyze(messages, GROQ_URL, key);
  const { chunks, related: matched } = analysis
    ? retrieve(`${analysis.query} ${latest}`)
    : retrieve(latest, previous);

  const system = buildSystem(buildContext(chunks), analysis?.reply ?? null);
  let upstream: Response | null = null;
  let answeredBy = "";
  let attempts = 0;
  let sawRateLimit = false;
  for (const model of MODELS) {
    attempts++;
    try {
      const res = await fetch(GROQ_URL, {
        method: "POST",
        headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
        body: JSON.stringify({
          model,
          stream: true,
          ...modelOptions(model),
          messages: [{ role: "system", content: system }, ...messages],
        }),
        signal: AbortSignal.timeout(25_000),
      });
      if (res.ok && res.body) {
        upstream = res;
        answeredBy = model;
        break;
      }
      if (res.status === 429) sawRateLimit = true;
      await res.body?.cancel();
    } catch {
      // network error or timeout: try the next model
    }
  }
  // Operational log only: which model answered and how fast. Message content is never logged.
  console.info(
    JSON.stringify({
      event: "chat",
      model: answeredBy || null,
      attempts,
      analyzed: Boolean(analysis),
      language: analysis?.reply.language ?? null,
      ms: Date.now() - started,
    }),
  );
  if (!upstream?.body) return json(sawRateLimit ? 429 : 502, sawRateLimit ? "busy" : "upstream_error");

  // Groq streams OpenAI-style server-sent events; forward only the text deltas.
  // Reasoning arrives in a separate field and is dropped; a stray <think> block is filtered out too.
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  const visible = thinkFilter();
  let buffer = "";
  const text = upstream.body.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(bytes, controller) {
        buffer += decoder.decode(bytes, { stream: true });
        const events = buffer.split("\n");
        buffer = events.pop() ?? "";
        for (const line of events) {
          const data = line.startsWith("data:") ? line.slice(5).trim() : "";
          if (!data || data === "[DONE]") continue;
          try {
            const delta = JSON.parse(data)?.choices?.[0]?.delta?.content;
            if (typeof delta === "string" && delta) {
              const out = visible.push(delta);
              if (out) controller.enqueue(encoder.encode(out));
            }
          } catch {
            // ignore keep-alives and partial frames
          }
        }
      },
      flush(controller) {
        const out = visible.end();
        if (out) controller.enqueue(encoder.encode(out));
      },
    }),
  );

  const related = matched.slice(0, 3).map((c) => ({ title: c.title.split(":")[0], href: c.href }));
  const unique = related.filter((r, i) => related.findIndex((x) => x.href === r.href) === i);

  return new Response(text, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
      "x-chat-related": encodeURIComponent(JSON.stringify(unique)),
      "x-chat-model": answeredBy,
    },
  });
}
