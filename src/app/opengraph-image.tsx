import { ImageResponse } from "next/og";
import { site } from "@/content/site";
import { OgFrame, ogFonts, ogSize } from "@/lib/og";

export const alt = `${site.name} — ${site.role}`;
export const size = ogSize;
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <OgFrame kicker={`${site.name} · ${site.role}`} footer="GenAI · Agentic systems · Backend · Data pipelines">
        <div style={{ display: "flex", flexDirection: "column", fontSize: 128, lineHeight: 0.95, letterSpacing: -5, fontWeight: 500 }}>
          <span>Intelligence,</span>
          <span style={{ fontFamily: "InstrumentSerif", fontStyle: "italic", fontWeight: 400, letterSpacing: -2, fontSize: 136 }}>
            engineered.
          </span>
        </div>
        <div style={{ marginTop: 28, fontSize: 30, color: "#a9b3c6", maxWidth: 900, lineHeight: 1.35 }}>
          Reliable GenAI and agentic systems, with the backend and data pipelines underneath them.
        </div>
      </OgFrame>
    ),
    { ...size, fonts: await ogFonts() },
  );
}
