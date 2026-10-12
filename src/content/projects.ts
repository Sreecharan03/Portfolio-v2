import type { Metric } from "./sources";

/**
 * Projects and case studies.
 *
 * Every claim here traces to the owner's technical knowledge base or to the
 * public repositories (read directly). Figures marked "reported" are on-the-job
 * measurements without public data; "repo" values were read from source code.
 */

export type DiagramId =
  | "sighnal"
  | "senseminds"
  | "financial"
  | "rag"
  | "legal"
  | "traffic";

export type DemoId =
  | "resilience-drill"
  | "health-rollup"
  | "sql-guard"
  | "rag-lab"
  | "junction-sandbox"
  | "training-card";

export type Accent = "signal" | "verify" | "warn";

export interface ProjectLink {
  label: string;
  href: string;
  kind: "repo" | "paper";
}

export interface Decision {
  title: string;
  body: string;
}

export interface CaseStudy {
  context: string[];
  challenge: string[];
  role: string[];
  architectureCaption: string;
  diagram: DiagramId;
  demo?: { id: DemoId; title: string; intro: string };
  decisions: Decision[];
  quality: { title: string; body: string[] };
  results: Metric[];
  resultsNote?: string;
  lessons: string[];
  next: string[];
}

export interface Project {
  slug: string;
  index: string;
  title: string;
  category: string;
  kind: string;
  period: string;
  role: string;
  summary: string;
  tagline: string;
  domains: string[];
  stack: string[];
  highlights: Metric[];
  links: ProjectLink[];
  accent: Accent;
  visibility: "public" | "hidden";
  caseStudy: CaseStudy;
}

export const projects: Project[] = [
  {
    slug: "sighnal",
    index: "01",
    title: "Sighnal",
    category: "Distributed GenAI platform",
    kind: "Freelance client product",
    period: "2026 — present",
    role: "AI & backend engineer · designed and built end to end",
    summary:
      "A YouTube comment-intelligence platform. It ingests 10K+ comment threads per video, classifies them with an LLM at scale, groups them into topics and answers questions with citations that are checked in code.",
    tagline:
      "Thousands of LLM calls per video, a queue fabric that survives failure, and a chat that can only say what the evidence supports.",
    domains: ["LLM pipelines", "Distributed systems", "Grounded generation"],
    stack: [
      "Python",
      "Celery",
      "Redis",
      "MongoDB",
      "Groq · gpt-oss-120b",
      "BERTopic",
      "UMAP",
      "HDBSCAN",
      "MiniLM",
      "Claude Haiku",
      "JWT · argon2",
      "Docker Compose",
      "Next.js",
      "TypeScript",
      "TanStack Query",
    ],
    highlights: [
      { value: "574 → 0", label: "permanently failed comments on a 12,910-comment run", source: "reported" },
      { value: "300+", label: "automated tests, including a 33-test resilience suite", source: "reported" },
    ],
    links: [],
    accent: "signal",
    visibility: "public",
    caseStudy: {
      context: [
        "Creators receive thousands of comments per video: requests, complaints, questions and praise, far more than anyone reads. Sighnal turns that stream into structure — what viewers ask for, how they feel, which topics keep returning — and answers questions about the audience.",
        "It is a client product I built as an independent engineer, from the ingestion layer to the web app.",
      ],
      challenge: [
        "One LLM call is easy. Tens of thousands per video are not: providers throttle, requests time out, responses come back malformed and workers restart mid-job. Each of those failures is a comment that silently disappears from the analysis.",
        "The chat carries a different risk. An assistant that summarises an audience can invent evidence just as easily as it can cite it, so every answer has to stay tied to real comments.",
      ],
      role: [
        "Designed and built the platform end to end: ingestion, the Celery and Redis queue architecture, the LLM classification pipeline and its protection layer, topic modelling, grounded chat, authentication and access control, and the Next.js front end.",
      ],
      architectureCaption:
        "Simplified architecture. Components are as built; internal wiring is condensed for readability.",
      diagram: "sighnal",
      demo: {
        id: "resilience-drill",
        title: "Failure drill",
        intro:
          "Replay how the protection layer reacts when the model provider goes down and then throttles. The mechanisms are the documented ones; the timeline is a simulation, not production telemetry.",
      },
      decisions: [
        {
          title: "Treat the model provider as an unreliable dependency",
          body: "LLM calls go through AIMD rate control — cut concurrency sharply when throttled, recover gradually — and a circuit breaker that stops sending traffic to a failing dependency instead of burning retries against it.",
        },
        {
          title: "Never pay twice for the same comment",
          body: "SimHash removes near-duplicate comments before classification, and a TTL-LRU cache keeps the system from repeating calls it has already made.",
        },
        {
          title: "Fan out per video, gate globally",
          body: "Each video fans out across four queues, while a distributed lock and concurrency gates keep parallel jobs from colliding or overrunning provider limits.",
        },
        {
          title: "Verify in code, not in the prompt",
          body: "The chat model proposes claims with citations; code checks each citation against stored evidence before an answer is shown. A prompt can ask for grounding. Only a check can enforce it.",
        },
        {
          title: "Resume, don't restart",
          body: "Ingestion jobs are resumable, and a self-healing watchdog detects and recovers from ten distinct failure modes, so a crashed worker costs time rather than data.",
        },
      ],
      quality: {
        title: "Reliability as a test target",
        body: [
          "Failure handling is tested like any other feature. A 286-test suite covers the classifier and a separate 33-test suite exercises the resilience layer — more than 300 automated tests in total.",
        ],
      },
      results: [
        { value: "574 → 0", label: "permanently failed comments on a 12,910-comment run", source: "reported" },
        { value: "10K+", label: "comment threads per video through resumable ingestion jobs", source: "reported" },
        { value: "10", label: "failure modes detected and healed by the watchdog", source: "reported" },
        { value: "300+", label: "automated tests: 286 classifier, 33 resilience", source: "reported" },
      ],
      resultsNote:
        "Sighnal is a client product, so code and production data are private. Figures are reported from the build.",
      lessons: [
        "Most of the engineering in an LLM product lives on the unhappy path. The interesting code runs on the 429, not the 200.",
        "Grounding is a property of the system, not the model. It holds when a check the model cannot talk its way around enforces it.",
      ],
      next: [
        "Publish the evaluation method behind the classifier's measured improvements.",
        "Add per-stage latency and cost dashboards to the queue fabric.",
      ],
    },
  },
  {
    slug: "senseminds-360",
    index: "02",
    title: "SenseMinds 360",
    category: "Industrial AI · Grounded LLM",
    kind: "Employment · AISmartLive Solutions",
    period: "Mar — Dec 2025",
    role: "Junior Data Scientist · technical lead of a 12-member team",
    summary:
      "An industrial-intelligence platform for refrigeration, air and nitrogen equipment. Deterministic engines turn sensor history into evidence-backed findings, rules and a knowledge graph give them meaning, unsupervised models add advisory signals, and a grounded LLM explains it all with a citation for every claim.",
    tagline: "Deterministic engineering first, learning second, language last.",
    domains: ["Industrial AI", "Grounded LLM", "Knowledge graph"],
    stack: ["Python", "FastAPI", "pandas", "scikit-learn", "TimescaleDB", "PostgreSQL", "Groq · Llama 3.3 70B", "React", "three.js", "Docker Compose"],
    highlights: [
      { value: "7", label: "deterministic engines run before any model", source: "codebase" },
      { value: "≈2.86M", label: "historical sensor readings across six machines", source: "codebase" },
    ],
    links: [],
    accent: "warn",
    visibility: "public",
    caseStudy: {
      context: [
        "A pharmaceutical plant has years of sensor history from its utility equipment — screw compressors, air compressors and nitrogen plants — and no labelled failures. SenseMinds 360, built at AISmartLive Solutions for a pharmaceutical manufacturer, turns that history, plus a live 30-second feed, into findings an engineer can trust and act on.",
        "Entered as “Predictive Protection”, SenseMinds 360 received third prize at an Andhra Pradesh hackathon, with me as team lead.",
      ],
      challenge: [
        "With zero labelled failures, a supervised model cannot be validated, so its false-alarm rate is unknowable — and an alarm nobody can trust trains operators to ignore the system.",
        "The platform still had to catch real breaches within seconds, explain every alert down to the reading and the limit behind it, and let an LLM answer questions without ever inventing a fact.",
      ],
      role: [
        "Technical lead of the 12-member team at AISmartLive Solutions. I designed the architecture (19 recorded decisions) and the code — ingestion, the seven engines, findings, rules, knowledge graph, pattern learning, forecasting, the grounded LLM layer, alerting and the React dashboard with a 3D view of each machine.",
      ],
      architectureCaption:
        "Simplified from the platform's design records. Solid edges carry facts; dashed edges carry advisory signals. Client and machine details are omitted.",
      diagram: "senseminds",
      demo: {
        id: "health-rollup",
        title: "Roll up a machine's health",
        intro:
          "A port of the platform's health engine. Set each sensor's threshold state and how far its data can be trusted, and watch sensor scores roll up to subsystems and the machine. The machine and its sensors are representative, not client data.",
      },
      decisions: [
        {
          title: "Rules before machine learning",
          body: "Deterministic engines (statistics, thresholds, operating state, envelope, timeline, reliability, health) are authoritative and need no training data, so the platform is useful on day one. Delete the ML layer and every fact stays the same; it only stops noticing things nobody wrote a rule for.",
        },
        {
          title: "Findings are immutable facts",
          body: "Every alert, diagnosis and LLM sentence points at a finding: an append-only record that must carry evidence, enforced by a database trigger. Each analysis commits findings, graph, report and run record in one transaction, and re-running unchanged data is a no-op.",
        },
        {
          title: "ML is advisory and earns its place",
          body: "Isolation Forest flags windows unlike a machine's history and a Gaussian mixture finds its operating regimes; both report what drove them. A Holt-Winters forecaster replaces the seasonal-naive baseline only if it beats it by 5% in walk-forward backtests.",
        },
        {
          title: "The LLM narrates, a validator decides",
          body: "Every engineering claim must cite a finding id from the retrieved evidence. A validator mechanically drops any claim that does not, and an answer left with no supported claims becomes “insufficient evidence” instead of a guess.",
        },
        {
          title: "Record only what changed",
          body: "A naive 30-second loop re-recorded every condition on every tick. A material-change filter (new condition, new severity or wording, confidence moving more than 0.05, evidence moving more than 2%) means steady machines now write nothing.",
        },
      ],
      quality: {
        title: "Testing and auditability",
        body: [
          "The suite covers every engine, the findings contract, rules, the knowledge graph, forecasting, pattern learning, grounding and alerting. I ran it offline: 184 tests pass and the 78 that need PostgreSQL skip.",
          "Engine outputs are parity-tested so results are identical whether data loads from CSV or from TimescaleDB, and safety-limit breaches escalate by email with a reminder if nobody acts and a closing note when they clear.",
        ],
      },
      results: [
        { value: "≈2.86M", label: "historical readings across six machines, plus a live 30-second feed", source: "codebase" },
        { value: "~2,500/h → 0", label: "finding rows written for steady machines after the material-change filter", source: "codebase" },
        { value: "184", label: "automated tests passing offline (database suites skipped)", source: "codebase" },
        { value: "19", label: "architecture decision records", source: "codebase" },
        { value: "3rd prize", label: "“Predictive Protection”, Andhra Pradesh hackathon (team lead)", source: "email" },
      ],
      resultsNote: "The repository is private because it names the client and its machines; figures are read from its code, tests and design records.",
      lessons: [
        "When there are no labels, make the trustworthy part deterministic and keep learning advisory. Trust comes from explaining every alarm, not from a confidence score.",
        "An LLM is safe to put in front of engineers only when something other than the model checks what it says.",
      ],
      next: [
        "A streaming OPC-UA / MQTT adapter behind the existing ingestion interface.",
        "Supervised models once engineer verdicts have built up enough labelled events.",
      ],
    },
  },
  {
    slug: "financial-agents",
    index: "03",
    title: "Multi-Agent Financial Analytics",
    category: "Agentic AI · Text-to-SQL",
    kind: "Independent project · public repo",
    period: "2026",
    role: "Designed and built",
    summary:
      "Plain-English financial questions run through a LangGraph state machine: detect intent, extract entities, write SQL, validate it, execute it and synthesise an answer over a seven-table PostgreSQL schema.",
    tagline: "Text-to-SQL that is not allowed to drop your tables.",
    domains: ["LangGraph", "Text-to-SQL", "Guardrails"],
    stack: ["Python", "LangGraph", "LangChain", "Gemini 2.0 Flash", "PostgreSQL", "SQLAlchemy", "Streamlit", "Plotly"],
    highlights: [
      { value: "8", label: "families of dangerous SQL blocked before execution", source: "repo" },
      { value: "5", label: "graph stages, each with an explicit failure route", source: "repo" },
    ],
    links: [{ label: "Source code", href: "https://github.com/Sreecharan03/Realtime-financial-langgraph", kind: "repo" }],
    accent: "verify",
    visibility: "public",
    caseStudy: {
      context: [
        "Financial data lives in relational tables; the questions people ask do not. This system turns a question like “How is Apple performing compared to Microsoft?” into SQL over stocks, prices, technical indicators, risk metrics, news and sentiment, then into an answer with insights, risk warnings and a confidence level.",
      ],
      challenge: [
        "An LLM that writes SQL is an LLM with database access. The system has to generate correct queries across a multi-table schema and guarantee that nothing destructive or injected ever executes.",
      ],
      role: [
        "Designed and built the LangGraph workflow, the complexity-adaptive SQL generator, the guarded executor, the response formatter and the Streamlit interface.",
      ],
      architectureCaption:
        "The LangGraph state machine as implemented in workflow.py. Every stage routes failures to one error handler.",
      diagram: "financial",
      demo: {
        id: "sql-guard",
        title: "Try the guard",
        intro:
          "This panel runs a JavaScript port of the repository's SecurityValidator against any SQL you type. It applies the same blocked patterns, read-only rule and table allow-list as query_executor.py.",
      },
      decisions: [
        {
          title: "Make the workflow a state machine",
          body: "Each stage is a LangGraph node with a conditional edge: success moves forward, any failure routes to a single error handler that explains what went wrong. No stage can pass bad state downstream.",
        },
        {
          title: "Validate before execution, never after",
          body: "The SecurityValidator rejects eight families of dangerous patterns — stacked writes, UNION injection, comments, EXEC, timing attacks and file access — permits only read-only statements, and flags tables outside an allow-list.",
        },
        {
          title: "Match the strategy to the question",
          body: "The generator classifies each query as simple, moderate, complex or advanced and changes approach: direct patterns, few-shot examples, step-by-step construction or a simulated multi-agent review. A second LLM pass reviews syntax and join logic.",
        },
        {
          title: "Cache by cost",
          body: "Successful results are cached with a TTL that grows with complexity — five minutes for simple lookups, thirty for advanced analytics, capped at an hour — and every execution runs under a 30-second timeout.",
        },
      ],
      quality: {
        title: "Guardrails in code",
        body: [
          "Safety does not depend on the prompt. Deterministic validation runs on every generated query before it reaches PostgreSQL, and the executor tracks execution time and row counts for each run.",
        ],
      },
      results: [
        { value: "7", label: "tables in the financial schema, from prices to sentiment", source: "repo" },
        { value: "4", label: "complexity tiers, each with its own generation strategy", source: "repo" },
        { value: "8", label: "blocked SQL pattern families, plus a read-only rule", source: "repo" },
        { value: "30 s", label: "execution timeout; 5–30 min cache TTL by complexity", source: "repo" },
      ],
      resultsNote: "All figures above are read from the public source code.",
      lessons: [
        "Generated code deserves the same treatment as user input: validate it at the boundary, every time.",
      ],
      next: [
        "Build an evaluation set of question-to-SQL pairs and measure accuracy per complexity tier.",
        "Move from pattern matching to parsing the SQL syntax tree for stricter validation.",
      ],
    },
  },
  {
    slug: "agentic-rag",
    index: "04",
    title: "Agentic RAG Study Assistant",
    category: "Agentic AI · Retrieval",
    kind: "Independent project · public repo",
    period: "2026",
    role: "Designed and built",
    summary:
      "Four agents answer questions over textbook PDFs: one routes and rewrites the query, one retrieves from Qdrant, one answers from the retrieved context only, and one scores the answer before it is returned.",
    tagline: "An answer is not finished until something has checked it.",
    domains: ["RAG", "Multi-agent", "Verification"],
    stack: ["Python", "Qdrant", "BGE-large-en-v1.5", "Gemma-2-9B-IT", "PyMuPDF", "pdfplumber", "NLTK", "Streamlit"],
    highlights: [
      { value: "4", label: "agents: understand, retrieve, generate, verify", source: "repo" },
      { value: "0.4 · 0.4 · 0.2", label: "confidence weights: retrieval, overlap, non-refusal", source: "repo" },
    ],
    links: [{ label: "Source code", href: "https://github.com/Sreecharan03/Agentic-RAG", kind: "repo" }],
    accent: "verify",
    visibility: "public",
    caseStudy: {
      context: [
        "Students ask textbook questions in DBMS, machine learning and operating systems. A basic RAG app retrieves a few chunks and hopes the model stays on them. This assistant splits the job across four agents with explicit responsibilities.",
      ],
      challenge: [
        "Retrieval quality depends on the query. Answer quality depends on staying inside the retrieved context. And the reader deserves to know when the system is unsure.",
      ],
      role: [
        "Designed and built the ingestion pipeline, the four agents, the orchestrator and a Streamlit app whose upload tab extracts, chunks, embeds and indexes new PDFs.",
      ],
      architectureCaption: "Two lanes from the repository: ingestion (top) and question answering (bottom).",
      diagram: "rag",
      demo: {
        id: "rag-lab",
        title: "Inside two of the agents",
        intro:
          "The router below uses the same subject keywords and question types as QueryUnderstandingAgent. The confidence panel uses the same weights and thresholds as VerificationAgent. Both run locally in your browser.",
      },
      decisions: [
        {
          title: "Route before you retrieve",
          body: "Keyword scoring picks the subject, a pattern match picks the question type, and the query is rewritten as “SUBJECT concept: question” before retrieval filters Qdrant by subject.",
        },
        {
          title: "Constrain generation",
          body: "Gemma-2-9B runs at temperature 0.2 with at most 512 new tokens, and its prompt restricts answers to the retrieved chunks.",
        },
        {
          title: "Score every answer",
          body: "Confidence = 0.4 × mean retrieval score + 0.4 × answer-to-context keyword overlap + 0.2 × non-refusal. At 0.7 or above an answer is high confidence; at 0.5 or above, medium.",
        },
        {
          title: "Chunk for meaning, not just size",
          body: "Sentence-aware chunks of about 500 words with a 100-word overlap keep definitions and their explanations together across chunk boundaries.",
        },
      ],
      quality: {
        title: "Confidence you can read",
        body: [
          "Every answer returns its sources, a numeric confidence and a verdict. The score is deliberately simple: each term can be explained, and each can be improved independently.",
        ],
      },
      results: [
        { value: "Top 5", label: "chunks retrieved per query, filtered by subject", source: "repo" },
        { value: "1,024-d", label: "BGE-large embeddings indexed in Qdrant", source: "repo" },
        { value: "500 / 100", label: "words per chunk / words of overlap", source: "repo" },
        { value: "≥ 0.7", label: "confidence for a high-confidence verdict", source: "repo" },
      ],
      resultsNote: "All figures above are read from the public source code.",
      lessons: [
        "A transparent confidence score is more useful than an opaque one: it is easy to explain to a user and easy to improve one term at a time.",
      ],
      next: [
        "Replace keyword routing with a learned classifier.",
        "Measure retrieval recall on a labelled question set and add reranking.",
      ],
    },
  },
  {
    slug: "legal-summarization",
    index: "05",
    title: "Legal Document Summarization",
    category: "LLM fine-tuning · Research",
    kind: "Academic project · published",
    period: "Published Mar 2025",
    role: "Co-developer · co-author (2nd of 5)",
    summary:
      "Two-stage instruction fine-tuning of small language models — TinyLLaMA 1.1B, then Gemma 2-2B — for legal summaries. Co-developed and published in IJIRT in March 2025.",
    tagline: "Small models, legal language, and a hybrid that knows when to quote and when to paraphrase.",
    domains: ["PEFT / LoRA", "Summarization", "Evaluation"],
    stack: ["Hugging Face Transformers", "PEFT · LoRA", "bitsandbytes (4-bit)", "TinyLLaMA 1.1B", "Gemma 2-2B", "Databricks", "llama.cpp"],
    highlights: [
      { value: "IJIRT", label: "Vol. 11, Issue 10 · March 2025 · co-author", source: "publication" },
      { value: "r = 8", label: "LoRA rank on 4-bit base weights, 1,024-token inputs", source: "repo" },
    ],
    links: [
      {
        label: "Paper (PDF)",
        href: "https://github.com/Sreecharan03/Summarization-with-a-Custom-Fine-Tuned-LLaMA-AND-GEMMA-Models-via-Instruction-Based-Training/blob/main/IJIRT174041_PAPER.pdf",
        kind: "paper",
      },
      {
        label: "Source code",
        href: "https://github.com/Sreecharan03/Summarization-with-a-Custom-Fine-Tuned-LLaMA-AND-GEMMA-Models-via-Instruction-Based-Training",
        kind: "repo",
      },
    ],
    accent: "verify",
    visibility: "public",
    caseStudy: {
      context: [
        "Legal documents are long and dense with terminology, and a summary that drops a clause can change what it says. Generic summarisers struggle with both. This project, a team effort at Raghu Engineering College, adapts small language models to legal text.",
      ],
      challenge: [
        "Adapt models small enough to train on modest hardware to legal language, and decide when a summary should preserve wording verbatim and when it should paraphrase.",
      ],
      role: [
        "Co-developer of the system and co-author of the published paper, second of five authors.",
      ],
      architectureCaption: "Pipeline as described in the paper and repository notebooks.",
      diagram: "legal",
      demo: {
        id: "training-card",
        title: "Training configuration",
        intro: "The fine-tuning setup as committed in the repository, alongside the evaluation the paper and notebooks report.",
      },
      decisions: [
        {
          title: "Two stages, two models",
          body: "TinyLLaMA 1.1B is instruction-tuned first for fast domain adaptation; Gemma 2-2B is fine-tuned second to improve fluency and abstractive quality where the first stage was weakest.",
        },
        {
          title: "Parameter-efficient by necessity",
          body: "Base weights load in 4-bit; LoRA adapters (rank 8, alpha 32, dropout 0.05) train only the query and value projections, which makes 1,024-token legal inputs practical on limited GPUs.",
        },
        {
          title: "Hybrid output",
          body: "Clause-heavy text such as contracts and regulations favours extractive output that keeps wording verbatim; narrative case law favours abstractive summaries.",
        },
        {
          title: "Instruction-shaped data",
          body: "Legal corpus records were converted to instruction, context and response JSONL so the models learn the task framing, not just the domain vocabulary.",
        },
      ],
      quality: {
        title: "Evaluation",
        body: [
          "The paper compares the hybrid pipeline with TextRank, BERTSUM and legal-specific transformers using ROUGE, BLEU and METEOR. A notebook in the repository also scores one sample case.",
          "Those sample-case scores come from a single reference summary. They demonstrate the evaluation, not a benchmark.",
        ],
      },
      results: [
        { value: "0.5916", label: "ROUGE-1 on a sample case", source: "repo" },
        { value: "0.3819", label: "ROUGE-2 on a sample case", source: "repo" },
        { value: "0.4373", label: "ROUGE-L on a sample case", source: "repo" },
        { value: "0.8449", label: "TF-IDF cosine similarity on a sample case", source: "repo" },
      ],
      resultsNote: "Sample-case scores from the repository's evaluation notebook (single example).",
      lessons: [
        "Evaluation needs a held-out test set, not a showcase example. That is the first thing I would add today.",
      ],
      next: [
        "Evaluate on a held-out test set with per-category ROUGE and a human review of clause preservation.",
      ],
    },
  },
  {
    slug: "smart-traffic",
    index: "06",
    title: "Adaptive Traffic Signal Control",
    category: "Computer vision · Control",
    kind: "Independent project · public repo",
    period: "2026",
    role: "Designed and built",
    summary:
      "YOLOv8 and ByteTrack count vehicles per approach in junction video; a controller turns those counts into phase order and green time, with a fairness term that stops any approach from starving.",
    tagline: "Green time that follows demand, with a fairness term so no approach waits forever.",
    domains: ["Object detection", "Tracking", "Control logic"],
    stack: ["Python", "YOLOv8 (Ultralytics)", "ByteTrack · supervision", "OpenCV", "NumPy", "Streamlit"],
    highlights: [
      { value: "0.6 · 0.3 · 0.1", label: "priority weights: vehicles, waiting time, fairness", source: "repo" },
      { value: "15–60 s", label: "bounded adaptive green time", source: "repo" },
    ],
    links: [{ label: "Source code", href: "https://github.com/Sreecharan03/Smart-traffic-management-opencv", kind: "repo" }],
    accent: "signal",
    visibility: "public",
    caseStudy: {
      context: [
        "Fixed-time signals give every direction the same green regardless of the queue in front of them. This system reads junction video and adapts the signal plan to the traffic it sees.",
      ],
      challenge: [
        "Count vehicles per approach without counting the same vehicle twice, then allocate green time efficiently while guaranteeing that every approach is eventually served.",
      ],
      role: ["Designed and built the detection pipeline, the signal controller and the Streamlit dashboard."],
      architectureCaption: "Processing pipeline as implemented. Input is uploaded junction video.",
      diagram: "traffic",
      demo: {
        id: "junction-sandbox",
        title: "Junction sandbox",
        intro:
          "Set queues and waiting times for each approach. The controller logic is a direct port of signal_controller.py and config.py: the same weights, bounds and smoothing.",
      },
      decisions: [
        {
          title: "Track, then count",
          body: "ByteTrack assigns persistent IDs. A vehicle is counted once, when it enters a zone on red, and the zone's count resets when its phase turns green.",
        },
        {
          title: "Start fixed, then adapt",
          body: "The first 30 seconds run a fixed 25-second plan to stabilise counts; after that the controller switches to adaptive phase selection.",
        },
        {
          title: "Fairness as a first-class term",
          body: "Priority = 0.6 × vehicles + 0.3 × waiting seconds + 0.1 × seconds since last green. The last term grows until even an approach with a short queue is served.",
        },
        {
          title: "Bound everything",
          body: "Green time starts at 15 s plus 2 s per queued vehicle, is smoothed 70/30 against the fixed 25 s plan and clamped to 15–60 s. A phase can end early once its queue is empty and the minimum has passed.",
        },
      ],
      quality: {
        title: "Scope, stated plainly",
        body: [
          "The system processes uploaded video files (MP4, AVI, MOV, MKV, or a Drive link) and does not yet take a live camera stream. A measured comparison against fixed timing is the next step, so no improvement figure is claimed here.",
        ],
      },
      results: [
        { value: "3", label: "vehicle classes detected: bike, bus, car", source: "repo" },
        { value: "4", label: "polygon zones with entry-only counting", source: "repo" },
        { value: "30 s", label: "fixed baseline before adaptive control", source: "repo" },
        { value: "15–60 s", label: "green-time bounds, smoothed against a 25 s plan", source: "repo" },
      ],
      resultsNote: "All figures above are read from the public source code.",
      lessons: [
        "Control logic needs guard rails as much as models do: minimums, maximums and a fairness term make adaptive behaviour safe to deploy.",
      ],
      next: ["Accept live camera streams.", "Measure waiting time against a fixed-time baseline on recorded junction video."],
    },
  },
];

export const alsoBuilt = [
  {
    title: "Résumé Analyzer & Job Search Agent",
    summary:
      "An eight-node LangGraph pipeline that parses a résumé, searches Adzuna listings, scores fit (40% semantic similarity, 35% skill match, 25% experience), drafts tailored materials and stops at a human approval gate.",
    stack: ["LangGraph", "Groq · Llama 3.3 70B", "MiniLM", "Adzuna API", "Streamlit"],
    href: "https://github.com/Sreecharan03/Resume-analzyer-Job-search-Agent-Langgraph",
  },
];

export function publicProjects(): Project[] {
  return projects.filter((p) => p.visibility === "public");
}

export function getProject(slug: string): Project | undefined {
  return publicProjects().find((p) => p.slug === slug);
}
