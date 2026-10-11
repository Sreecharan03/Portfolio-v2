import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#080b12" }}>
        <svg width="180" height="180" viewBox="0 0 28 28" fill="none">
          <path d="M7 15.5 11.8 20 21 8" stroke="#a9b3c6" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="7" cy="15.5" r="2" fill="#6495ff" />
          <circle cx="11.8" cy="20" r="2" fill="#6495ff" />
          <circle cx="21" cy="8" r="2.6" fill="#9477ff" />
        </svg>
      </div>
    ),
    size,
  );
}
