import type { DiagramId } from "./projects";

/**
 * Architecture diagrams. Labels are content; `box` positions are in a
 * 1200-unit-wide viewBox for the wide layout. The narrow (mobile) layout is
 * derived automatically: nodes stack in the order they first appear in `steps`.
 */

export type NodeKind = "default" | "guard" | "store" | "verify" | "io" | "warn";
export type EdgeKind = "flow" | "control" | "error";

export interface DiagramNode {
  id: string;
  title: string;
  lines?: string[];
  kind?: NodeKind;
  box: { x: number; y: number; w: number; h: number };
}

export interface DiagramEdge {
  from: string;
  to: string;
  kind?: EdgeKind;
  /** Force the routing axis when the automatic choice would cross another node. */
  via?: "h" | "v";
}

export interface DiagramStep {
  id: string;
  title: string;
  body: string;
  nodes: string[];
  edges: string[]; // "from>to"
}

export interface DiagramSpec {
  id: DiagramId;
  label: string;
  height: number;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  steps: DiagramStep[];
}

const col5 = [16, 256, 496, 736, 976];
const col4 = [16, 316, 616, 916];
const col6 = [16, 214.4, 412.8, 611.2, 809.6, 1008];

function at(x: number | undefined, y: number, w: number, h: number) {
  return { x: x ?? 0, y, w, h };
}

export const diagrams: Record<DiagramId, DiagramSpec> = {
  sighnal: {
    id: "sighnal",
    label: "Sighnal architecture",
    height: 456,
    nodes: [
      { id: "ingest", title: "Ingestion", lines: ["Resumable jobs", "10K+ threads / video"], kind: "io", box: at(col5[0], 24, 208, 96) },
      { id: "queue", title: "Queue fabric", lines: ["Celery + Redis · 4 queues", "Fan-out · locks · gates"], box: at(col5[1], 24, 208, 96) },
      { id: "watchdog", title: "Watchdog", lines: ["Self-healing", "10 failure modes"], kind: "guard", box: at(col5[1], 180, 208, 96) },
      { id: "classify", title: "LLM classification", lines: ["gpt-oss-120b on Groq", "Intent · sentiment", "Dynamic batching"], box: at(col5[2], 24, 208, 96) },
      { id: "protect", title: "Protection layer", lines: ["SimHash · TTL-LRU cache", "AIMD rate control", "Circuit breaker"], kind: "guard", box: at(col5[2], 180, 208, 96) },
      { id: "store", title: "Evidence store", lines: ["MongoDB"], kind: "store", box: at(col5[3], 24, 208, 96) },
      { id: "chat", title: "Grounded chat", lines: ["LLM proposes claims", "Code verifies citations"], kind: "verify", box: at(col5[3], 180, 208, 96) },
      { id: "api", title: "API & access", lines: ["JWT (argon2) · RBAC", "Plan tiers · audit log"], box: at(col5[3], 336, 208, 96) },
      { id: "topics", title: "Topic modelling", lines: ["BERTopic", "MiniLM → UMAP → HDBSCAN"], box: at(col5[4], 24, 208, 96) },
      { id: "summaries", title: "Summaries", lines: ["Claude Haiku"], box: at(col5[4], 180, 208, 96) },
      { id: "web", title: "Web app", lines: ["Next.js · TypeScript", "TanStack Query"], kind: "io", box: at(col5[4], 336, 208, 96) },
    ],
    edges: [
      { from: "ingest", to: "queue" },
      { from: "watchdog", to: "queue", kind: "control" },
      { from: "queue", to: "classify" },
      { from: "protect", to: "classify", kind: "control" },
      { from: "classify", to: "store" },
      { from: "store", to: "topics" },
      { from: "store", to: "summaries" },
      { from: "store", to: "chat" },
      { from: "chat", to: "api" },
      { from: "api", to: "web" },
    ],
    steps: [
      {
        id: "ingest",
        title: "Ingest",
        body: "Resumable jobs pull 10K+ comment threads per video. A restarted worker continues where the job left off instead of starting again.",
        nodes: ["ingest", "queue"],
        edges: ["ingest>queue"],
      },
      {
        id: "fanout",
        title: "Fan out",
        body: "Each video fans out across four Celery queues on Redis. A distributed lock and concurrency gates stop parallel jobs from colliding, and a watchdog heals ten known failure modes.",
        nodes: ["queue", "watchdog"],
        edges: ["watchdog>queue"],
      },
      {
        id: "classify",
        title: "Classify",
        body: "Comments are batched dynamically into LLM calls for intent and sentiment. SimHash drops near-duplicates and a TTL-LRU cache skips repeat work; AIMD rate control and a circuit breaker protect the provider and the pipeline.",
        nodes: ["classify", "protect"],
        edges: ["queue>classify", "protect>classify"],
      },
      {
        id: "understand",
        title: "Understand",
        body: "Results land in MongoDB. BERTopic — MiniLM embeddings, UMAP, HDBSCAN — groups comments into topics, and Claude Haiku writes the summaries.",
        nodes: ["store", "topics", "summaries"],
        edges: ["classify>store", "store>topics", "store>summaries"],
      },
      {
        id: "answer",
        title: "Answer",
        body: "In chat, the model proposes claims with citations. Code checks every citation against stored evidence before the answer is shown; unsupported claims do not get through.",
        nodes: ["store", "chat"],
        edges: ["store>chat"],
      },
      {
        id: "serve",
        title: "Serve",
        body: "JWT with argon2 password hashing, role-based access, plan-tier enforcement and audit logging sit in front of a Next.js and TanStack Query app. Everything runs under Docker Compose.",
        nodes: ["chat", "api", "web"],
        edges: ["chat>api", "api>web"],
      },
    ],
  },

  senseminds: {
    id: "senseminds",
    label: "SenseMinds 360 architecture",
    height: 472,
    nodes: [
      { id: "readings", title: "Readings", lines: ["Live 30-second feed", "Validated, idempotent"], kind: "io", box: at(col5[0], 24, 208, 96) },
      { id: "timescale", title: "TimescaleDB", lines: ["Sensor history", "≈2.86M readings"], kind: "store", box: at(col5[1], 24, 208, 96) },
      { id: "engines", title: "7 engines", lines: ["Thresholds · reliability", "Operating state · health"], box: at(col5[2], 24, 208, 96) },
      { id: "findings", title: "Findings", lines: ["Append-only facts", "Evidence required"], kind: "verify", box: at(col5[3], 24, 208, 96) },
      { id: "rules", title: "Rule engine", lines: ["Multi-signal rules", "Likely causes"], kind: "guard", box: at(col5[4], 24, 208, 96) },
      { id: "ml", title: "Advisory ML", lines: ["Isolation Forest · GMM", "Backtested forecasts"], box: at(col5[3], 188, 208, 96) },
      { id: "kg", title: "Knowledge graph", lines: ["Assets · findings", "Diagnoses · verdicts"], kind: "store", box: at(col5[4], 188, 208, 96) },
      { id: "copilot", title: "Grounded LLM", lines: ["Every claim cites", "a finding id"], kind: "verify", box: at(col5[4], 352, 208, 96) },
      { id: "users", title: "Engineers", lines: ["Dashboard · 3D twin", "Email escalation"], kind: "io", box: at(col5[3], 352, 208, 96) },
    ],
    edges: [
      { from: "readings", to: "timescale" },
      { from: "timescale", to: "engines" },
      { from: "engines", to: "findings" },
      { from: "findings", to: "rules" },
      { from: "rules", to: "kg" },
      { from: "findings", to: "ml", kind: "control" },
      { from: "ml", to: "kg", kind: "control" },
      { from: "kg", to: "copilot" },
      { from: "copilot", to: "users" },
    ],
    steps: [
      {
        id: "ingest",
        title: "Ingest",
        body: "Readings arrive every 30 seconds through one validated, idempotent path, whether from the simulator, a REST push or a historian export.",
        nodes: ["readings", "timescale"],
        edges: ["readings>timescale"],
      },
      {
        id: "analyse",
        title: "Analyse",
        body: "Seven deterministic engines turn sensor history into findings: immutable, evidence-backed facts committed in one transaction.",
        nodes: ["engines", "findings"],
        edges: ["timescale>engines", "engines>findings"],
      },
      {
        id: "reason",
        title: "Reason",
        body: "Rules combine findings into likely causes, and the knowledge graph records how sensors, subsystems, findings and diagnoses connect.",
        nodes: ["rules", "kg"],
        edges: ["findings>rules", "rules>kg"],
      },
      {
        id: "learn",
        title: "Learn",
        body: "Isolation Forest, a Gaussian mixture and backtested forecasts add hypotheses on a slower cadence. They can suggest; they can never raise an alarm.",
        nodes: ["ml"],
        edges: ["findings>ml", "ml>kg"],
      },
      {
        id: "explain",
        title: "Explain",
        body: "The LLM answers from retrieved evidence only. Claims without a valid citation are dropped, and gaps are reported as insufficient evidence.",
        nodes: ["copilot", "users"],
        edges: ["kg>copilot", "copilot>users"],
      },
    ],
  },

  financial: {
    id: "financial",
    label: "Financial analytics LangGraph workflow",
    height: 304,
    nodes: [
      { id: "intent", title: "Intent detector", lines: ["Gemini 2.0 Flash", "Classifies the request"], box: at(col5[0], 24, 208, 88) },
      { id: "entities", title: "Entity extractor", lines: ["Symbols · metrics", "Periods · comparisons"], box: at(col5[1], 24, 208, 88) },
      { id: "sql", title: "SQL generator", lines: ["4 complexity tiers", "LLM review pass"], box: at(col5[2], 24, 208, 88) },
      { id: "exec", title: "Query executor", lines: ["SecurityValidator", "Cache · 30 s timeout"], kind: "guard", box: at(col5[3], 24, 208, 88) },
      { id: "format", title: "Response formatter", lines: ["Insights · risk warnings", "Confidence level"], kind: "verify", box: at(col5[4], 24, 208, 88) },
      { id: "error", title: "Error handler", lines: ["Explains the failure"], kind: "warn", box: at(376, 192, 208, 88) },
      { id: "db", title: "PostgreSQL", lines: ["7-table schema"], kind: "store", box: at(col5[3], 192, 208, 88) },
    ],
    edges: [
      { from: "intent", to: "entities" },
      { from: "entities", to: "sql" },
      { from: "sql", to: "exec" },
      { from: "exec", to: "format" },
      { from: "exec", to: "db" },
      { from: "intent", to: "error", kind: "error", via: "v" },
      { from: "entities", to: "error", kind: "error", via: "v" },
      { from: "sql", to: "error", kind: "error", via: "v" },
      { from: "exec", to: "error", kind: "error", via: "v" },
    ],
    steps: [
      {
        id: "intent",
        title: "Detect intent",
        body: "Gemini classifies the question — stock analysis, risk, sentiment and similar — or marks it unsupported, which routes straight to the error handler.",
        nodes: ["intent"],
        edges: [],
      },
      {
        id: "entities",
        title: "Extract entities",
        body: "Symbols such as AAPL and TSLA, metrics such as RSI and MACD, time periods and comparison logic are pulled out, with conversation history for follow-ups.",
        nodes: ["entities"],
        edges: ["intent>entities"],
      },
      {
        id: "sql",
        title: "Generate SQL",
        body: "The generator rates the query's complexity and picks a strategy for that tier. A second LLM pass reviews syntax and join logic.",
        nodes: ["sql"],
        edges: ["entities>sql"],
      },
      {
        id: "exec",
        title: "Guard & execute",
        body: "Before execution, the SecurityValidator blocks dangerous patterns, allows only read-only statements and checks tables against an allow-list. Results are cached by complexity; every query runs under a 30-second timeout.",
        nodes: ["exec", "db"],
        edges: ["sql>exec", "exec>db"],
      },
      {
        id: "format",
        title: "Synthesise",
        body: "Rows become an answer with key insights, risk warnings and a confidence level based on data coverage.",
        nodes: ["format"],
        edges: ["exec>format"],
      },
      {
        id: "error",
        title: "Fail safely",
        body: "Any stage that sets an error routes to one handler that tells the user what went wrong and how to rephrase. Nothing half-finished reaches the database or the answer.",
        nodes: ["error"],
        edges: ["intent>error", "entities>error", "sql>error", "exec>error"],
      },
    ],
  },

  rag: {
    id: "rag",
    label: "Agentic RAG pipelines",
    height: 296,
    nodes: [
      { id: "pdf", title: "PDF textbooks", lines: ["DBMS · ML · OS"], kind: "io", box: at(col6[0], 24, 176, 88) },
      { id: "extract", title: "Extract & clean", lines: ["PyMuPDF", "pdfplumber fallback"], box: at(col6[1], 24, 176, 88) },
      { id: "chunk", title: "Chunk", lines: ["~500 words", "100-word overlap"], box: at(col6[2], 24, 176, 88) },
      { id: "embed", title: "Embed", lines: ["BGE-large-en-v1.5", "1,024 dimensions"], box: at(col6[3], 24, 176, 88) },
      { id: "qdrant", title: "Qdrant", lines: ["Vectors + subject", "metadata"], kind: "store", box: at(col6[4], 24, 176, 88) },
      { id: "q", title: "Question", lines: ["From the chat tab"], kind: "io", box: at(col6[0], 184, 176, 88) },
      { id: "a1", title: "1 · Understand", lines: ["Subject routing", "Type · rewrite"], box: at(col6[1], 184, 176, 88) },
      { id: "a2", title: "2 · Retrieve", lines: ["Top-5 chunks", "Subject filter"], box: at(col6[2], 184, 176, 88) },
      { id: "a3", title: "3 · Generate", lines: ["Gemma-2-9B", "Context only · T 0.2"], box: at(col6[3], 184, 176, 88) },
      { id: "a4", title: "4 · Verify", lines: ["Confidence score", "Verdict"], kind: "verify", box: at(col6[4], 184, 176, 88) },
      { id: "out", title: "Answer", lines: ["+ sources", "+ confidence"], kind: "io", box: at(col6[5], 184, 176, 88) },
    ],
    edges: [
      { from: "pdf", to: "extract" },
      { from: "extract", to: "chunk" },
      { from: "chunk", to: "embed" },
      { from: "embed", to: "qdrant" },
      { from: "q", to: "a1" },
      { from: "a1", to: "a2" },
      { from: "a2", to: "qdrant", kind: "control", via: "v" },
      { from: "a2", to: "a3" },
      { from: "a3", to: "a4" },
      { from: "a4", to: "out" },
    ],
    steps: [
      {
        id: "index",
        title: "Index",
        body: "PDFs are extracted page by page (PyMuPDF, with pdfplumber as fallback), cleaned, split into sentence-aware overlapping chunks, embedded with BGE and upserted into Qdrant with subject metadata.",
        nodes: ["pdf", "extract", "chunk", "embed", "qdrant"],
        edges: ["pdf>extract", "extract>chunk", "chunk>embed", "embed>qdrant"],
      },
      {
        id: "understand",
        title: "Understand",
        body: "Agent 1 scores subject keywords, detects the question type and rewrites the query as “SUBJECT concept: question”.",
        nodes: ["q", "a1"],
        edges: ["q>a1"],
      },
      {
        id: "retrieve",
        title: "Retrieve",
        body: "Agent 2 embeds the rewritten query with BGE's retrieval prefix and fetches the top five chunks from Qdrant, filtered by subject.",
        nodes: ["a2", "qdrant"],
        edges: ["a1>a2", "a2>qdrant"],
      },
      {
        id: "generate",
        title: "Generate",
        body: "Agent 3 prompts Gemma-2-9B to answer only from the retrieved chunks, at temperature 0.2.",
        nodes: ["a3"],
        edges: ["a2>a3"],
      },
      {
        id: "verify",
        title: "Verify",
        body: "Agent 4 combines retrieval score, answer-to-context overlap and a refusal check into a confidence score and a verdict, returned with the sources.",
        nodes: ["a4", "out"],
        edges: ["a3>a4", "a4>out"],
      },
    ],
  },

  legal: {
    id: "legal",
    label: "Legal summarization pipeline",
    height: 284,
    nodes: [
      { id: "corpus", title: "Legal corpus", lines: ["d0r1h/ILC", "Judgments · contracts · filings"], kind: "io", box: at(col4[0], 24, 268, 88) },
      { id: "instruct", title: "Instruction data", lines: ["Dolly-style JSONL", "Prepared on Databricks"], box: at(col4[1], 24, 268, 88) },
      { id: "stage1", title: "Stage 1", lines: ["TinyLLaMA 1.1B", "Instruction fine-tuning"], box: at(col4[2], 24, 268, 88) },
      { id: "stage2", title: "Stage 2", lines: ["Gemma 2-2B · LoRA r = 8", "4-bit base weights"], box: at(col4[3], 24, 268, 88) },
      { id: "hybrid", title: "Hybrid output", lines: ["Extractive for clauses", "Abstractive for narrative"], kind: "verify", box: at(col4[3], 172, 268, 88) },
      { id: "eval", title: "Evaluation", lines: ["ROUGE · BLEU · METEOR", "vs TextRank, BERTSUM"], box: at(col4[2], 172, 268, 88) },
      { id: "release", title: "Packaging", lines: ["llama.cpp quantization", "Hugging Face upload"], kind: "io", box: at(col4[1], 172, 268, 88) },
    ],
    edges: [
      { from: "corpus", to: "instruct" },
      { from: "instruct", to: "stage1" },
      { from: "stage1", to: "stage2" },
      { from: "stage2", to: "hybrid" },
      { from: "hybrid", to: "eval" },
      { from: "eval", to: "release" },
    ],
    steps: [
      {
        id: "data",
        title: "Prepare",
        body: "Legal records — judgments, contracts, regulatory filings — are converted to instruction, context and response records.",
        nodes: ["corpus", "instruct"],
        edges: ["corpus>instruct"],
      },
      {
        id: "stage1",
        title: "Stage 1",
        body: "TinyLLaMA 1.1B is instruction-tuned for rapid adaptation to legal language.",
        nodes: ["stage1"],
        edges: ["instruct>stage1"],
      },
      {
        id: "stage2",
        title: "Stage 2",
        body: "Gemma 2-2B is fine-tuned with LoRA on 4-bit weights to strengthen fluency and abstractive quality.",
        nodes: ["stage2"],
        edges: ["stage1>stage2"],
      },
      {
        id: "hybrid",
        title: "Summarise",
        body: "Clause-heavy documents get extractive output that keeps wording verbatim; narrative case law gets abstractive summaries.",
        nodes: ["hybrid"],
        edges: ["stage2>hybrid"],
      },
      {
        id: "eval",
        title: "Evaluate",
        body: "ROUGE, BLEU and METEOR, compared with TextRank, BERTSUM and legal-specific transformers.",
        nodes: ["eval"],
        edges: ["hybrid>eval"],
      },
      {
        id: "release",
        title: "Package",
        body: "Notebooks cover llama.cpp quantization for smaller deployments and upload to the Hugging Face Hub.",
        nodes: ["release"],
        edges: ["eval>release"],
      },
    ],
  },

  traffic: {
    id: "traffic",
    label: "Adaptive traffic control pipeline",
    height: 284,
    nodes: [
      { id: "video", title: "Junction video", lines: ["MP4 · AVI · MOV · MKV", "Upload or Drive link"], kind: "io", box: at(col4[0], 24, 268, 88) },
      { id: "detect", title: "YOLOv8", lines: ["bike · bus · car", "conf 0.3 · IoU 0.7"], box: at(col4[1], 24, 268, 88) },
      { id: "track", title: "ByteTrack", lines: ["Persistent vehicle IDs"], box: at(col4[2], 24, 268, 88) },
      { id: "zones", title: "Polygon zones", lines: ["North · East · South · West", "Count on entry, on red"], box: at(col4[3], 24, 268, 88) },
      { id: "queue", title: "Queue & wait", lines: ["Demand per approach", "Reset on green"], kind: "store", box: at(col4[3], 172, 268, 88) },
      { id: "controller", title: "Signal controller", lines: ["Priority 0.6 · 0.3 · 0.1", "Green 15–60 s"], kind: "verify", box: at(col4[2], 172, 268, 88) },
      { id: "output", title: "Output", lines: ["Annotated video", "Streamlit dashboard"], kind: "io", box: at(col4[1], 172, 268, 88) },
    ],
    edges: [
      { from: "video", to: "detect" },
      { from: "detect", to: "track" },
      { from: "track", to: "zones" },
      { from: "zones", to: "queue" },
      { from: "queue", to: "controller" },
      { from: "controller", to: "output" },
    ],
    steps: [
      { id: "input", title: "Input", body: "A junction video is uploaded or pulled from a Drive link, validated, and its metadata extracted.", nodes: ["video"], edges: [] },
      { id: "detect", title: "Detect", body: "YOLOv8 with custom weights detects bikes, buses and cars in every frame.", nodes: ["detect"], edges: ["video>detect"] },
      { id: "track", title: "Track", body: "ByteTrack gives each vehicle a persistent ID across frames, so one vehicle is one count.", nodes: ["track"], edges: ["detect>track"] },
      {
        id: "count",
        title: "Count",
        body: "A vehicle entering an approach's zone while it is red joins that queue; the queue clears when the approach turns green. Entry times give waiting time.",
        nodes: ["zones", "queue"],
        edges: ["track>zones", "zones>queue"],
      },
      {
        id: "decide",
        title: "Decide",
        body: "After a fixed 30-second baseline, the next phase goes to the highest-priority approach, and its green time scales with its queue within 15–60 s.",
        nodes: ["controller"],
        edges: ["queue>controller"],
      },
      { id: "output", title: "Output", body: "Annotated video and a Streamlit dashboard show detections, zones, queues and signal state.", nodes: ["output"], edges: ["controller>output"] },
    ],
  },
};
