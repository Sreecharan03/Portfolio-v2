import localFont from "next/font/local";

export { GeistSans } from "geist/font/sans";

/**
 * Geist Mono is used for small labels only, so it is self-hosted without a
 * preload: it never competes with the hero text for bandwidth.
 */
export const GeistMono = localFont({
  src: "../fonts/GeistMono-Variable.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
});

/**
 * Display accent only: a single italic weight (~22 KB). Preloaded because it
 * appears in the hero; the metric-adjusted fallback keeps layout shift low.
 */
export const InstrumentSerif = localFont({
  src: "../fonts/InstrumentSerif-Italic.woff2",
  style: "italic",
  weight: "400",
  variable: "--font-instrument-serif",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});
