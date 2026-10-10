import { SourceTag } from "@/components/ui/SourceTag";

/** Fine-tuning configuration as committed in the repository README, plus the reported evaluation. */
const lora = [
  ["r", "8"],
  ["lora_alpha", "32"],
  ["target_modules", '["q_proj", "v_proj"]'],
  ["lora_dropout", "0.05"],
  ["bias", '"none"'],
  ["task_type", '"CAUSAL_LM"'],
];

const training = [
  ["per_device_train_batch_size", "4"],
  ["gradient_accumulation_steps", "2"],
  ["learning_rate", "2e-5"],
  ["num_train_epochs", "3"],
  ["fp16", "True"],
];

const sample = [
  ["ROUGE-1", "0.5916"],
  ["ROUGE-2", "0.3819"],
  ["ROUGE-L", "0.4373"],
  ["Cosine (TF-IDF)", "0.8449"],
];

function Block({ title, rows }: { title: string; rows: string[][] }) {
  return (
    <div className="rounded-[10px] border border-line bg-bg p-4">
      <p className="font-mono text-[0.78rem] text-signal-soft">{title}(</p>
      <dl className="mt-1 space-y-0.5 pl-4 font-mono text-[0.8rem]">
        {rows.map(([k, v]) => (
          <div key={k} className="flex flex-wrap gap-x-1">
            <dt className="text-ink-2">{k}=</dt>
            <dd className="text-ink">{v},</dd>
          </div>
        ))}
      </dl>
      <p className="font-mono text-[0.78rem] text-signal-soft">)</p>
    </div>
  );
}

export function TrainingCard() {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
      <div className="rounded-[var(--radius)] border border-line bg-surface-1 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="label-mono text-ink-3">Fine-tuning setup</p>
          <SourceTag source="repo" />
        </div>
        <p className="mt-3 text-[0.88rem] text-ink-2">
          Base model loaded in 4-bit; inputs tokenised to a maximum of 1,024 tokens.
        </p>
        <div className="mt-4 grid gap-3">
          <Block title="LoraConfig" rows={lora} />
          <Block title="TrainingArguments" rows={training} />
        </div>
      </div>
      <div className="rounded-[var(--radius)] border border-line bg-surface-1 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="label-mono text-ink-3">Sample-case evaluation</p>
          <SourceTag source="repo" />
        </div>
        <dl className="mt-4 divide-y divide-line border-y border-line">
          {sample.map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between py-3">
              <dt className="text-ink-2">{k}</dt>
              <dd className="font-display text-step-1 tabular">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-[0.82rem] text-ink-3">
          One reference summary, scored in the repository&apos;s tuning notebook. Read it as a demonstration of the evaluation, not a
          benchmark. The paper reports ROUGE, BLEU and METEOR comparisons against TextRank and BERTSUM.
        </p>
      </div>
    </div>
  );
}
