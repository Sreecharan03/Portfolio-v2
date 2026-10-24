# Portfolio site — engineering notes

The website for Sree Charan Chintalapudi. The repository's root `readme.md` is the private technical
knowledge base the content was drawn from; this file documents the site itself.

## Design direction

**Intelligence, engineered.** The visual system is a *verification graph*: signals enter wide, pass
through reasoning and retrieval, and only verified signals reach the output. The same idea runs through
the content: every number on the site carries a provenance label (certificate, public profile, public
repo, award email, publication, system spec, reported, illustrative).

- Dark-first palette as tokens in `src/app/globals.css` (`@theme`): blue (`signal`) for data in motion,
  violet (`verify`) for reasoning and checks, amber (`warn`) for failure paths. Accents are used sparingly.
- Type: Geist (display and body), Instrument Serif italic for one accent phrase per heading, Geist Mono
  for technical annotations. Fluid scale via `clamp()` (`text-step-*`).
- Each project has bespoke SVG artwork drawn from its real mechanism (queues, telemetry, guarded graph,
  retrieval, two-stage fine-tuning, junction control).

## Architecture

- **Next.js 16 (App Router), React 19, TypeScript (strict), Tailwind CSS 4.** Every route is statically
  prerendered: `/`, `/work/[slug]` (6 case studies), `/resume`, plus generated OG images, icons,
  `sitemap.xml` and `robots.txt`. The only server code is the optional chat endpoint (`/api/chat`); there
  is no database or tracking.
- **Content layer** (`src/content/`): typed modules for site identity, projects and case studies,
  diagrams, experience, achievements, capabilities, research and principles. Components never hard-code
  copy. `sources.ts` defines the provenance labels.
- **Server components by default.** Client components are limited to interaction: header/menu/brief
  dialog, hero canvas, capability explorer, work index, chapter nav, architecture diagram, demos.
  Each interactive demo is its own lazily loaded chunk (`InteractiveDemo.tsx`), so a case study downloads
  only the demo it shows; demos are still rendered into the static HTML.
- **Résumé**: the résumé buttons open `public/Sreecharan_Ai_Engineer.pdf` (`site.resumePdf` in
  `src/content/site.ts`; replace the file to update it). `/resume` remains as a print-ready page generated
  from the same content, and is used automatically if `resumePdf` is set to `null`.

### Motion system

| Concern | Tool | Notes |
|---|---|---|
| First-viewport intro | CSS keyframes | Starts at first paint; never waits for JS. |
| Scroll reveals | GSAP core + IntersectionObserver | Loaded at idle; each element animates as it approaches. |
| Heading line reveals | GSAP SplitText | Loaded only when the first heading needs it. |
| Timeline progress | rAF on scroll | Listens only while the timeline is on screen. |
| Hover / state | CSS transitions | |
| Hero graph | Canvas 2D | Pseudo-3D projection, ~40 nodes; sleeps off-screen and in hidden tabs; drops to ~30 fps on slow devices. |
| Diagrams | SVG + CSS | Dash pulses on active edges only. |

Elements opt in with `data-reveal="up|lines|stagger|mask|draw"`, `data-count`, `data-scrub-line` and
`data-art`. Content is visible without JS, with `prefers-reduced-motion`, or if the runtime fails: the
runtime marks itself ready only after GSAP has loaded and reveals are wired up, so a slow or failed load
trips the 4-second failsafe (`motion-off`) and nothing is hidden again afterwards. Heading line splits
give up after 1.5 s, and switching on reduced motion mid-session stops motion and shows everything. WebGL was deliberately not used: the graph is small enough for
Canvas 2D, which avoids a ~150 KB 3D runtime and context-loss handling.

### Interactive demos (case studies)

| Project | Demo | Basis |
|---|---|---|
| Sighnal | Failure drill | Illustrative simulation of AIMD, circuit breaker and retry |
| SenseMinds 360 | Health roll-up | Port of the platform's `HealthEngine` (representative machine, not client data) |
| Financial agents | SQL guard | JavaScript port of `SecurityValidator` (same patterns and allow-list); its known gaps are shown, not fixed |
| Agentic RAG | Router + verifier | Ports of `QueryUnderstandingAgent` and `VerificationAgent`; refusals are flagged separately from the score |
| Traffic control | Junction sandbox | Port of `TrafficSignalController` and `config.py` constants |
| Legal summarization | Training card | Configuration committed in the repository |

## Portfolio assistant (chat)

An optional "Ask AI" button opens a small chat that answers questions about Charan's work.

- **Knowledge:** only the site's public content layer (`src/lib/assistant/knowledge.ts` builds chunks
  from `src/content/*`). The private `readme.md` knowledge base is deliberately not used: anything in a
  chatbot's context can be repeated to any visitor. To teach it something, add it to the content files.
- **Retrieval:** a small TF-IDF ranker (`src/lib/assistant/retrieve.ts`) sends the profile, the project
  list and the four most relevant chunks, about 1.5–2K tokens per request.
- **Answers:** `POST /api/chat` streams from Groq, trying `openai/gpt-oss-120b`, then `qwen/qwen3-32b`,
  then `llama-3.3-70b-versatile`; a model that is rate-limited, retired or failing hands over to the next
  (each has its own Groq quota). The prompt asks for a warm, plain-language answer in 2–4 sentences, in
  the visitor's own language (Hindi, Telugu, Hinglish and so on), from the facts only, keeping source
  labels (Reported, Illustrative) and declining off-topic requests. Token limits are generous so answers
  never stop mid-sentence; reasoning and any `<think>` block are never shown. The panel links the related
  pages it drew on. Questions in other scripts get a general overview of the work as their facts.
- **Key and privacy:** `GROQ_API_KEY` is read only on the server and never reaches the browser.
  Messages are forwarded to Groq to generate the reply and are not logged or stored by the site.
  Without a key the button is not rendered and the endpoint returns 503.
- **Abuse limits:** same-origin requests only; 8 questions a minute and 60 a day per IP (best effort,
  per server instance); 500-character questions; the last 8 turns. Groq's own rate limits are the
  backstop, so a free-tier key cannot run up a bill.
- **Enable it:** in Vercel → Settings → Environment Variables add `GROQ_API_KEY` (Production and
  Preview), optionally `GROQ_MODEL` (a comma-separated list overrides the order above), then redeploy.
  Locally, put the key in `.env.local`, which git ignores. Never use a `NEXT_PUBLIC_` prefix for the key.

## Development

```bash
npm install
npm run dev          # http://localhost:3000
npm run check        # typecheck + lint
npm run build        # production build
npm run test:e2e     # Playwright + axe against a production build (run `npm run build` first)
```

Playwright downloads its own browser with `npx playwright install chromium`; set `PW_CHROMIUM_PATH` to
reuse a preinstalled Chromium instead.

### Editing content

- Add or edit a project in `src/content/projects.ts`; its diagram goes in `src/content/diagrams.ts`
  (node boxes use a 1200-unit-wide viewBox; the mobile layout is derived automatically from `steps`).
- Hide anything with `visibility: "hidden"` (projects and journey entries).
- Every metric needs a `source`. Use `reported` for on-the-job figures without public data and
  `illustrative` for anything synthetic.

## Deployment (Vercel)

1. Import the repository in Vercel. The framework preset is Next.js; the root directory is the repo root.
2. Optional: set `NEXT_PUBLIC_SITE_URL` to the production URL (otherwise `VERCEL_PROJECT_PRODUCTION_URL`
   is used for canonical links, Open Graph and the sitemap). The build refuses the sample value from
   `.env.example`.
3. Deploy. No other environment variables or services are required.

Any Node 20.9+ host works too: `npm run build && npm run start`. Off Vercel, set `NEXT_PUBLIC_SITE_URL`;
without it the build warns and canonical URLs fall back to `http://localhost:3000`.

## Validation (local production build)

- `tsc --noEmit` and ESLint (`eslint-config-next`): clean.
- Playwright: 68 checks across desktop (1440×900) and mobile (Pixel 7) with the assistant enabled (62 run
  and 6 skip when no `GROQ_API_KEY` is set). Assistant tests mock `/api/chat` in the browser and never call
  Groq; the endpoint itself was also exercised against a local Groq-compatible mock (streaming, retrieval,
  400/403/429 handling). They cover every route (console
  errors, horizontal overflow, axe WCAG 2.2 AA with no serious or critical violations), the 404 page,
  first-viewport identity, reduced motion, content visibility when GSAP loads slowly, focus containment
  and focus return in the brief dialog, internal links and fragments from every route, the résumé PDF,
  the header at 1024–1366 px, the diagram walkthrough, every demo including their edge cases, and the
  drill's keyboard radio group.
- Lighthouse 13 (lab, October 2026, before the audit fixes): desktop 100 in all four categories; mobile
  performance 93–95 with the other categories at 100. Lab numbers from one machine, not field data.
- Dependencies: Next.js 16.4.3 (patches GHSA-2464-fhr4-w9xw, GHSA-p3m5-59mp-jv5r and GHSA-673q-mjm6-r5xr
  in 16.4.0). `npm audit --omit=dev` reports no known vulnerabilities. The full audit reports
  GHSA-vfj7-8cjw-p6xm (braces, stack exhaustion on deeply nested patterns) through
  `eslint-config-next → fast-glob → micromatch`. It is development-only, the site never expands
  visitor-supplied globs, and npm's suggested fix is a forced major downgrade, so it is tracked rather
  than forced. Revisit when `eslint-config-next` updates `fast-glob`.

## Known limitations

- The Sighnal drill is illustrative by design, and the SenseMinds demo uses a representative machine: client data is private.
- The SenseMinds repository is private (it names the client), so its case study cites it as "Private codebase" and does not link it.
- No contact form: there is no mail provider configured, so contact is via `mailto:` and a copy button.
- Coding-profile figures are snapshots (Oct 2026). They are not fetched live, so update them by hand.
