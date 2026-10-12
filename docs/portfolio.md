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
  `sitemap.xml` and `robots.txt`. No backend, database or tracking.
- **Content layer** (`src/content/`): typed modules for site identity, projects and case studies,
  diagrams, experience, achievements, capabilities, research and principles. Components never hard-code
  copy. `sources.ts` defines the provenance labels.
- **Server components by default.** Client components are limited to interaction: header/menu/brief
  dialog, hero canvas, capability explorer, work index, chapter nav, architecture diagram, demos.
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
`data-art`. Content is visible without JS, with `prefers-reduced-motion`, or if the runtime fails (a
4-second failsafe adds `motion-off`). WebGL was deliberately not used: the graph is small enough for
Canvas 2D, which avoids a ~150 KB 3D runtime and context-loss handling.

### Interactive demos (case studies)

| Project | Demo | Basis |
|---|---|---|
| Sighnal | Failure drill | Illustrative simulation of AIMD, circuit breaker and retry |
| SenseMinds 360 | Health roll-up | Port of the platform's `HealthEngine` (representative machine, not client data) |
| Financial agents | SQL guard | JavaScript port of `SecurityValidator` (same patterns and allow-list) |
| Agentic RAG | Router + verifier | Ports of `QueryUnderstandingAgent` and `VerificationAgent` |
| Traffic control | Junction sandbox | Port of `TrafficSignalController` and `config.py` constants |
| Legal summarization | Training card | Configuration committed in the repository |

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
   is used for canonical links, Open Graph and the sitemap).
3. Deploy. No other environment variables or services are required.

Any Node 20.9+ host works too: `npm run build && npm run start`.

## Validation (October 2026, local production build)

- `tsc --noEmit` and ESLint (`eslint-config-next`): clean.
- Playwright: 50/50 checks on desktop (1440×900) and mobile (Pixel 7). They cover rendering and console
  errors, horizontal overflow, axe WCAG 2.2 AA (no serious or critical violations), reduced motion, the
  brief dialog, internal links, the 404 page, the diagram walkthrough and all three logic ports.
- Lighthouse 13 (lab):
  - Desktop preset: 100 in all four categories; LCP 0.7 s, TBT 0 ms, CLS 0.
  - Mobile preset (simulated slow 4G, 4× CPU): performance 93–95, other categories 100; TBT 40–80 ms,
    CLS 0, simulated LCP about 3 s. The observed LCP equals FCP (the hero text paints on the first
    frame); the simulated figure is dominated by the framework's baseline JavaScript.

These are lab numbers from one machine, not field data. Check real-user metrics after deployment.

## Known limitations

- The Sighnal drill is illustrative by design, and the SenseMinds demo uses a representative machine: client data is private.
- The SenseMinds repository is private (it names the client), so its case study cites it as "Private codebase" and does not link it.
- No contact form: there is no mail provider configured, so contact is via `mailto:` and a copy button.
- Coding-profile figures are snapshots (Oct 2026). They are not fetched live, so update them by hand.
