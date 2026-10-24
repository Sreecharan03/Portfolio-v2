import { coreChunks, searchChunks, type Chunk } from "./knowledge";

/**
 * Small lexical retrieval (TF-IDF over the content chunks). The corpus is a few dozen
 * chunks, so this is fast, deterministic and keeps each request to roughly 2K tokens
 * instead of sending the whole site.
 */

const STOP = new Set(
  "a an and are as at be but by can could did do does for from had has have he her his how i in is it its me my of on or our she should so tell than that the their them then there these they this to us was we were what when where which who why will with would you your about any some more most much many give show explain describe work works working worked now currently current know does doing done charan sree chintalapudi ch use used using tech".split(
    " ",
  ),
);

/** Common phrasings mapped onto the words the content uses. */
const ALIASES: Record<string, string> = {
  tcs: "tcs digital",
  sighnal: "sighnal youtube",
  senseminds: "senseminds industrial",
  rag: "rag retrieval",
  sql: "sql text-to-sql",
  leetcode: "leetcode contest rating",
  job: "employment role",
  jobs: "employment role",
  now: "present",
  current: "present",
  currently: "present",
  experience: "employment internship",
  skills: "tools capabilities",
  stack: "tools stack",
  tech: "tools",
  technologies: "tools",
  technology: "tools",
  offers: "offers job",
  award: "award recognition",
  awards: "award recognition",
  hackathon: "hackathon prize",
  paper: "publication paper",
  research: "publication paper",
  contact: "email phone linkedin",
  hire: "email interested roles",
  resume: "résumé",
  cv: "résumé",
  education: "education b.tech cgpa",
};

function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9.+#é-]+/)
    .map((t) => t.replace(/^[.-]+|[.-]+$/g, ""))
    .filter((t) => t.length > 1 && !STOP.has(t)) // before stemming, so "does" never becomes "doe"
    .map((t) => t.replace(/(?<=\w{3})s$/, ""))
    .filter((t) => !STOP.has(t));
}

interface Indexed {
  chunk: Chunk;
  tf: Map<string, number>;
  titleTerms: Set<string>;
}

const indexed: Indexed[] = searchChunks.map((chunk) => {
  const tf = new Map<string, number>();
  for (const t of tokens(`${chunk.title} ${chunk.text}`)) tf.set(t, (tf.get(t) ?? 0) + 1);
  return { chunk, tf, titleTerms: new Set(tokens(chunk.title)) };
});

const idf = new Map<string, number>();
for (const { tf } of indexed) for (const t of tf.keys()) idf.set(t, (idf.get(t) ?? 0) + 1);
for (const [t, df] of idf) idf.set(t, Math.log(1 + indexed.length / df));

function expand(query: string): string {
  // Aliases are looked up before stop words are dropped, so "now" can still mean "present".
  const extra = query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .map((t) => ALIASES[t])
    .filter(Boolean);
  return `${query} ${extra.join(" ")}`;
}

/**
 * Picks the chunks most relevant to the latest question (with the previous question
 * at half weight, so follow-ups like "what stack did it use?" keep their subject).
 */
export function retrieve(latest: string, previous = "", budgetChars = 5200): Chunk[] {
  const weights = new Map<string, number>();
  for (const t of tokens(expand(previous))) weights.set(t, Math.max(weights.get(t) ?? 0, 0.5));
  for (const t of tokens(expand(latest))) weights.set(t, 1);

  const scored = indexed
    .map(({ chunk, tf, titleTerms }) => {
      let score = 0;
      for (const [t, w] of weights) {
        const f = tf.get(t);
        if (!f) continue;
        score += w * (idf.get(t) ?? 0) * (1 + Math.log(f)) * (titleTerms.has(t) ? 2 : 1);
      }
      return { chunk, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  const picked: Chunk[] = [];
  let used = 0;
  const add = (chunk: Chunk) => {
    if (picked.length >= 4 || picked.includes(chunk)) return;
    if (used + chunk.text.length > budgetChars && picked.length > 0) return;
    picked.push(chunk);
    used += chunk.text.length;
  };
  for (const { chunk } of scored) add(chunk);
  // Questions in other scripts (Telugu, Hindi…) or very general ones match little English text:
  // give the model a broad overview instead of nothing.
  if (picked.length < 2) {
    for (const id of GENERAL) {
      const chunk = searchChunks.find((c) => c.id === id);
      if (chunk) add(chunk);
    }
  }
  return picked;
}

const GENERAL = ["journey-tcs", "sighnal-overview", "senseminds-360-overview", "achievements-recognition"];

export function buildContext(retrieved: Chunk[]): string {
  return [...coreChunks, ...retrieved].map((c, i) => `[${i + 1}] ${c.title} (${c.href})\n${c.text}`).join("\n\n");
}
