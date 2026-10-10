/** Engineering principles, each anchored in something actually built. */
export const principles = [
  {
    title: "Verify before you trust",
    body: "Generated output is a proposal. In Sighnal the model proposes claims and code checks every citation; in the RAG assistant a verifier scores each answer before it leaves.",
    slug: "sighnal",
  },
  {
    title: "Design the failure path first",
    body: "Throttling, timeouts and bad batches are normal operating conditions. Rate control, circuit breakers, resumable jobs and a watchdog took one 12,910-comment run from 574 permanent failures to zero.",
    slug: "sighnal",
  },
  {
    title: "Guard the boundary",
    body: "Generated SQL is treated like user input: blocked patterns, read-only statements and a table allow-list are checked before anything reaches the database.",
    slug: "financial-agents",
  },
  {
    title: "Explain the model",
    body: "An alert should say why. SHAP attributions point an engineer at the signals behind an anomaly instead of handing them a score.",
    slug: "senseminds-360",
  },
  {
    title: "Say where numbers come from",
    body: "Every figure on this site is labelled: certificate, public profile, public code, award email, or reported from the job.",
    slug: undefined,
  },
] as const;
