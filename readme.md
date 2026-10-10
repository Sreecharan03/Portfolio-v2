# CHARAN (SREE CHARAN CHINTALAPUDI): TECHNICAL KNOWLEDGE BASE
Built 7 Oct 2026 from past chats, resume drafts and saved notes. Revised 10 Oct 2026 with certificates, award emails, three GitHub repos and your answers. Evidence-first, not flattering.

**Confidence labels:** DOCUMENT SEEN (certificate, email or repo I opened) / CONFIRMED (you stated it) / STRONG (visible in code, debugging or detailed design discussion) / INFERRED / UNCERTAIN.

## 0. SCOPE, EXCLUSIONS AND LIMITS

- **Excluded entirely (not yours):** all BITS Pilani graduate/PhD material: V2O5, SnO, CrSb, LaVO3, DFT, Quantum ESPRESSO, ABINIT, Phoebe, Octopus, SLURM/HPC debugging, manuscript/LaTeX bibliography work, phonons. None of it is used for any skill, project or achievement below.
- **Not attributed to you (client work):** M.Tech topic work for others (TraceGuard, KrishiVerify, air-quality auditor, VoterLens/GITAM, the "top 3 M.Tech projects" doc, and the GNN source-detection note, which you confirmed is a client's). I treat these as a service you run, not as your research.
- **Not examined:** about 80 named project workspaces (fraud detection, deepfake, medical AI, traffic, OCR, etc.). I only have their names. None are counted as your demonstrated work. A second pass opening each one would be needed.
- **Evidence base:** about 20 chats from Jun to Oct 2026, three resume versions, one early-2025 competitive-programming chat pair, five certificates, two hackathon emails, three public GitHub repos (read-only check), five coding-profile screenshots (LeetCode, GfG, Codeforces, Code360, CodeChef).

## 1. IDENTITY SNAPSHOT

| Item | Detail |
|---|---|
| Name | SREE CHARAN CHINTALAPUDI (goes by Charan / "Coder op"); GitHub `Sreecharan03`; portfolio sreecharanv2.vercel.app. The name appears differently on documents ("G V V Chintalapudi", "Chintalapudi Charan", "Ch G V V Sree Charan", "Chintalapudi Sree Charan"): use one consistent form on the resume |
| Education | B.Tech Data Science, Raghu Engineering College, Visakhapatnam, Oct 2021 to May 2025, CGPA 8.8/10. You call it tier-3 |
| Current job | Data Engineer, TCS Digital, since Dec 2025 |
| Side work | Sighnal freelance AI/backend (2026 to present); Team Lead of Codex Free Lancers (independent contract). Check TCS's outside-work policy and disclose as required |
| Target | AI/GenAI/Agentic AI/ML Engineer roles, product companies, 0 to 2 YOE; 60-day notice; active Commvault SWE (AI with GenAI) referral application |
| Style | Wants plain language first, concise output, honest resume wording, ready-to-use deliverables, and pushes back on unverified claims |

## 2. PROJECT-BY-PROJECT EXTRACTION

### P1. Sighnal (freelance client project, YouTube comment analytics / AI content strategist)
- **Type:** Freelance, production-style full-stack GenAI platform. **Period:** 2026 to present. **Status:** active.
- **Described architecture:** Innertube-based scraping (10K+ comment threads/video, resumable jobs); Celery + Redis + MongoDB with 4 queues, per-video fan-out, distributed lock, concurrency gates, self-healing watchdog (10 failure modes); LLM intent/sentiment classification (gpt-oss-120b on Groq) with dynamic batching, SimHash dedup, TTL-LRU cache, AIMD rate control, circuit breaker; BERTopic (UMAP + HDBSCAN + MiniLM); Claude Haiku summaries; grounded chatbot where the LLM proposes claims and code verifies citations against evidence; JWT (argon2), RBAC, plan-tier enforcement, audit logging; Docker Compose; Next.js/TypeScript/TanStack Query frontend; 286-test classifier suite, 33-test resilience suite, 300+ tests total.
- **Reported results (your resume text):** a 12,910-comment run went from 574 permanently failed comments to 0; a README-related measurement of 15% to 52% (the 15%→52% line still needs a label saying what it measures).
- **Level:** Advanced implementation, production-style. **Evidence:** CONFIRMED by you: you built it end to end, from design to production. **Caveat:** the product name is client-owned, so confirm permission before naming it.
- **Skills shown:** async/distributed task design, LLM reliability engineering, hallucination control, SaaS security basics, testing.

### P2. SenseMinds 360 / Predictive Protection (AISmartLive Solutions, industrial IoT anomaly detection)
- **Type:** Professional (full-time), Mar to Dec 2025, Junior Data Scientist. AISmartLive is a child company of AAYS.
- **Described:** MQTT to InfluxDB, 30 sensors, 15-second resolution, 172,800 datapoints/day; XGBoost + Isolation Forest + NeuralProphet predictive maintenance; SHAP explainability; 92% detection accuracy; investigation time 8 h to 1 h (87.5%); failures flagged 6 to 8 h early; you were technical lead of a 12-member team.
- **Hackathon link:** the same platform was entered as "Predictive Protection" in the Andhra Pradesh hackathon and received **Third Prize** (email seen).
- **Level:** Intermediate to Advanced applied ML; deployed at an actual client. **Evidence:** CONFIRMED (your statements and resume), numbers self-reported. Be ready to explain what "92% accuracy" means (precision/recall, class balance, labels). You chose to keep these figures as written.

### P3. Real-Time / Multi-Agent Financial Analytics Platform
- **Type:** Personal portfolio project (github.com/Sreecharan03/Realtime-financial-langgraph). **Stack:** LangGraph, Gemini, PostgreSQL, Streamlit.
- **Described:** 5-stage workflow (intent, entities, Text-to-SQL, validation, synthesis) over 7 financial tables, SQL-injection and destructive-query guards, TTL caching, conversation context.
- **Level:** Intermediate to Advanced implementation, prototype. **Evidence:** CONFIRMED (resume, repo link). "Sub-second retrieval" appears in one resume draft with no measurement I can see: drop it or measure it.

### P4. Legal Document Summarization (LLM fine-tuning)
- **Type:** Academic/research prototype, co-developed; **published in IJIRT, Mar 2025**.
- **Described:** two-stage PEFT/LoRA pipeline (TinyLLaMA 1.1B then Gemma 2-2B), hybrid extractive/abstractive; 4-bit loading, rank-8 LoRA, 1,024-token inputs, 3 epochs; ROUGE-L 0.4373, cosine similarity 0.8449, beats TextRank and BERTSUM; Databricks used for training.
- **Level:** Intermediate. "Co-developed" is the accurate word; keep it. IJIRT is a low-tier journal.

### P5. AAYS Advisory engagement (16 Jun to 15 Aug 2025)
- **Document seen:** Internship Completion Certificate, AAYS Advisory Private Limited, 16 Jun 2025 to 15 Aug 2025. You describe it as a contract; the company issued it as an internship. **Resume wording: "Intern, AAYS Advisory Pvt Ltd"** (what a verification call will return), noting it is the parent group of AISmartLive.
- **Work:** containerised Langflow, pushed to Azure Container Registry and AWS ECR; FastAPI RAG microservice for a knowledge-transfer platform; migrated Aadi FinTech dashboards from Plotly to ECharts/AmCharts. **Level:** Intermediate.
- **Overlap with AISmartLive:** resolved (same corporate group).

### P6. Codex Free Lancers (independent contract; business and community)
- You lead a team (Gowtham, Pavan Kumar, Sanchit, Koushik) that delivers advanced data-science and AI projects to B.Tech students, with a dev team and a documentation team. **5 Oct 2025 to 10 May 2026:** onboarded **100+ project groups (300+ people)** and delivered all of them; you explained projects end to end for 50+ groups; you built the student community around it.
- Catalog built with you: 300 projects across 7 domains (ML, DL, OpenCV, GenAI, AI Agents, Custom LLMs, Full Stack + AI), priced about ₹5,000 to ₹30,000. You also run research-idea vetting for client M.Tech theses (existence checks, novelty audits).
- **Value:** leadership, scoping, delivery at scale, community building. **Risk:** recruiters or background checks may question "delivering student projects"; describe it as project mentoring and freelance delivery, not ghost-writing.

### P7. Smart Traffic Management (github.com/Sreecharan03/Smart-traffic-management-opencv)
- **Document seen (repo, Feb 2026):** YOLOv8 vehicle detection (`bestt.pt`), ByteTrack tracking via `supervision`, polygon zones (N/E/S/W), baseline then adaptive signal control with a priority score (count, wait, fairness), Streamlit dashboard, output video download.
- **Level:** Intermediate. **Caveats:** it processes uploaded video; its own README says "No live camera streaming," so do not call it real-time. PaddleOCR is not in this repo.

### P8. Agentic RAG Study Assistant (github.com/Sreecharan03/Agentic-RAG)
- **Document seen (repo, Feb 2026):** 4-agent pipeline (query understanding, retrieval, answer generation, verification) over textbook PDFs (DBMS, ML, OS). PyMuPDF/pdfplumber extraction, sentence-aware chunking, BGE embeddings, **Qdrant** vector DB with subject-filtered retrieval, Gemma-2-9B generation, confidence check, Streamlit upload-to-index flow. `chromadb` is also in requirements.
- **Level:** Intermediate to Advanced. **Caveat:** the vector DB evidenced here is Qdrant, not Weaviate, Astra DB or Azure AI Search.

### P9. Smaller or learning items
| Item | What it shows | Level |
|---|---|---|
| Resume Analyzer & Job Search Agent (github.com/Sreecharan03/Resume-analzyer-Job-search-Agent-Langgraph; B.Tech client project) | 8-node LangGraph pipeline, Groq Llama 3.3 70B, MiniLM fit scoring, Adzuna, Streamlit; saved applications dated Aug 2025; repo last updated Feb 2026. You built it end to end (roll number in the B.Tech report ignored, per you) | Intermediate to Advanced |
| Auth API deploy (Express + TS + JWT + Postgres on Render/Neon) | You deployed a friend's code with heavy guidance; shared a DB URL and secret in chat | Beginner/Working (deployment) |
| PySpark/Databricks teaching notebook (Jun 2026, Lightning AI) | Structured curriculum: skew, salting, narrow vs wide, repartition vs coalesce, lazy eval, Delta, Auto Loader and Unity Catalog simulated locally | Working knowledge |
| Resume engineering (LaTeX, ATS tuning) | Strong iterative editing, accurate-wording discipline | n/a |

## 3. SKILLS MATRIX

Levels: 0 Awareness, 1 Beginner, 2 Working, 3 Intermediate, 4 Advanced, 5 Expert.

| Skill | Category | Evidence | Level | Confidence |
|---|---|---|---|---|
| Python | Language | Every project | 3.5 (4 for ML/LLM code) | High |
| SQL | Language/DB | Text-to-SQL, Postgres, SQL Server on resume | 3 | Medium |
| Java, C | Language | Resume only | 2 | Low |
| TypeScript/Next.js | Language/FE | Sighnal frontend (you built end to end), auth API | 3 | Medium |
| DSA / interview coding | DSA | LeetCode Knight, contest rating 1,898 (top 4.74%), 757 solved; GfG 1,797 score, 654 solved; CodeVita S12 rank 5127 and Smart Interviews 159/35,859 (certificates); all profile screenshots seen | 4 | High |
| Competitive programming (contests) | DSA | CodeChef 1634 (max 1654, 3-star); Codeforces 1366 (Pupil); Code360 1803 | 3 | High |
| XGBoost / Isolation Forest / SHAP | Classical ML | SenseMinds 360 | 3.5 | Medium |
| Time-series (NeuralProphet) | ML | Used in SenseMinds (your statement) | 2.5 | Medium (no repo seen) |
| LLM apps / prompting / structured outputs | GenAI | Sighnal, financial agent, job agent | 4 | High |
| LangGraph / multi-agent | GenAI | Financial platform, job agent (repo), Agentic RAG (repo), Sighnal | 4 | High |
| RAG + vector DB | GenAI | Agentic RAG with **Qdrant** (repo); AAYS RAG | 3.5 | High for Qdrant |
| Weaviate, Astra DB, Azure AI Search | GenAI | None seen | unproven | Remove or add a project |
| PEFT / LoRA fine-tuning | GenAI | Legal summarization | 3 | Medium |
| LLM evaluation / hallucination control | GenAI | Sighnal evidence-verification design, test suites | 3.5 | Medium to high |
| NLP clustering (BERTopic/UMAP/HDBSCAN) | NLP | Sighnal | 3 | Medium |
| Computer vision (YOLOv8, ByteTrack, OpenCV) | CV | Smart traffic repo | 3 | High |
| PaddleOCR | CV | None seen | unproven | Remove or add a project |
| FastAPI / Flask / Streamlit | Backend | AAYS, financial platform, job agent, RAG | 3 | High |
| Celery / Redis / MongoDB | Backend | Sighnal | 3 | Medium |
| Auth (JWT, RBAC, argon2) | Security | Sighnal | 3 | Medium |
| Docker | DevOps | AAYS, Sighnal Compose | 3 | Medium |
| Azure Container Registry / AWS ECR | Cloud | AAYS tasks | 2 | Medium |
| Azure Databricks / PySpark | Data Eng | TCS production ingestion pipelines (100K to 1M records); self-built notebook | 3 | Medium (your statement; no orchestration evidence) |
| Delta Lake | Data Eng | Concepts, notebook | 2 to 2.5 | Medium |
| InfluxDB / MQTT | Data/IoT | SenseMinds 360 | 3 | Medium |
| PostgreSQL / MySQL | DB | Projects | 3 | Medium |
| Git/GitHub | SE | Repos | 3 | Medium |
| Testing | SE | Sighnal suites | 3 | Medium |
| System design (HLD/LLD) | SE | TCS Special Initiative Award; Sighnal | 3 | Medium |
| CI/CD, Kubernetes, Terraform, Airflow/orchestration | MLOps | No evidence | 0 to 1 | n/a |
| GPU training, distributed training, quantization/serving | ML infra | 4-bit LoRA loading; Gemma-2-9B fp32 inference in RAG | 1 to 2 | Medium |

### Four-way classification
- **A. Demonstrated:** LLM classification pipelines; LangGraph agents (3 repos); agentic RAG with Qdrant; Text-to-SQL with guardrails; YOLOv8 + ByteTrack zone logic; PEFT/LoRA fine-tune; XGBoost/Isolation Forest/NeuralProphet + SHAP on IoT; Databricks/PySpark ingestion at TCS; FastAPI services; Docker; Celery/Redis queues; JWT/RBAC; BERTopic.
- **B. Strong working knowledge:** Spark internals (skew, salting, lazy eval), Delta Lake concepts, RAG design, hallucination-control patterns.
- **C. Exposure:** Databricks Unity Catalog/Auto Loader (simulated), Render/Neon deployment, ECR/ACR, Langflow.
- **D. Claimed, unverified:** PaddleOCR, Weaviate/Astra DB/Azure AI Search, "LLMOps," "Multimodal AI," Java/C depth, "architected multi-stage ETL pipelines at TCS."

## 4. DATA ENGINEERING PROFILE

- **What you reported (Oct 2026):** at TCS you build production Azure Databricks + PySpark ingestion pipelines processing 100K to 1M records per run (about 80K on average; your wording was cut off, please confirm), and you reduced multiple and duplicated calls in ingestion notebooks, cutting run time about 20% (self-reported, no baseline seen). You also run performance assessments on ingestion and transformations.
- **Earlier statement (Jun 2026):** KT sessions and a workshop only, no production pipeline. The Oct 2026 account supersedes it, but the Aug 2026 resume line "Architected multi-stage distributed ETL pipelines" still overstates it: "Built and optimised Databricks/PySpark ingestion pipelines (100K to 1M records)" is defensible.
- **Level:** Working to intermediate (3). **Still missing as evidence:** scheduling/orchestration (ADF/Workflows/Airflow), data-quality framework, monitoring, cost tuning, incident handling. 100K to 1M records is solid but not large-scale; do not call it big data or distributed at scale.
- **Other evidence:** SenseMinds ingestion (MQTT to InfluxDB at 172,800 points/day), Sighnal queue design.

## 5. AI/ML ENGINEERING PROFILE

| Area | Practical evidence | Level | Missing |
|---|---|---|---|
| Python | Broad | 3.5 | Packaging, typing discipline |
| Preprocessing/classical ML | SenseMinds | 3.5 | Experimental rigor, calibration, drift |
| Deep learning | LoRA, YOLO usage | 2 to 2.5 | From-scratch training, architectures |
| NLP | BERTopic, LLM classification | 3.5 | Classical eval metrics depth |
| Transformers/LLMs | Fine-tune, API orchestration, Gemma-2-9B serving | 3.5 | Internals, inference optimisation |
| RAG | AAYS, Agentic RAG (Qdrant), Sighnal | 3.5 | Reranking, hybrid search, eval benchmarks |
| Fine-tuning/PEFT | Legal summarizer | 3 | SFT/DPO, QLoRA at scale, ablations |
| Agents | LangGraph x4 | 4 | Agent evals, long-horizon reliability |
| Evaluation | Sighnal, ROUGE | 3 | Systematic LLM-eval frameworks |
| MLOps/deployment | Docker, ECR | 2 | Registry, monitoring, CI/CD |
| GPU/distributed | None | 1 | Multi-GPU, serving (vLLM etc.) |
| Time-series, CV | NeuralProphet (SenseMinds), YOLOv8/ByteTrack (repo) | 2.5 to 3 | Evaluation numbers for the CV system |

## 6. ACHIEVEMENTS

| Achievement | Date | Org | Evidence | Note |
|---|---|---|---|---|
| TCS Gems Special Initiative Award | 17 Jun 2026 | TCS | Certificate seen | Citation: "outstanding contribution to the organisation." It does not mention HLD/LLD or training; use the certificate's wording |
| AMD and TCS AI Hackathon **Champion Certificate** | 17 Aug 2026 | TCS | Certificate seen | The certificate text reads "in recognition of your participation and enthusiasm." Write "Champion Certificate," not "winner" |
| TCS CodeVita Season 12, global rank **5127** | 2026 | TCS | Rank certificate seen | Quote the rank; do not convert to a percentage |
| Smart Interviews "Smart Coder", rank **159 of 35,859** | 2024 | Smart Interviews | Certificate seen | About the top 0.44% of that course cohort. This is the source of the old "top 0.5% globally" line; that wording is wrong. Write "Rank 159/35,859, Smart Interviews (2024)" |
| LeetCode Knight: contest rating 1,898, **top 4.74%** (rank 40,920 of 887,132), 29 contests; **757 solved** (305 E / 380 M / 72 H); 18 badges | 2024 to 2026 | LeetCode | Profile screenshot seen | Your strongest verifiable DSA credential |
| GeeksforGeeks: coding score 1,797, 654 solved, institute rank 6, 343 POTD solved, longest streak 152 days | to Oct 2026 | GfG | Profile screenshot seen | Consistency signal |
| CodeChef 3-Star: rating 1634 (highest 1654), global rank 11,714 | to Oct 2026 | CodeChef | Profile screenshot seen | Earlier README said 1651; use 1634 / max 1654 |
| Codeforces Pupil 1366; Code360 1803 ("top 68%" label) | to Oct 2026 | Platforms | Screenshots seen | Weakest profiles; leave off the resume |
| **Third Prize**, "Predictive Protection" (SenseMinds 360 platform) | Andhra Pradesh hackathon, date not shown | AISmartLive team | Award email seen | You were team lead, designed the solution and implemented the PoC (your confirmation) |
| **Third position**, "Health - Care Saver" (smart-watch tracking, diabetes live readings and notifications) | Same hackathon series, date not shown | AISmartLive team | Award email seen | Same role as above (your confirmation). The email's own PoC line is a next step, so describe the PoC as yours, not as the email's |
| Onboarded and delivered 100+ B.Tech project groups (300+ people); explained 50+ projects end to end | 5 Oct 2025 to 10 May 2026 | Codex Free Lancers | Your statement | Your highest achievement by scale |
| IJIRT publication (co-author) | Mar 2025 | IJIRT | Resume | Co-developed |
| Technical lead of 12-member team | 2025 | AISmartLive | Resume | Self-reported impact figures |

## 7. CODING / DSA PROFILE

- **Languages:** Python primary; Java, C listed.
- **Estimated level: Strong for interviews (4/5); strong intermediate for contests (3/5).** Verified: LeetCode Knight 1,898 (top 4.74%, 757 solved), GfG 654 solved, CodeVita S12 global 5127, Smart Interviews 159/35,859. Codeforces 1366 (Pupil) and CodeChef 1634 show contest-speed rating is not elite.
- **Chat evidence:** you bring hard problems to Claude (cactus-in-ladder-grid, rectangle-boundary counting) and ask it to "act like a top competitive programmer." That alone proves nothing, but your profiles do: 757 LeetCode solves and a 1,898 contest rating show real solving ability. Expect live problem-solving in interviews.
- **Weaknesses (INFERRED):** advanced graph theory/DP at high rating, proof-of-complexity articulation under pressure.

## 8. PROJECT DEPTH RANKING

- **Tier S:** none (no research-grade or fully verified production system).
- **Tier A:** Sighnal; SenseMinds 360 / Predictive Protection.
- **Tier B:** Financial multi-agent platform; Agentic RAG (Qdrant); Resume Analyzer job agent; Legal summarization fine-tune; Smart traffic management; AAYS RAG + Langflow.
- **Tier C:** PySpark learning notebook; auth API deployment.
- **Tier D / idea-only:** none visible as yours; the M.Tech idea work belongs to clients.

## 9. TECHNICAL MATURITY

| Dimension | Assessment |
|---|---|
| Problem decomposition | Strong (agent stages, queue design, zone-based control logic) |
| Architecture | Good for GenAI systems; improving on data platforms |
| Debugging | Good on LLM pipelines; unknown on infra |
| Production thinking | Emerging: guardrails, retries, tests in Sighnal; Databricks pipelines in production at TCS; deployment confidence still low |
| Documentation | Strong (repo READMEs with architecture diagrams, catalogs, reports, resumes) |
| Independence | Good; you scope your own work and push back on shallow answers |
| Learning speed | Fast: IoT ML to agents to SaaS backend to Databricks in about 18 months |
| **Overall** | **Early-career applied AI engineer, solid junior-to-mid in GenAI, junior-to-mid in data engineering, junior in infra** |

## 10. RESEARCH PROFILE

One co-authored applied paper (summarization), ROUGE/cosine evaluation against TextRank and BERTSUM baselines. Your vetting of others' thesis ideas shows good research taste but is advisory work. **Classification: Applied builder with research awareness, not yet a research engineer.** No ablations, statistical testing or reproducibility packages visible.

## 11. PROFESSIONAL EXPERIENCE

| Company | Role | Duration | Level of ownership | Evidence of impact |
|---|---|---|---|---|
| TCS Digital | Data Engineer | Dec 2025 to now | Medium: Databricks/PySpark ingestion pipelines in production | 100K to 1M records per run; about 20% run-time cut (self-reported); Special Initiative Award (17 Jun 2026) |
| AISmartLive Solutions (child of AAYS) | Junior Data Scientist, full-time | Mar to Dec 2025 | High (tech lead of 12) | 92% accuracy, 8 h to 1 h, SHAP; Third Prize x2 in a hackathon (team) |
| AAYS Advisory Pvt Ltd | Intern (contract; internship certificate) | 16 Jun to 15 Aug 2025 | Medium | Langflow images, RAG API, dashboard migration |
| Sighnal (freelance) | AI/Backend engineer | 2026 to now | High: end to end | Reliability and security work |
| Codex Free Lancers (independent contract) | Team Lead | 5 Oct 2025 to 10 May 2026 (project delivery run) | High | 100+ groups, 300+ people |

Resume issues remaining: the summary headline says AI/GenAI Engineer while the TCS role is data engineering; keep one consistent name; remove or prove unverified skills.

## 12. ROLE FIT

| Role | Fit /10 | Why | Missing | Readiness |
|---|---|---|---|---|
| GenAI/LLM Engineer | 7.5 | Sighnal, fine-tune, RAG with Qdrant | Eval frameworks, scale serving | Now |
| Agentic AI Engineer | 8 | 4 LangGraph/agent systems, verification design | Agent evals | Now |
| AI Engineer (general) | 7.5 | Breadth, CV and RAG repos | Deeper ML theory | Now |
| Software/Backend Engineer | 5.5 | Celery, auth, tests | System design at scale, more languages | 3 to 6 mo |
| ML Engineer | 6 | XGBoost, NeuralProphet, IoT, YOLO | MLOps, deep learning | 6 mo |
| Data Engineer | 5.5 | Production Databricks/PySpark ingestion, ingestion design | Orchestration, data quality, monitoring | 6 to 12 mo |
| MLOps/Platform | 3.5 | Docker only | K8s, CI/CD, monitoring | 12 mo+ |
| Research Engineer | 4 | One paper | Research record | 18 mo+ |
| Applied Scientist | 3 | Light math/stat evidence | Publications, theory | 2 yrs+ |

## 13. MARKET POSITIONING

- **Strongest identity:** "AI engineer building reliable, grounded LLM and agentic systems, with a data-engineering base and IoT ML background."
- **Best titles:** AI Engineer, GenAI Engineer, Agentic AI Engineer, Software Engineer (AI).
- **Recruiters will notice:** LangGraph, LLM reliability numbers (574 to 0), fine-tuning + paper, TCS award and ranks, hackathon prizes, 100+ student groups delivered.
- **Recruiters may question:** TCS data-engineering depth vs wording, "winner" wording on third-place prizes, the Champion Certificate wording, unnamed client project, vector-DB claims beyond Qdrant, side work alongside TCS.

## 14. TOP STRENGTHS (evidence-linked)

1. LLM reliability engineering (batching, retries, circuit breakers, dedup): Sighnal.
2. Hallucination control by code-verified citations: Sighnal chatbot.
3. Agent workflow design with validation stages and SQL guardrails: financial platform, Agentic RAG verification agent.
4. Applied anomaly detection with explainability: SenseMinds.
5. Leading teams: 12 people at AISmartLive; the Codex dev and documentation teams.
6. Distributed queue design (Celery/Redis/watchdog).
7. Security basics for SaaS (JWT, RBAC, argon2, audit logs).
8. Test discipline in at least one large project (300+ tests).
9. Fine-tuning pipeline with measured results and a publication.
10. Fast learning across domains.
11. Verified DSA record: LeetCode Knight 1,898 (top 4.74%, 757 solved), CodeVita 5127, Smart Interviews 159/35,859.
12. Strong written output and documentation.
13. Product thinking: packaging services, pricing tiers, community building.
14. Honest-resume instinct (you corrected inflated TCS bullets yourself).
15. Skeptical, pushes for verified answers.

## 15. WEAKNESSES AND GAPS

- TCS pipeline evidence lacks orchestration, data-quality and monitoring detail; the Aug 2026 resume wording overstates it.
- Cloud depth is shallow (Azure/AWS registries, Databricks); no IaC, no orchestration, no monitoring stack.
- Deployment confidence low (Render/Neon needed step-by-step help; secrets pasted into chat).
- No evidence of math/statistics depth, ML theory, or deep-learning training from scratch.
- PaddleOCR and Weaviate/Astra DB/Azure AI Search sit on the resume without a project behind them.
- Metrics (92%, 87.5%, 20%, "sub-second") lack visible evaluation protocols.
- System design for scale (sharding, backpressure, cost) not shown; Java/C not shown.
- No open-source contributions beyond your own repos.
- Public repo hygiene: the job-agent repo is public and contains your resume PDF with photo and saved applications for a real company.
- Possible overestimation: "production-grade," "LLMOps," "architected pipelines," "real-time" for the traffic project.

## 16. WHAT YOU APPEAR TO BELIEVE VS WHAT IS EVIDENCED

| Area | Belief | Evidence | Assessment |
|---|---|---|---|
| Data Engineering | Strong DE profile (resume) | Production Databricks/PySpark ingestion (your statement), KT, workshop | Working to intermediate, not yet proven at scale |
| Hackathons | "2-time winner" | Two emails: **third prize** and **third position** | Reword: "3rd Prize x2" |
| TCS AI Hackathon | "Champion" | Certificate says Champion Certificate but text says participation | Use certificate wording, not "winner" |
| CP rank | "Top 0.5%" | Smart Interviews 159/35,859 (a course cohort) | Reword to the exact rank |
| CV stack | YOLOv8/ByteTrack/PaddleOCR | Repo has YOLOv8 + ByteTrack; no PaddleOCR | Drop PaddleOCR or add the project |
| Vector DBs | Weaviate/Astra/Azure AI Search | Repo uses Qdrant | List Qdrant; prove the others |
| Traffic project | Real-time vehicle control | Repo processes uploaded video; no live streaming | Say "video-based adaptive signal control" |
| Production GenAI | Production-grade | Sighnal design and tests, built end to end | Credible |
| Research | Published paper | One applied paper | Applied, not research |

## 17. TIMELINE

| When | Event |
|---|---|
| Oct 2021 | B.Tech Data Science begins |
| Mar 2025 | AISmartLive full-time (SenseMinds 360); IJIRT paper published |
| May 2025 | B.Tech completed |
| 16 Jun to 15 Aug 2025 | AAYS Advisory internship |
| Aug 2025 | Job-agent project saved applications (earliest dated artifacts) |
| 5 Oct 2025 to 10 May 2026 | Codex Free Lancers: 100+ project groups delivered |
| Dec 2025 | TCS Digital joins; AISmartLive role ends |
| Feb 2026 | Smart traffic and Agentic RAG repos committed |
| Jun 2026 | Resume repositioned to Data Engineer; PySpark/Databricks learning notebook; 17 Jun: TCS Special Initiative Award |
| 17 Aug 2026 | AMD and TCS AI Hackathon Champion Certificate |
| Aug 2026 | ATS resume revamp |
| Sep 2026 | Active job search; Codex catalog (300 projects) |
| 2026 | Sighnal freelance work; CodeVita S12 rank certificate |
| Oct 2026 | Deployment exercise; Commvault referral application |

## 18. TECHNOLOGY GRAPH

```
Python
├── Classical ML: Scikit-learn, XGBoost, Isolation Forest, SHAP, NeuralProphet (SenseMinds)
├── NLP/LLM: HF Transformers, PEFT/LoRA, Gemma, TinyLLaMA, BERTopic, UMAP/HDBSCAN, MiniLM, BGE
├── GenAI/Agents: LangChain, LangGraph, RAG, Qdrant, Groq, Gemini, Claude, Langflow
├── Backend: FastAPI, Flask, Celery, Redis, JWT/RBAC, Streamlit
├── Data: PySpark, Azure Databricks, Delta(2), InfluxDB, MQTT, Postgres, MongoDB, MySQL, SQL Server(2)
├── Infra: Docker, Compose, ACR, ECR, Render/Neon (beginner)
├── CV: YOLOv8, ByteTrack, OpenCV, supervision   (PaddleOCR* = claimed, unverified)
└── Other: TypeScript/Next.js, Java, C, LaTeX
```

## 19. PROJECT x SKILL MATRIX

| Project | Python | ML | DL | LLM | RAG | Data Eng | Cloud | DB | Deploy | Research | Sys Design |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Sighnal | ★★★★★ | ★★★ | ★ | ★★★★★ | ★★★ | ★★★ | ★★ | ★★★★ | ★★★ | ★★ | ★★★★ |
| SenseMinds 360 | ★★★★ | ★★★★ | ★ | — | — | ★★★ | ★★ | ★★★ | ★★★ | ★ | ★★★ |
| Financial platform | ★★★★ | ★ | — | ★★★★ | ★★ | ★★ | — | ★★★ | ★★ | ★ | ★★★ |
| Agentic RAG | ★★★★ | ★★ | ★★ | ★★★★ | ★★★★ | ★★ | — | ★★★ | ★★ | ★ | ★★★ |
| Job-agent | ★★★★ | ★★ | — | ★★★★ | ★★ | ★ | — | ★★ | ★★ | — | ★★★ |
| Smart traffic | ★★★★ | ★★ | ★★★ | — | — | — | — | — | ★★ | — | ★★★ |
| Legal summarizer | ★★★★ | ★★ | ★★★ | ★★★★ | — | ★ | ★ | — | — | ★★★ | ★★ |
| AAYS RAG/Langflow | ★★★ | — | — | ★★★ | ★★★ | ★ | ★★★ | ★★ | ★★★ | — | ★★ |
| TCS pipelines | ★★★ | — | — | — | — | ★★★ | ★★★ | ★★ | ★★ | — | ★★ |

## 20. EVIDENCE DATABASE (key claims)

| Claim | Evidence | Source | Confidence |
|---|---|---|---|
| Built a grounded LLM chatbot with code-verified claims; Sighnal end to end | Resume bullets, design discussion, your confirmation | Oct 2026 | High |
| 574 to 0 failed comments | Resume text | Oct 2026 | Medium (self-reported) |
| Led 12-member team, 92% accuracy | Resume bullets | Jun, Aug, Oct 2026 | Medium |
| Special Initiative Award, 17 Jun 2026 | Certificate | Oct 2026 | Document seen |
| AMD and TCS AI Hackathon Champion Certificate, 17 Aug 2026 | Certificate | Oct 2026 | Document seen |
| CodeVita S12 rank 5127; Smart Interviews 159/35,859 | Certificates | Oct 2026 | Document seen |
| AAYS internship 16 Jun to 15 Aug 2025 | Certificate | Oct 2026 | Document seen |
| 3rd Prize (Predictive Protection) and 3rd position (Health - Care Saver) | Two award emails | Oct 2026 | Document seen (no individuals named) |
| Team lead and designer on both hackathon entries | Your statement | Oct 2026 | Confirmed |
| YOLOv8 + ByteTrack traffic system; LangGraph job agent; Qdrant agentic RAG | Three repos | Oct 2026 | Document seen |
| Databricks/PySpark ingestion at TCS, 100K to 1M records; about 20% run-time cut | Your statement | Oct 2026 | Confirmed (self-reported) |
| 100+ project groups, 300+ people, 5 Oct 2025 to 10 May 2026 | Your statement | Oct 2026 | Confirmed |
| Deployment needed step-by-step guidance | Auth-API chat | Oct 2026 | High |

## 21. RESUME-READY MASTER PROFILE

- **Identity:** AI Engineer focused on reliable GenAI and agentic systems; Data Engineer at TCS Digital; independent AI/backend engineer.
- **Summary:** Builds LLM-driven systems with measurable reliability (LangGraph agents, agentic RAG on Qdrant, grounded chatbots, large-batch classification) and applied ML on IoT data (XGBoost, Isolation Forest, NeuralProphet, SHAP, 92% detection accuracy, 12-person team). Builds Azure Databricks/PySpark ingestion pipelines at TCS (100K to 1M records). Co-authored a published LLM-fine-tuning paper. Third prize x2 at an Andhra Pradesh hackathon (team lead); AMD x TCS AI Hackathon Champion Certificate; TCS Special Initiative Award (Jun 2026); LeetCode Knight (1,898, top 4.74%, 757 solved); CodeVita S12 global rank 5127; Smart Interviews rank 159/35,859. Delivered 100+ student project groups.
- **Core skills:** Python, SQL; LangGraph/LangChain, RAG (Qdrant), PEFT/LoRA, prompt engineering; XGBoost, Isolation Forest, NeuralProphet, SHAP, BERTopic; YOLOv8, ByteTrack, OpenCV; FastAPI, Celery, Redis, MongoDB, Postgres, InfluxDB; Docker, ACR/ECR; PySpark/Azure Databricks; JWT/RBAC.
- **Experience / education:** as in section 11 and section 1.

## 22. ONE-LINE IDENTITIES

- **Recruiter:** AI engineer with about 1 year of experience shipping LLM and agentic systems plus applied ML, currently at TCS Digital.
- **ML Engineer:** Applied ML engineer: XGBoost/Isolation Forest/NeuralProphet anomaly detection with SHAP on live IoT streams.
- **GenAI Engineer:** Builds grounded, test-covered LLM pipelines where claims are verified in code.
- **Research Engineer:** Applied builder with one co-authored fine-tuning paper; research depth still early.
- **Software Engineer:** Python/TypeScript engineer with async queues, auth, and 300+ tests on a SaaS GenAI platform.
- **LinkedIn:** AI Engineer | GenAI and Agentic Systems | Data Engineer at TCS Digital.
- **Portfolio:** Reliable LLM systems, agents and anomaly detection, with measurable outcomes.

## 23. FINAL HONEST ASSESSMENT: WHO IS THIS PERSON TECHNICALLY?

- **Current level:** Strong junior / early-mid applied GenAI engineer; junior-to-mid data engineer.
- **Strongest area:** LLM pipeline reliability and agentic design.
- **Second strongest:** Applied ML on time-series/IoT with explainability, plus CV zone-logic work.
- **Weakest area:** Infrastructure/deployment and orchestration.
- **Most valuable skill:** Verified, reliable LLM output (guardrails, eval, retries).
- **Most underrated:** Test discipline plus explicit failure handling; leading 100+ student groups.
- **Biggest gap:** Production data pipelines without visible orchestration or monitoring; cloud/MLOps depth.
- **Biggest career risk:** Resume claims getting ahead of what you can explain live ("winner" on third-place prizes, "top 0.5%", "architected pipelines", unverified stacks).
- **Biggest opportunity:** Agentic/GenAI roles where Sighnal-style reliability work is rare among 0 to 2 YOE candidates.
- **Best role today:** GenAI / Agentic AI Engineer.
- **6-month target:** AI Engineer or backend-leaning GenAI role at a product company.
- **1 to 2 years:** Senior-track AI/ML engineer or GenAI platform engineer.
- **Gap to top candidates:** Evidence of scale, monitored production systems with metrics, public write-ups, strong live DSA and system design.
- **To get there:** (1) add orchestration, data-quality checks and monitoring to one TCS pipeline and record the measured outcome; (2) write one public post on the 574-to-0 reliability work; (3) apply the wording fixes in sections 6 and 16; (4) add a small honest evaluation benchmark to each GenAI project; (5) practise system-design interviews; (6) build or delete PaddleOCR and the non-Qdrant vector-DB claims; (7) make the job-agent repo private or remove the resume PDF and saved applications.

## 24. OPEN QUESTIONS

**Resolved by you or by documents (Oct 2026):**
1. TCS: Azure Databricks + PySpark production ingestion pipelines, 100K to 1M records, about 20% run-time reduction from removing duplicated calls.
2. Sighnal: you built it end to end, design to production.
3. AAYS vs AISmartLive: AAYS is the parent group; AISmartLive was full-time, AAYS a contract issued as an internship.
4. Job-agent project: yours; the roll number is ignored.
5. GNN M.Tech note: client work, excluded.
6. RTGS / predictive maintenance: the same hackathon; SenseMinds 360 is "Predictive Protection"; both entries placed third.
7. YOLOv8/ByteTrack: the Smart traffic repo. NeuralProphet: used in SenseMinds.

**Still open:**
1. What does "about 80K" mean in your TCS answer (average records per run)? What scheduler or orchestrator runs the pipelines, and what do the performance assessments measure?
2. Weaviate, Astra DB, Azure AI Search, PaddleOCR, Java/C: a project or repo for each, or remove them.
3. What exactly does the 15% to 52% figure measure?
4. How the 92% accuracy is defined.
