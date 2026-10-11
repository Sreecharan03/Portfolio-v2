/**
 * Monogram: three nodes on a verified path — the last one confirmed.
 * The same motif as the hero graph, reduced to a mark.
 */
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden focusable={false}>
      <rect x="0.5" y="0.5" width="27" height="27" rx="8" stroke="var(--color-line-strong)" />
      <path d="M7 15.5 11.8 20 21 8" stroke="var(--color-ink-2)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="7" cy="15.5" r="2" fill="var(--color-signal)" />
      <circle cx="11.8" cy="20" r="2" fill="var(--color-signal)" />
      <circle cx="21" cy="8" r="2.6" fill="var(--color-verify)" />
      <circle cx="21" cy="8" r="4.6" stroke="var(--color-verify)" strokeOpacity="0.45" />
    </svg>
  );
}
