# CHARAN (SREE CHARAN CHINTALAPUDI): TECHNICAL KNOWLEDGE BASE
Built 7 Oct 2026 from past chats, resume drafts and saved notes. Evidence-first, not flattering.

**Confidence labels:** CONFIRMED (you stated it or it is in a document you supplied) / STRONG (visible in code, debugging or detailed design discussion) / INFERRED / UNCERTAIN.

## 0. SCOPE, EXCLUSIONS AND LIMITS

- **Excluded entirely (not yours):** all BITS Pilani graduate/PhD material: V2O5, SnO, CrSb, LaVO3, DFT, Quantum ESPRESSO, ABINIT, Phoebe, Octopus, SLURM/HPC debugging, manuscript/LaTeX bibliography work, phonons. None of it is used for any skill, project or achievement below.
- **Not attributed to you (client or third-party work, or unclear owner):** M.Tech topic work for others (TraceGuard, KrishiVerify, air-quality auditor, VoterLens/GITAM, the "top 3 M.Tech projects" doc). I can only see you ordering and reviewing it, so I treat it as a service you run, not as your research. The GNN source-detection M.Tech note is **UNCERTAIN** in ownership; it is excluded from skills.
- **Not examined:** about 80 named project workspaces (fraud detection, deepfake, medical AI, traffic, OCR, etc.). I only have their names. Most look like Codex catalog or client builds. None are counted as your demonstrated work. A second pass opening each one would be needed.
- **Evidence base:** about 20 chats from Jun to Oct 2026, three resume versions, one early-2025 competitive-programming chat pair.

## 1. IDENTITY SNAPSHOT (CONFIRMED unless stated)

| Item | Detail |
|---|---|
| Name | SREE CHARAN CHINTALAPUDI (goes by Charan / "Coder op"); GitHub `Sreecharan03`; portfolio sreecharanv2.vercel.app |
| Education | B.Tech Data Science, Raghu Engineering College, Visakhapatnam, Oct 2021 to May 2025, CGPA 8.8/10. You call it tier-3. |
| Current job | Data Engineer, TCS Digital, since Dec 2025 |
| Side work | Freelance AI/backend on Sighnal (2026 to present); Team Lead of Codex Free Lancers |
| Target | AI/GenAI/Agentic AI/ML Engineer roles, product companies, 0 to 2 YOE; 60-day notice; active Commvault SWE (AI with GenAI) referral application |
| Style | Wants plain language first, concise output, honest resume wording, ready-to-use deliverables, and pushes back on unverified claims |

## 2. PROJECT-BY-PROJECT EXTRACTION

### P1. Sighnal (freelance client project, YouTube comment analytics / AI content strategist)
- **Type:** Freelance, production-style full-stack GenAI platform. **Period:** 2026 to present. **Status:** active.
- **Described architecture:** Innertube-based scraping (10K+ comment threads/video, resumable jobs); Celery + Redis + MongoDB with 4 queues, per-video fan-out, distributed lock, concurrency gates, self-healing watchdog (10 failure modes); LLM intent/sentiment classification (gpt-oss-120b on Groq) with dynamic batching, SimHash dedup, TTL-LRU cache, AIMD rate control, circuit breaker; BERTopic (UMAP + HDBSCAN + MiniLM); Claude Haiku summaries; grounded chatbot where the LLM proposes claims and code verifies citations against evidence; JWT (argon2), RBAC, plan-tier enforcement, audit logging; Docker Compose; Next.js/TypeScript/TanStack Query frontend; 286-test classifier suite, 33-test resilience suite, 300+ tests total.
- **Reported results (from your resume text):** a 12,910-comment run went from 574 permanently failed comments to 0; a README-related measurement of 15% to 52%.
- **Level:** Advanced implementation, production-style. **Evidence:** STRONG (detailed resume bullets and design discussion). **Caveat:** UNCERTAIN how much of each layer (frontend, auth, infra) you personally wrote versus the wider client team; the product name is client-owned, so confirm permission before naming it.
- **Skills shown:** async/distributed task design, LLM reliability engineering, hallucination control, SaaS security basics, testing.

### P2. SenseMinds 360 (AISmartLive Solutions, industrial IoT anomaly detection)
- **Type:** Professional (job), Mar to Dec 2025, Junior Data Scientist. Related workspaces exist (oxygen towers, SenseMinds home), contents not opened.
- **Described:** MQTT to InfluxDB, 30 sensors, 15-second resolution, 172,800 datapoints/day; XGBoost + Isolation Forest predictive maintenance; SHAP explainability; 92% detection accuracy; investigation time 8 h to 1 h (87.5%); failures flagged 6 to 8 h early; you were technical lead of a 12-member team.
- **Level:** Intermediate to Advanced applied ML; production deployment at an actual client. **Evidence:** CONFIRMED (your resume claims) but numbers are self-reported with no baseline or evaluation protocol visible in chats. Be ready to explain what "92% accuracy" means (precision/recall, class balance, labels).
- **Side evidence:** you reviewed the SenseMinds360 requirements/solution proposal (Laurus Labs gas analyzers). Your exact role in that document is UNCERTAIN.

### P3. Real-Time / Multi-Agent Financial Analytics Platform
- **Type:** Personal portfolio project (GitHub: Realtime-financial-langgraph). **Stack:** LangGraph, Gemini, PostgreSQL, Streamlit.
- **Described:** 5-stage workflow (intent, entities, Text-to-SQL, validation, synthesis) over 7 financial tables, SQL-injection and destructive-query guards, TTL caching, conversation context.
- **Level:** Intermediate to Advanced implementation, prototype (not production-deployed as far as shown). **Evidence:** CONFIRMED (resume, repo link). "Sub-second retrieval" appears in one resume draft with no measurement I can see.

### P4. Legal Document Summarization (LLM fine-tuning)
- **Type:** Academic/research prototype, co-developed; **published in IJIRT, Mar 2025**.
- **Described:** two-stage PEFT/LoRA pipeline (TinyLLaMA 1.1B then Gemma 2-2B), hybrid extractive/abstractive; 4-bit loading, rank-8 LoRA, 1,024-token inputs, 3 epochs; ROUGE-L 0.4373, cosine similarity 0.8449, beats TextRank and BERTSUM; Databricks used for training.
- **Level:** Intermediate. "Co-developed" is the accurate word; keep it. IJIRT is a low-tier journal; recruiters in research-heavy roles may discount it.

### P5. AAYS Analytics client engagement (Jun to Aug 2025)
- Containerised Langflow, pushed to Azure Container Registry and AWS ECR; FastAPI RAG microservice for a knowledge-transfer platform; migrated Aadi FinTech dashboards from Plotly to ECharts/AmCharts. **Level:** Intermediate. **Conflict:** dates overlap AISmartLive (Mar to Dec 2025); needs a one-line explanation (part-time/contract?) before interviews.

### P6. Codex Free Lancers (business/catalog)
- You lead a team (Gowtham, Pavan Kumar, Sanchit, Koushik) selling final-year B.Tech projects. Catalog built with you: 300 projects across 7 domains (ML, DL, OpenCV, GenAI, AI Agents, Custom LLMs, Full Stack + AI), priced about ₹5,000 to ₹30,000, delivered as DOCX/PDF. You also run research-idea vetting for client M.Tech theses (existence checks, novelty audits). **Value:** leadership, scoping, product packaging. **Risk:** recruiters or background checks may question "selling projects/theses"; describe it as project mentoring and freelance delivery, not ghost-writing.

### P7. Smaller or learning items
| Item | What it shows | Level |
|---|---|---|
| Auth API deploy (Express + TS + JWT + Postgres on Render/Neon) | You deployed a friend's code with heavy guidance; needed explanations for env vars, CSP, Neon; shared a DB URL and secret in chat | Beginner/Working (deployment) |
| PySpark/Databricks teaching notebook (Jun 2026, Lightning AI) | You specified a structured curriculum: skew (62.5% skewed key), salting, narrow vs wide, repartition vs coalesce, lazy eval, Delta vacuum/checkpoints, Auto Loader and Unity Catalog simulated locally | Working knowledge; self-study, not production |
| AI Job Apply-Assist Agent (LangGraph, Groq LLaMA 3.3 70B, SBERT fit scoring, Adzuna, Streamlit; B.Tech report) | Matches your stack, but the chat names roll no. 22A91A6715 and is dated Mar 2026, after your stated May 2025 graduation | **UNCERTAIN ownership**, not counted |
| Resume engineering (LaTeX, ATS tuning, one-page fit) | Strong iterative editing, accurate-wording discipline | n/a |

## 3. SKILLS MATRIX

Levels: 0 Awareness, 1 Beginner, 2 Working, 3 Intermediate, 4 Advanced, 5 Expert.

| Skill | Category | Evidence | Level | Confidence |
|---|---|---|---|---|
| Python | Language | Every project, ML, FastAPI, scripts | 3.5 (4 for ML/LLM code) | High |
| SQL | Language/DB | Text-to-SQL, Postgres, SQL Server on resume | 3 | Medium (no query-optimisation evidence) |
| Java, C | Language | Resume only | 2 | Low |
| TypeScript/Next.js | Language/FE | Sighnal frontend, auth API | 2 to 3 | Medium (authorship unclear) |
| Competitive programming (algorithms) | DSA | CodeChef 3-star 1651, LeetCode Knight top 4%, 500+ solved, CodeVita S12 rank about 5K (self-reported) | 3.5 | Medium |
| XGBoost / Isolation Forest / SHAP | Classical ML | SenseMinds 360 | 3.5 | Medium |
| Time-series (NeuralProphet) | ML | Resume only | 2 | Low |
| LLM apps / prompting / structured outputs | GenAI | Sighnal classifier, financial agent | 4 | High |
| LangGraph / multi-agent | GenAI | Financial platform, Sighnal planner, job agent | 3.5 | High |
| RAG + vector DBs (Weaviate, Astra DB, Azure AI Search) | GenAI | AAYS RAG; the specific vector DBs are resume-only | 3 | Medium |
| PEFT / LoRA fine-tuning | GenAI | Legal summarization | 3 | Medium |
| LLM evaluation / hallucination control | GenAI | Sighnal evidence-verification design, test suites | 3.5 | Medium to High |
| NLP clustering (BERTopic/UMAP/HDBSCAN) | NLP | Sighnal | 3 | Medium |
| Computer vision (YOLOv8, ByteTrack, OpenCV, PaddleOCR) | CV | Resume only; no project in chats | 2 | Low |
| FastAPI / Flask / Streamlit | Backend | AAYS, financial platform | 3 | Medium to High |
| Celery / Redis / MongoDB | Backend | Sighnal | 3 | Medium |
| Auth (JWT, RBAC, argon2) | Security | Sighnal | 3 | Medium |
| Docker | DevOps | AAYS, Sighnal Compose | 3 | Medium |
| Azure Container Registry / AWS ECR | Cloud | One task at AAYS | 2 | Medium |
| Azure Databricks / PySpark / Delta | Data Eng | TCS KT + workshop, self-built notebook | 2 to 2.5 | Medium (no production pipeline owned) |
| InfluxDB / MQTT | Data/IoT | SenseMinds 360 | 3 | Medium |
| PostgreSQL / MySQL | DB | Projects | 3 | Medium |
| Git/GitHub | SE | Repos, pushes | 3 | Medium |
| Testing | SE | Sighnal suites | 3 | Medium |
| System design (HLD/LLD) | SE | TCS Special Initiative Award; Sighnal | 3 | Medium |
| CI/CD, Kubernetes, Terraform, Airflow/orchestration | MLOps | No evidence | 0 to 1 | n/a |
| GPU training, distributed training, quantization/serving | ML infra | 4-bit LoRA loading only | 1 to 2 | Medium |

### Four-way classification
- **A. Demonstrated:** LLM classification pipelines; LangGraph agents; Text-to-SQL with guardrails; PEFT/LoRA fine-tune; XGBoost/Isolation Forest + SHAP on IoT; FastAPI services; Docker; Celery/Redis queues; JWT/RBAC; BERTopic; resume/ATS LaTeX work; Excel-free document tooling for catalogs.
- **B. Strong working knowledge:** Spark internals (skew, salting, lazy eval), Delta Lake concepts, RAG design, hallucination-control patterns.
- **C. Exposure:** Databricks Unity Catalog/Auto Loader (simulated), Render/Neon deployment, ECR/ACR, Langflow.
- **D. Claimed, unverified:** YOLOv8/ByteTrack/PaddleOCR, Weaviate/Astra DB specifics, NeuralProphet, "LLMOps," "Multimodal AI," Java/C depth, "top 0.5% globally," "architected multi-stage ETL pipelines at TCS."

## 4. DATA ENGINEERING PROFILE

- **Real situation (your own words, Jun 2026):** at TCS you went through KT sessions, learned to draw/architect pipelines, and had hands-on Databricks time in a TCS workshop; you had **not** built a production ETL pipeline. One Aug 2026 resume draft says "Architected multi-stage distributed ETL pipelines" at TCS. **CONFLICT:** I cannot see anything after June that confirms you built them. Keep the resume at what you can defend in a technical interview, or confirm what you have built since.
- **Level:** Working knowledge (2 to 2.5). You understand skew, partitioning, salting, Delta and streaming concepts, but there is no evidence of owning a scheduled production pipeline, data-quality framework, orchestration (ADF/Airflow/Workflows), cost tuning or incident handling.
- **Closest real data-engineering evidence:** SenseMinds ingestion (MQTT to InfluxDB at 172,800 points/day) and Sighnal's ingestion/queue design.

## 5. AI/ML ENGINEERING PROFILE

| Area | Practical evidence | Level | Missing |
|---|---|---|---|
| Python | Broad | 3.5 | Packaging, typing discipline |
| Preprocessing/classical ML | SenseMinds | 3.5 | Experimental rigor, calibration, drift |
| Deep learning | LoRA only | 2 | From-scratch training, architectures |
| NLP | BERTopic, LLM classification | 3.5 | Classical eval metrics depth |
| Transformers/LLMs | Fine-tune, API orchestration | 3.5 | Internals, inference optimisation |
| RAG | AAYS, Sighnal | 3 | Reranking, hybrid search, eval benchmarks (no evidence) |
| Fine-tuning/PEFT | Legal summarizer | 3 | SFT/DPO, QLoRA at scale, ablations |
| Agents | LangGraph x3 | 3.5 to 4 | Agent evals, long-horizon reliability |
| Evaluation | Sighnal, ROUGE | 3 | Systematic LLM-eval frameworks |
| MLOps/deployment | Docker, ECR | 2 | Registry, monitoring, CI/CD |
| GPU/distributed | None | 1 | Multi-GPU, serving (vLLM etc.) |
| Time-series, CV | Resume only | 2 | Evidence |

## 6. ACHIEVEMENTS

| Achievement | Period | Org | Evidence | Note |
|---|---|---|---|---|
| Special Initiative Award (outperformed training cohort in HLD/LLD) | TCS Pune training, c. Dec 2025 to early 2026 | TCS | You stated it | Date not given |
| TCS AI Hackathon, Champion certificate | n/a | TCS | You stated it | Keep the certificate handy |
| TCS CodeVita Season 12, global rank about 5K | n/a | TCS | You stated it | Report as rank, not "top X%", unless you know the participant count |
| CodeChef 3-Star (1651); LeetCode Knight (top 4%); 500+ problems | n/a | Platforms | Resume | Resume summary says "top 0.5% globally"; the achievements line says "top 4%". **CONFLICT:** use one verifiable figure |
| RTGS AI, HackAP hackathons | n/a | n/a | Resume | Result/rank not captured |
| IJIRT publication (co-author) | Mar 2025 | IJIRT | Resume | Co-developed |
| Technical lead of 12-member team | 2025 | AISmartLive | Resume | Self-reported impact figures |

## 7. CODING / DSA PROFILE

- **Languages:** Python primary; Java, C listed.
- **Estimated level: Strong Intermediate** (self-reported ratings in the 1650 CodeChef and Knight LeetCode range, plus a CodeVita global rank in the thousands).
- **Chat evidence:** you bring hard problems to Claude (cactus-in-ladder-grid, rectangle-boundary counting) and ask it to "act like a top competitive programmer." That shows interest and problem sourcing but is **not** proof of solving ability, so the rating claims rest on your platform profiles. Expect interviewers to ask you to solve live.
- **Weaknesses (INFERRED):** advanced graph theory/DP at high-rating level, proof-of-complexity articulation under pressure.

## 8. PROJECT DEPTH RANKING

- **Tier S:** none (no research-grade or fully verified production system).
- **Tier A:** Sighnal; SenseMinds 360.
- **Tier B:** Financial multi-agent platform; Legal summarization fine-tune; AAYS RAG + Langflow deployment.
- **Tier C:** PySpark learning notebook; auth API deployment.
- **Tier D / idea-only:** none visible as yours; the M.Tech idea work belongs to clients.

## 9. TECHNICAL MATURITY

| Dimension | Assessment |
|---|---|
| Problem decomposition | Strong (agent stages, queue design) |
| Architecture | Good for GenAI systems; limited on data platforms |
| Debugging | Good on LLM pipelines; unknown on infra |
| Production thinking | Emerging: guardrails, retries, tests exist in Sighnal; deployment confidence is still low |
| Documentation | Strong (catalogs, reports, resumes) |
| Independence | Good; you scope your own work and push back on shallow answers |
| Learning speed | Fast: moved from IoT ML to agents to SaaS backend in about 18 months |
| **Overall** | **Early-career applied AI engineer, solid junior-to-mid in GenAI, junior in data engineering and infra** |

## 10. RESEARCH PROFILE

Your own research evidence is thin: one co-authored applied paper (summarization), ROUGE/cosine evaluation against TextRank and BERTSUM baselines. Your vetting of others' thesis ideas shows good research taste (existence checks, novelty audit, defensibility), but that is advisory work. **Classification: Applied builder with research awareness, not yet a research engineer.** No ablations, statistical testing or reproducibility packages are visible.

## 11. PROFESSIONAL EXPERIENCE

| Company | Role | Duration | Level of ownership | Evidence of impact |
|---|---|---|---|---|
| TCS Digital | Data Engineer | Dec 2025 to now | Learning/early (KT, workshop) | Award in training; no owned pipeline evidence |
| AISmartLive Solutions | Junior Data Scientist | Mar to Dec 2025 | High (tech lead of 12) | 92% accuracy, 8 h to 1 h, SHAP |
| AAYS Analytics | Data Science Contributor | Jun to Aug 2025 | Medium | Langflow images, RAG API, dashboard migration |
| Freelance (Sighnal) | AI/Backend engineer | 2026 to now | High on parts | Reliability and security work |

Resume issue: AISmartLive and AAYS overlap; and the summary headline says AI/GenAI Engineer while the TCS role is data engineering.

## 12. ROLE FIT

| Role | Fit /10 | Why | Missing | Readiness |
|---|---|---|---|---|
| GenAI/LLM Engineer | 7 | Sighnal, fine-tune, RAG | Eval frameworks, scale serving | Now |
| Agentic AI Engineer | 7.5 | 3 LangGraph systems, verification design | Agent evals | Now |
| AI Engineer (general) | 7 | Breadth | Deeper ML theory | Now |
| Software/Backend Engineer | 5.5 | Celery, auth, tests | System design at scale, more languages | 3 to 6 mo |
| ML Engineer | 5.5 | XGBoost, IoT | MLOps, deep learning | 6 mo |
| Data Engineer | 5 | Concepts + ingestion | Owned production pipelines, orchestration | 6 to 12 mo |
| MLOps/Platform | 3.5 | Docker only | K8s, CI/CD, monitoring | 12 mo+ |
| Research Engineer | 4 | One paper | Research record | 18 mo+ |
| Applied Scientist | 3 | Light math/stat evidence | Publications, theory | 2 yrs+ |

## 13. MARKET POSITIONING

- **Strongest identity:** "AI engineer building reliable, grounded LLM and agentic systems, with a data-engineering base and IoT ML background."
- **Best titles:** AI Engineer, GenAI Engineer, Agentic AI Engineer, Software Engineer (AI).
- **Recruiters will notice:** LangGraph, LLM reliability numbers (574 to 0), fine-tuning + paper, TCS awards, hackathon title.
- **Recruiters may question:** TCS data-engineering depth vs wording, overlapping dates, "top 0.5%" claim, unnamed client project, vector DB/CV claims with no project, tier-3 pedigree (mitigated by lateral hiring and projects).

## 14. TOP STRENGTHS (evidence-linked)

1. LLM reliability engineering (batching, retries, circuit breakers, dedup): Sighnal.
2. Hallucination control by code-verified citations: Sighnal chatbot.
3. Agent workflow design with validation stages and SQL guardrails: financial platform.
4. Applied anomaly detection with explainability: SenseMinds.
5. Ability to lead a team (12 people) on a client deliverable.
6. Distributed queue design (Celery/Redis/watchdog).
7. Security basics for SaaS (JWT, RBAC, argon2, audit logs).
8. Test discipline in at least one large project (300+ tests).
9. Fine-tuning pipeline with measured results and a publication.
10. Fast learning across domains.
11. Competitive-programming baseline.
12. Strong written output and documentation (catalogs, reports, resumes).
13. Product thinking: packaging services, pricing tiers.
14. Honest-resume instinct (you corrected inflated TCS bullets yourself).
15. Skeptical, pushes for verified answers.

## 15. WEAKNESSES AND GAPS

- No owned production data pipeline; TCS wording risk.
- Cloud depth is shallow (Azure/AWS registries only); no IaC, no orchestration, no monitoring stack.
- Deployment confidence low (Render/Neon needed step-by-step help; secrets pasted into chat; CSP unknown).
- No evidence of math/statistics depth, ML theory, or deep-learning training from scratch.
- CV, time-series and several vector-DB skills sit on the resume without a project behind them.
- Metrics (92%, 87.5%, "sub-second") lack visible evaluation protocols.
- System design for scale (sharding, backpressure, cost) not shown; Java/C not shown.
- No open-source contributions visible.
- Possible overestimation: "production-grade," "LLMOps," "architected pipelines."

## 16. WHAT YOU APPEAR TO BELIEVE VS WHAT IS EVIDENCED

| Area | Belief | Evidence | Assessment |
|---|---|---|---|
| Data Engineering | Strong DE profile (resume) | KT + workshop + self-study | Working level, not proven |
| Production GenAI | Production-grade | Sighnal design and tests | Credible, but scope per layer needs clarifying |
| CP rank | "Top 0.5%" | Top 4% on another line | Fix inconsistency |
| CV stack | YOLOv8/ByteTrack/PaddleOCR | No project | Unverified |
| Vector DBs | Weaviate/Astra/Azure AI Search | Not in chats | Unverified specifics |
| Deployment/DevOps | Docker/ACR/ECR | Task-level only | Beginner to intermediate |
| Research | Published paper | One applied paper | Applied, not research |

## 17. TIMELINE

| When | Event |
|---|---|
| Oct 2021 | B.Tech Data Science begins |
| Mar 2025 | AISmartLive (SenseMinds 360); IJIRT paper published |
| May 2025 | B.Tech completed |
| Jun to Aug 2025 | AAYS Analytics engagement |
| Jul 2025 | Competitive-programming sessions with Claude |
| Dec 2025 | TCS Digital joins; TCS Pune training, Special Initiative Award |
| Jun 2026 | Resume repositioned to Data Engineer; PySpark/Databricks learning notebook |
| Aug 2026 | ATS resume revamp |
| Sep 2026 | Active job search; Codex catalog (300 projects) |
| 2026 | Sighnal freelance work |
| Oct 2026 | Deployment exercise; Commvault referral application; resume updated with CodeVita S12, TCS award, hackathon |

## 18. TECHNOLOGY GRAPH

```
Python
├── Classical ML: Scikit-learn, XGBoost, Isolation Forest, SHAP, (NeuralProphet*)
├── NLP/LLM: HF Transformers, PEFT/LoRA, Gemma, TinyLLaMA, BERTopic, UMAP/HDBSCAN, MiniLM
├── GenAI/Agents: LangChain, LangGraph, RAG, Groq, Gemini, Claude, Langflow
├── Backend: FastAPI, Flask, Celery, Redis, JWT/RBAC, Streamlit
├── Data: PySpark(2), Delta(2), InfluxDB, MQTT, Postgres, MongoDB, MySQL, SQL Server(2)
├── Infra: Docker, Compose, ACR, ECR, Render/Neon (beginner)
├── CV*: YOLOv8, ByteTrack, OpenCV, PaddleOCR   (* = claimed, unverified)
└── Other: TypeScript/Next.js, Java, C, LaTeX
```

## 19. PROJECT x SKILL MATRIX

| Project | Python | ML | DL | LLM | RAG | Data Eng | Cloud | DB | Deploy | Research | Sys Design |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Sighnal | ★★★★★ | ★★★ | ★ | ★★★★★ | ★★★ | ★★★ | ★★ | ★★★★ | ★★★ | ★★ | ★★★★ |
| SenseMinds 360 | ★★★★ | ★★★★ | ★ | — | — | ★★★ | ★★ | ★★★ | ★★★ | ★ | ★★★ |
| Financial platform | ★★★★ | ★ | — | ★★★★ | ★★ | ★★ | — | ★★★ | ★★ | ★ | ★★★ |
| Legal summarizer | ★★★★ | ★★ | ★★★ | ★★★★ | — | ★ | ★ | — | — | ★★★ | ★★ |
| AAYS RAG/Langflow | ★★★ | — | — | ★★★ | ★★★ | ★ | ★★★ | ★★ | ★★★ | — | ★★ |
| TCS (KT/workshop) | ★ | — | — | — | — | ★★ | ★★ | ★★ | — | — | ★★ |

## 20. EVIDENCE DATABASE (key claims)

| Claim | Evidence | Source | Confidence |
|---|---|---|---|
| Built a grounded LLM chatbot with code-verified claims | Resume bullets, project discussion | Oct 2026 resume chat | Medium to high |
| 574 to 0 failed comments | Resume text | Oct 2026 | Medium (self-reported) |
| Led 12-member team, 92% accuracy | Resume bullets | Jun, Aug, Oct 2026 | Medium |
| IJIRT paper | Resume | Aug, Oct 2026 | Medium |
| TCS honest wording: KT + workshop only | Your correction | Jun 2026 | High |
| CodeVita S12 rank about 5K; TCS Pune award; AI Hackathon champion | Your statement | Oct 2026 | High (certificates not seen) |
| Runs Codex Free Lancers | Your statement, catalog files | Sep 2026 | High |
| Deployment needed step-by-step guidance | Auth-API chat | Oct 2026 | High |

## 21. RESUME-READY MASTER PROFILE

- **Identity:** AI Engineer focused on reliable GenAI and agentic systems; Data Engineer at TCS Digital; independent AI/backend engineer.
- **Summary:** Builds LLM-driven systems with measurable reliability (LangGraph agents, grounded chatbots, large-batch classification) and applied ML on IoT data (XGBoost, Isolation Forest, SHAP, 92% detection accuracy, 12-person team). Co-authored a published LLM-fine-tuning paper. Competitive programmer (CodeChef 3-star, LeetCode Knight, CodeVita S12 rank about 5K). TCS Special Initiative Award (HLD/LLD); TCS AI Hackathon champion.
- **Core skills:** Python, SQL; LangGraph/LangChain, RAG, PEFT/LoRA, prompt engineering; XGBoost, Isolation Forest, SHAP, BERTopic; FastAPI, Celery, Redis, MongoDB, Postgres, InfluxDB; Docker, ACR/ECR; PySpark/Azure Databricks/Delta (working level); JWT/RBAC.
- **Experience / education:** as in section 11 and section 1.

## 22. ONE-LINE IDENTITIES

- **Recruiter:** AI engineer with about 1 year of experience shipping LLM and agentic systems plus applied ML, currently at TCS Digital.
- **ML Engineer:** Applied ML engineer: XGBoost/Isolation Forest anomaly detection with SHAP on live IoT streams.
- **GenAI Engineer:** Builds grounded, test-covered LLM pipelines where claims are verified in code.
- **Research Engineer:** Applied builder with one co-authored fine-tuning paper; research depth still early.
- **Software Engineer:** Python/TypeScript engineer with async queues, auth, and 300+ tests on a SaaS GenAI platform.
- **LinkedIn:** AI Engineer | GenAI and Agentic Systems | Data Engineer at TCS Digital.
- **Portfolio:** Reliable LLM systems, agents and anomaly detection, with measurable outcomes.

## 23. FINAL HONEST ASSESSMENT: WHO IS THIS PERSON TECHNICALLY?

- **Current level:** Strong junior / early-mid applied GenAI engineer; junior data engineer.
- **Strongest area:** LLM pipeline reliability and agentic design.
- **Second strongest:** Applied ML on time-series/IoT with explainability.
- **Weakest area:** Production data engineering and infrastructure/deployment.
- **Most valuable skill:** Verified, reliable LLM output (guardrails, eval, retries).
- **Most underrated:** Test discipline plus explicit failure handling.
- **Biggest gap:** No owned, defensible production data pipeline; cloud/MLOps depth.
- **Biggest career risk:** Resume claims getting ahead of what you can explain live (TCS wording, rank percentages, unverified stacks).
- **Biggest opportunity:** Agentic/GenAI roles where Sighnal-style reliability work is rare among 0 to 2 YOE candidates.
- **Best role today:** GenAI / Agentic AI Engineer.
- **6-month target:** AI Engineer or backend-leaning GenAI role at a product company.
- **1 to 2 years:** Senior-track AI/ML engineer or GenAI platform engineer.
- **Gap to top candidates:** Evidence of scale, owned production systems with metrics and monitoring, open-source or public write-ups, strong live DSA and system design.
- **To get there:** (1) get one real pipeline or service you own end to end in production, with monitoring and a measured outcome; (2) write one public technical post on the 574-to-0 reliability work; (3) fix resume inconsistencies; (4) add a small, honest evaluation benchmark to each GenAI project; (5) practise system-design interviews; (6) either build or delete the CV and vector-DB claims.

## 24. OPEN QUESTIONS (could not resolve from available data)

1. What have you actually built at TCS since Dec 2025?
2. Exact personal contribution split on Sighnal.
3. Whether the AAYS and AISmartLive overlap is part-time or contract work.
4. Whether the B.Tech job-agent report and the roll number 22A91A6715 are yours.
5. Whether the GNN M.Tech note is your own project or a client's.
6. Results behind RTGS AI and HackAP hackathons.
7. Which project used YOLOv8/ByteTrack/PaddleOCR.
