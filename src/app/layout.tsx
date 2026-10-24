import type { Metadata, Viewport } from "next";
import Script from "next/script";
import type { ReactNode } from "react";
import "./globals.css";
import { ChatLauncher } from "@/components/chat/ChatLauncher";
import { pageLabels } from "@/lib/assistant/pages";
import { MotionRuntime } from "@/components/motion/MotionRuntime";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { site } from "@/content/site";
import { buildBrief } from "@/lib/brief";
import { GeistMono, GeistSans, InstrumentSerif } from "@/lib/fonts";

const title = `${site.name} — ${site.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s — ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  keywords: [
    "AI Engineer",
    "GenAI",
    "Agentic AI",
    "LangGraph",
    "LLM reliability",
    "RAG",
    "Text-to-SQL",
    "Applied machine learning",
    "Data engineering",
    "Sree Charan Chintalapudi",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_IN",
    url: "/",
    title,
    description: site.description,
  },
  twitter: { card: "summary_large_image", title, description: site.description },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#080b12",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

// Marks JS as available before paint (scroll reveals hide content only when
// JS can show it again) and adds a failsafe if the motion runtime never starts.
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');setTimeout(function(){if(!window.__motionReady)d.classList.add('motion-off')},4000)})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${InstrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Script id="boot" strategy="beforeInteractive">
          {bootScript}
        </Script>
        <a
          href="#main"
          className="no-print fixed left-4 top-3 z-[100] -translate-y-24 rounded-full bg-ink px-4 py-2 font-medium text-bg transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <SiteHeader brief={buildBrief()} />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <SiteFooter />
        {/* The assistant appears only when a Groq key is configured for the deployment. */}
        {process.env.GROQ_API_KEY ? <ChatLauncher pages={pageLabels()} /> : null}
        <MotionRuntime />
      </body>
    </html>
  );
}
