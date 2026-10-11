"use client";

import { useId, useMemo, useState } from "react";

/**
 * JavaScript port of SecurityValidator.validate_query from
 * Realtime-financial-langgraph/src/langgraph/query_executor.py.
 * Same patterns, same order, same read-only rule and table allow-list.
 */
const DANGEROUS = [
  { family: "Stacked destructive statement", source: String.raw`;\s*(DROP|DELETE|UPDATE|INSERT|ALTER|CREATE|TRUNCATE)` },
  { family: "UNION-based injection", source: String.raw`(UNION|UNION\s+ALL).*SELECT` },
  { family: "SQL comment", source: String.raw`(--\s|/\*|\*/)` },
  { family: "Procedure or shell access", source: String.raw`(xp_|sp_|cmd|shell)` },
  { family: "Dynamic execution", source: String.raw`(EXEC|EXECUTE)\s+` },
  { family: "Variable or cast with @", source: String.raw`(DECLARE|CAST|CONVERT).*@` },
  { family: "Timing attack", source: String.raw`(WAITFOR|DELAY)` },
  { family: "File access", source: String.raw`(LOAD_FILE|INTO\s+OUTFILE)` },
] as const;

const ALLOWED_OPERATIONS = ["SELECT", "WITH", "EXPLAIN", "SHOW", "DESCRIBE", "ANALYZE"];
const ALLOWED_TABLES = [
  "stocks",
  "stock_prices",
  "technical_indicators",
  "risk_metrics",
  "sentiment_scores",
  "financial_news",
  "news_stock_mentions",
  "portfolios",
  "portfolio_holdings",
  "users",
  "user_queries",
];

type Result =
  | { valid: false; stage: "pattern"; family: string; source: string }
  | { valid: false; stage: "operation"; operation: string }
  | { valid: true; operation: string; tables: string[]; warnings: string[] };

function validateQuery(sql: string): Result {
  const upper = sql.toUpperCase().trim();
  for (const d of DANGEROUS) {
    if (new RegExp(d.source, "i").test(upper)) return { valid: false, stage: "pattern", family: d.family, source: d.source };
  }
  const operation = upper.split(/\s+/).filter(Boolean)[0] ?? "";
  if (!ALLOWED_OPERATIONS.includes(operation)) return { valid: false, stage: "operation", operation };
  const tables = [...upper.matchAll(/(?:FROM|JOIN)\s+(\w+)/gi)].map((m) => m[1] ?? "").filter(Boolean);
  const warnings = tables.filter((t) => !ALLOWED_TABLES.includes(t.toLowerCase())).map((t) => `Table access warning: ${t}`);
  return { valid: true, operation, tables, warnings };
}

const PRESETS = [
  { label: "Price history", sql: "SELECT symbol, date, close\nFROM stock_prices\nWHERE symbol = 'AAPL'\nORDER BY date DESC\nLIMIT 30" },
  { label: "Join with risk", sql: "SELECT s.symbol, r.beta, r.volatility\nFROM stocks s\nJOIN risk_metrics r ON r.stock_id = s.id" },
  { label: "Stacked DROP", sql: "SELECT * FROM stocks; DROP TABLE stocks" },
  { label: "UNION injection", sql: "SELECT symbol FROM stocks WHERE symbol = '' UNION SELECT password FROM users" },
  { label: "DELETE", sql: "DELETE FROM stock_prices WHERE 1 = 1" },
  { label: "Unknown table", sql: "SELECT * FROM salaries" },
];

export function SqlGuard() {
  const [sql, setSql] = useState(PRESETS[0]?.sql ?? "");
  const id = useId();
  const result = useMemo(() => validateQuery(sql), [sql]);

  const blocked = !result.valid;
  const check = (ok: boolean | null, title: string, detail: string) => (
    <li className="flex gap-3 py-3">
      <span
        aria-hidden
        className={`mt-1 grid size-5 shrink-0 place-items-center rounded-full text-[0.7rem] ${
          ok === null ? "border border-line text-ink-3" : ok ? "bg-verify/20 text-verify-soft" : "bg-warn/20 text-warn"
        }`}
      >
        {ok === null ? "–" : ok ? "✓" : "✕"}
      </span>
      <span>
        <span className="block text-[0.92rem] text-ink">{title}</span>
        <span className="block text-[0.82rem] text-ink-3">{detail}</span>
      </span>
    </li>
  );

  return (
    <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
      <div className="rounded-[var(--radius)] border border-line bg-surface-1 p-5">
        <label htmlFor={`${id}-sql`} className="label-mono text-ink-3">
          Generated SQL
        </label>
        <textarea
          id={`${id}-sql`}
          value={sql}
          onChange={(e) => setSql(e.target.value)}
          spellCheck={false}
          rows={6}
          className="mt-3 w-full resize-y rounded-[10px] border border-line bg-bg p-4 font-mono text-[0.85rem] leading-relaxed text-ink outline-none transition-colors focus:border-signal/60"
        />
        <p className="label-mono mt-4 text-ink-3">Try</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setSql(p.sql)}
              aria-pressed={sql === p.sql}
              className={`min-h-9 rounded-full border px-3 text-[0.8rem] transition-colors ${
                sql === p.sql ? "border-signal/60 bg-signal/10 text-ink" : "border-line text-ink-2 hover:border-line-strong hover:text-ink"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[var(--radius)] border border-line bg-surface-1 p-5" aria-live="polite">
        <div className="flex items-center justify-between gap-4">
          <p className="label-mono text-ink-3">SecurityValidator</p>
          <span
            className={`rounded-full px-3 py-1 font-mono text-[0.72rem] tracking-[0.1em] ${
              blocked ? "bg-warn/15 text-warn" : "bg-verify/15 text-verify-soft"
            }`}
          >
            {blocked ? "BLOCKED" : result.warnings.length ? "ALLOWED · WARNINGS" : "ALLOWED"}
          </span>
        </div>
        <ul className="mt-3 divide-y divide-line">
          {check(
            result.valid ? true : result.stage === "pattern" ? false : true,
            "Dangerous patterns",
            result.valid || result.stage === "operation"
              ? "None of the 8 blocked pattern families matched."
              : `Matched: ${result.family}  ·  /${result.source}/`,
          )}
          {check(
            result.valid ? true : result.stage === "operation" ? false : null,
            "Read-only statement",
            result.valid
              ? `Starts with ${result.operation}, which is allowed.`
              : result.stage === "operation"
                ? `“${result.operation || "(empty)"}” is not one of ${ALLOWED_OPERATIONS.join(", ")}.`
                : "Not reached: validation stops at the first failure.",
          )}
          {check(
            result.valid ? result.warnings.length === 0 : null,
            "Table allow-list",
            result.valid
              ? result.tables.length
                ? result.warnings.length
                  ? `${result.warnings.join("; ")}. Logged as a warning; the query still runs.`
                  : `${result.tables.map((t) => t.toLowerCase()).join(", ")}: all allow-listed.`
                : "No FROM or JOIN tables found."
              : "Not reached.",
          )}
        </ul>
        <p className="mt-3 text-[0.82rem] text-ink-3">
          {blocked
            ? "In the workflow, a blocked query sets an error and routes to the error handler. It never reaches PostgreSQL."
            : "Passed queries go on to the cache check and a 30-second execution timeout."}
        </p>
      </div>
    </div>
  );
}
