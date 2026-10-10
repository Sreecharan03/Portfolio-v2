/**
 * Capabilities are grouped by what they let me build, and each one names the
 * work that demonstrates it. No percentages, no self-ratings.
 */

export interface Capability {
  id: string;
  title: string;
  short: string;
  summary: string;
  tools: string[];
  evidence: { label: string; slug?: string; note: string }[];
}

export const capabilities: Capability[] = [
  {
    id: "agents",
    title: "Agentic AI & LLM systems",
    short: "Agents",
    summary:
      "Multi-step LLM workflows with explicit state, routing and failure handling: LangGraph state machines, Text-to-SQL, tool-style stages and structured outputs.",
    tools: ["LangGraph", "LangChain", "Structured outputs", "Text-to-SQL", "Groq", "Gemini", "Claude", "Prompt design"],
    evidence: [
      { label: "Multi-Agent Financial Analytics", slug: "financial-agents", note: "Five-stage LangGraph state machine with error routing" },
      { label: "Agentic RAG Study Assistant", slug: "agentic-rag", note: "Four cooperating agents with a verifier" },
      { label: "Sighnal", slug: "sighnal", note: "LLM classification and grounded chat at scale" },
    ],
  },
  {
    id: "grounding",
    title: "Retrieval & grounding",
    short: "Grounding",
    summary:
      "Getting answers to stay tied to evidence: chunking, embeddings, filtered vector search, citation checks and confidence scoring.",
    tools: ["Qdrant", "BGE embeddings", "MiniLM", "Sentence-aware chunking", "Metadata filtering", "Citation verification", "Confidence scoring"],
    evidence: [
      { label: "Agentic RAG Study Assistant", slug: "agentic-rag", note: "Subject-filtered Qdrant retrieval and a scored verdict" },
      { label: "Sighnal", slug: "sighnal", note: "Claims checked against stored evidence in code" },
      { label: "AAYS Advisory", note: "FastAPI RAG microservice for knowledge transfer" },
    ],
  },
  {
    id: "ml",
    title: "Applied ML & NLP",
    short: "Applied ML",
    summary:
      "Models chosen for the data and the decision: anomaly detection, gradient boosting, forecasting, topic modelling and parameter-efficient fine-tuning, with explanations.",
    tools: ["XGBoost", "Isolation Forest", "NeuralProphet", "SHAP", "BERTopic", "UMAP", "HDBSCAN", "PEFT · LoRA", "ROUGE"],
    evidence: [
      { label: "SenseMinds 360", slug: "senseminds-360", note: "Explained anomaly detection on industrial telemetry" },
      { label: "Legal Document Summarization", slug: "legal-summarization", note: "Two-stage LoRA fine-tuning, published" },
      { label: "Sighnal", slug: "sighnal", note: "BERTopic over classified comments" },
    ],
  },
  {
    id: "backend",
    title: "Backend & distributed systems",
    short: "Backend",
    summary:
      "Services that keep working under load and failure: task queues, rate control, circuit breakers, resumable jobs, authentication and access control.",
    tools: ["Python", "FastAPI", "Flask", "Celery", "Redis", "MongoDB", "JWT · argon2", "RBAC", "Docker Compose"],
    evidence: [
      { label: "Sighnal", slug: "sighnal", note: "Four-queue fabric, AIMD, breaker, watchdog, 300+ tests" },
      { label: "AAYS Advisory", note: "Containerised services pushed to ACR and ECR" },
    ],
  },
  {
    id: "data",
    title: "Data engineering",
    short: "Data",
    summary:
      "Pipelines that move and shape data reliably: automated ingestion on Databricks, streaming telemetry and relational modelling.",
    tools: ["Azure Databricks", "PySpark", "Automated jobs", "MQTT", "InfluxDB", "PostgreSQL", "SQL"],
    evidence: [
      { label: "TCS Digital", note: "Automated ingestion, 100K–1M records per run, ~20% faster" },
      { label: "SenseMinds 360", slug: "senseminds-360", note: "30-sensor MQTT → InfluxDB telemetry" },
      { label: "Multi-Agent Financial Analytics", slug: "financial-agents", note: "Seven-table analytical schema" },
    ],
  },
  {
    id: "vision",
    title: "Computer vision",
    short: "Vision",
    summary: "Detection and tracking turned into decisions: per-zone counting and control logic on video.",
    tools: ["YOLOv8", "ByteTrack", "supervision", "OpenCV", "Polygon zones"],
    evidence: [
      { label: "Adaptive Traffic Signal Control", slug: "smart-traffic", note: "Tracked counts drive a fairness-aware controller" },
    ],
  },
];

export const alsoComfortableWith = [
  "TypeScript and Next.js front ends (Sighnal)",
  "Streamlit dashboards",
  "Docker images for ACR and ECR",
  "Java and C for problem solving",
];
