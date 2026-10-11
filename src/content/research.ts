/**
 * Publication details are taken from the paper's own header (IJIRT 174041),
 * hosted in the owner's public repository.
 */
export const publication = {
  title: "Summarization with a Custom Fine-Tuned LLaMA Model via Instruction-Based Training",
  venue: "International Journal of Innovative Research in Technology (IJIRT)",
  venueShort: "IJIRT",
  volume: "Volume 11, Issue 10",
  date: "March 2025",
  datePublished: "2025-03",
  issn: "2349-6002",
  pages: "2400–2405",
  paperId: "IJIRT 174041",
  authors: [
    { name: "P. Adithya Siva Shankar", self: false },
    { name: "CH. V. V. Sree Charan", self: true },
    { name: "M. Yamini", self: false },
    { name: "CH. Siddardha", self: false },
    { name: "K. Surya Padmakar", self: false },
  ],
  problem:
    "Legal documents are long, terminology-dense and unforgiving: a summary that drops a clause can change its meaning. Generic summarisers lose clauses and context.",
  approach:
    "A two-stage framework: TinyLLaMA 1.1B is instruction-tuned on a curated legal corpus, then Gemma 2-2B is fine-tuned to strengthen abstractive quality. A hybrid output mode keeps wording verbatim for clause-heavy documents and paraphrases narrative case law. Training ran on Databricks.",
  method: [
    { k: "Base models", v: "TinyLLaMA 1.1B → Gemma 2-2B" },
    { k: "Adaptation", v: "LoRA, r = 8, α = 32, dropout 0.05 (q, v projections)" },
    { k: "Precision", v: "4-bit base weights" },
    { k: "Inputs", v: "Up to 1,024 tokens" },
    { k: "Schedule", v: "3 epochs · learning rate 2e-5" },
    { k: "Data", v: "Legal corpus → instruction / context / response JSONL" },
  ],
  evaluation:
    "The paper compares the pipeline with TextRank, BERTSUM and legal-specific transformers on ROUGE, BLEU and METEOR. A repository notebook adds a single-case check: ROUGE-L 0.4373 and TF-IDF cosine similarity 0.8449.",
  role: "Co-author (second of five) and co-developer.",
  links: [
    {
      label: "Read the paper (PDF)",
      href: "https://github.com/Sreecharan03/Summarization-with-a-Custom-Fine-Tuned-LLaMA-AND-GEMMA-Models-via-Instruction-Based-Training/blob/main/IJIRT174041_PAPER.pdf",
    },
    {
      label: "Code & notebooks",
      href: "https://github.com/Sreecharan03/Summarization-with-a-Custom-Fine-Tuned-LLaMA-AND-GEMMA-Models-via-Instruction-Based-Training",
    },
  ],
  caseStudy: "/work/legal-summarization",
} as const;
