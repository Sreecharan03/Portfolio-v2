import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { ReactNode } from "react";

/** Shared Open Graph frame. Rendered at build time by next/og (Satori). */
export const ogSize = { width: 1200, height: 630 };

export async function ogFonts() {
  const root = process.cwd();
  const [medium, regular, mono, serif] = await Promise.all([
    readFile(join(root, "node_modules/geist/dist/fonts/geist-sans/Geist-Medium.ttf")),
    readFile(join(root, "node_modules/geist/dist/fonts/geist-sans/Geist-Regular.ttf")),
    readFile(join(root, "node_modules/geist/dist/fonts/geist-mono/GeistMono-Regular.ttf")),
    readFile(join(root, "src/fonts/InstrumentSerif-Italic.woff")),
  ]);
  return [
    { name: "Geist", data: medium, weight: 500 as const, style: "normal" as const },
    { name: "Geist", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "GeistMono", data: mono, weight: 400 as const, style: "normal" as const },
    { name: "InstrumentSerif", data: serif, weight: 400 as const, style: "italic" as const },
  ];
}

export function OgFrame({ kicker, children, footer }: { kicker: string; children: ReactNode; footer: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        background: "#080b12",
        backgroundImage:
          "radial-gradient(circle at 82% 30%, rgba(100,149,255,0.20), transparent 46%), radial-gradient(circle at 95% 90%, rgba(148,119,255,0.16), transparent 40%)",
        color: "#f4f7fc",
        fontFamily: "Geist",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ display: "flex", position: "relative", width: 44, height: 44, borderRadius: 12, border: "1.5px solid #2a344b" }}>
          <div style={{ position: "absolute", left: 13, top: 26, width: 11, height: 2, background: "#a9b3c6", transform: "rotate(41deg)", transformOrigin: "0 50%" }} />
          <div style={{ position: "absolute", left: 21, top: 33, width: 24, height: 2, background: "#a9b3c6", transform: "rotate(-57deg)", transformOrigin: "0 50%" }} />
          <div style={{ position: "absolute", left: 9, top: 23, width: 8, height: 8, borderRadius: 8, background: "#6495ff" }} />
          <div style={{ position: "absolute", left: 17, top: 30, width: 8, height: 8, borderRadius: 8, background: "#6495ff" }} />
          <div style={{ position: "absolute", left: 29, top: 9, width: 10, height: 10, borderRadius: 10, background: "#9477ff" }} />
        </div>
        <div style={{ fontFamily: "GeistMono", fontSize: 20, letterSpacing: 3, color: "#a9b3c6", textTransform: "uppercase" }}>{kicker}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>{children}</div>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "GeistMono", fontSize: 19, color: "#7d889e", letterSpacing: 1 }}>
        <span>{footer}</span>
        <span style={{ color: "#c1b2ff" }}>● every number sourced</span>
      </div>
    </div>
  );
}
