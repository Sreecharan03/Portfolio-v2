import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const SLUGS = ["sighnal", "senseminds-360", "financial-agents", "agentic-rag", "legal-summarization", "smart-traffic"];
const ROUTES = ["/", "/resume", ...SLUGS.map((s) => `/work/${s}`)];

function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  return errors;
}

/** Demos load as their own chunk after the HTML; wait until it is fetched and hydrated before interacting. */
async function openDemo(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState("networkidle");
}

async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.7;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
}

test.describe("every route", () => {
  for (const route of ROUTES) {
    test(`${route} renders without errors or horizontal overflow`, async ({ page }) => {
      const errors = trackErrors(page);
      const res = await page.goto(route);
      expect(res?.status()).toBe(200);
      await expect(page.locator("h1").first()).toBeVisible();
      await scrollThrough(page);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
      expect(errors).toEqual([]);
    });

    test(`${route} has no serious accessibility violations`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(route);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
    });
  }
});

test("unknown routes return the custom 404", async ({ page }) => {
  const res = await page.goto("/work/does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("This path");
});

test("home exposes identity, role and primary actions within the first viewport", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Sree Charan Chintalapudi");
  await expect(page.getByRole("heading", { level: 1 })).toBeInViewport();
  await expect(page.getByText("Intelligence,")).toBeInViewport();
  await expect(page.getByRole("link", { name: "Explore work" })).toBeInViewport();
  for (const id of ["approach", "work", "capabilities", "journey", "achievements", "research", "principles", "contact"]) {
    await expect(page.locator(`section#${id}`)).toHaveCount(1);
  }
});

test("reduced motion leaves all content visible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const hidden = await page.evaluate(
    () => Array.from(document.querySelectorAll("[data-reveal]")).filter((el) => getComputedStyle(el).opacity === "0").length,
  );
  expect(hidden).toBe(0);
});

test("the 30-second brief opens, traps focus in a dialog and closes with Escape", async ({ page, isMobile }) => {
  await page.goto("/");
  if (isMobile) {
    await page.getByRole("button", { name: "Menu" }).click();
    await page.getByRole("button", { name: "30-second brief" }).click();
  } else {
    await page.getByRole("button", { name: "30-sec brief" }).click();
  }
  const dialog = page.getByRole("dialog", { name: "Sree Charan Chintalapudi" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText("Strongest work")).toBeVisible();
  // Tab and Shift+Tab never reach the page behind the modal.
  for (const key of [...Array(14).fill("Tab"), ...Array(6).fill("Shift+Tab")]) {
    await page.keyboard.press(key);
    const escaped = await page.evaluate(() => {
      const el = document.activeElement;
      return Boolean(el && el !== document.body && !el.closest("dialog[open]"));
    });
    expect(escaped, `focus left the dialog after ${key}`).toBe(false);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  if (!isMobile) await expect(page.getByRole("button", { name: "30-sec brief" })).toBeFocused();
});

test("internal links and their fragments resolve from every route", async ({ page, request }) => {
  const hrefs = new Set<string>();
  for (const route of ROUTES) {
    await page.goto(route);
    const found = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href^='/'], a[href^='#']")).map((a) => a.getAttribute("href") ?? ""),
    );
    for (const h of found) hrefs.add(h.startsWith("#") ? `${route}${h}` : h);
  }
  const ids = new Map<string, Set<string>>();
  for (const href of hrefs) {
    const [path = "/", fragment] = href.split("#");
    const target = path || "/";
    const res = await request.get(target);
    expect(res.status(), href).toBe(200);
    if (!fragment || !res.headers()["content-type"]?.includes("text/html")) continue;
    if (!ids.has(target)) {
      await page.goto(target);
      ids.set(target, new Set(await page.evaluate(() => Array.from(document.querySelectorAll("[id]")).map((e) => e.id))));
    }
    expect(ids.get(target)?.has(decodeURIComponent(fragment)), `#${fragment} on ${target}`).toBe(true);
  }
});

test("the résumé PDF is served as a PDF", async ({ request }) => {
  const res = await request.get("/Sreecharan_Ai_Engineer.pdf");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("application/pdf");
});

test("content stays visible when the animation library loads slowly", async ({ page }) => {
  // Hold back the GSAP chunk well past the 4-second failsafe.
  await page.route("**/_next/static/chunks/*.js", async (route) => {
    const response = await route.fetch();
    const body = await response.text();
    if (body.includes("_gsap")) await new Promise((r) => setTimeout(r, 8000));
    await route.fulfill({ response, body });
  });
  await page.goto("/");
  await page.waitForTimeout(5000);
  const hidden = await page.evaluate(
    () => Array.from(document.querySelectorAll("[data-reveal]")).filter((el) => getComputedStyle(el).opacity === "0").length,
  );
  expect(hidden).toBe(0);
});

test("architecture walkthrough responds to clicks and arrow keys", async ({ page }) => {
  await openDemo(page, "/work/sighnal");
  const tabs = page.getByRole("tablist", { name: "Architecture walkthrough" });
  await tabs.getByRole("tab", { name: /Classify/ }).click();
  await expect(page.getByRole("tabpanel").filter({ hasText: "Step 03 of 06" })).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.getByRole("tab", { name: /Understand/ })).toHaveAttribute("aria-selected", "true");
});

test("SQL guard blocks destructive SQL with the repository's rules", async ({ page }) => {
  await openDemo(page, "/work/financial-agents");
  await page.getByRole("button", { name: "Stacked DROP" }).click();
  await expect(page.getByText("BLOCKED", { exact: true })).toBeVisible();
  await expect(page.getByText(/Stacked destructive statement/)).toBeVisible();
  await page.getByLabel("Generated SQL").fill("SELECT symbol FROM stock_prices");
  await expect(page.getByText("ALLOWED", { exact: true })).toBeVisible();
  await expect(page.getByTestId("sql-gap")).toHaveCount(0);
});

test("SQL guard discloses what the pattern check lets through", async ({ page }) => {
  await openDemo(page, "/work/financial-agents");
  await page.getByRole("button", { name: "Gap: write inside WITH" }).click();
  await expect(page.getByText("ALLOWED · WARNINGS", { exact: true })).toBeVisible();
  await expect(page.getByTestId("sql-gap")).toBeVisible();
  await page.getByRole("button", { name: "Gap: stacked GRANT" }).click();
  await expect(page.getByTestId("sql-gap")).toBeVisible();
});

test("RAG verifier reproduces the documented confidence formula", async ({ page }) => {
  await openDemo(page, "/work/agentic-rag");
  // defaults: 0.4 × 0.78 + 0.4 × 0.64 + 0.2 × 1 = 0.768
  await expect(page.getByText("0.768")).toBeVisible();
  await page.getByLabel("The answer is a refusal (“could not find…”)").check();
  await expect(page.getByText("0.568")).toBeVisible();
  await expect(page.getByText("MEDIUM_CONFIDENCE", { exact: true })).toBeVisible();
  await expect(page.getByTestId("refusal-note")).toBeVisible();
});

test("junction sandbox picks the controller's next phase", async ({ page }) => {
  await openDemo(page, "/work/smart-traffic");
  await expect(page.getByText(/Next green:/)).toContainText("East");
  await expect(page.getByText(/Next green:/)).toContainText("30 s");
});

test("health roll-up reproduces the platform's health engine", async ({ page }) => {
  await openDemo(page, "/work/senseminds-360");
  const machine = page.getByTestId("machine-health");
  await expect(machine).toContainText("91.0");
  await expect(machine).toContainText("Warning");
  await page.getByLabel("Discharge pressure").selectOption("critical");
  await expect(page.getByTestId("subsystem-compression")).toContainText("62.8");
  await expect(machine).toContainText("77.6");
  await expect(machine).toContainText("Critical");
});

test("health roll-up shows no score when nothing can be trusted", async ({ page }) => {
  await openDemo(page, "/work/senseminds-360");
  for (const slider of await page.getByLabel("Data trust").all()) await slider.fill("0");
  const machine = page.getByTestId("machine-health");
  await expect(machine).toContainText("No trusted data");
  await expect(machine).toContainText("—");
});

test("failure drill strategy is a keyboard-operable radio group", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard behaviour is covered on desktop");
  await openDemo(page, "/work/sighnal");
  const protectedRadio = page.getByRole("radio", { name: "AIMD + breaker + retry" });
  await protectedRadio.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("radio", { name: "Fixed concurrency, no retry" })).toBeChecked();
  await expect(page.getByRole("radio", { name: "Fixed concurrency, no retry" })).toBeFocused();
});

test("header fits on one line at intermediate widths", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop widths only");
  for (const width of [1024, 1180, 1280, 1366]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");
    const header = page.locator("header").first();
    const box = await header.boundingBox();
    expect(box?.height, `header height at ${width}px`).toBeLessThanOrEqual(80);
    for (const name of ["30-sec brief", "Résumé"]) {
      const el = header.getByRole(name === "Résumé" ? "link" : "button", { name });
      const b = await el.boundingBox();
      expect(b?.height, `${name} at ${width}px`).toBeLessThanOrEqual(48);
    }
    const brand = await header.getByRole("link", { name: /home/ }).boundingBox();
    expect(brand?.height, `brand at ${width}px`).toBeLessThanOrEqual(48);
    // When the full navigation shows, nothing may crowd into it.
    const nav = header.getByRole("navigation", { name: "Primary" });
    if (await nav.isVisible()) {
      const n = await nav.boundingBox();
      const brief = await header.getByRole("button", { name: "30-sec brief" }).boundingBox();
      expect((brand?.x ?? 0) + (brand?.width ?? 0) + 16, `brand/nav gap at ${width}px`).toBeLessThanOrEqual(n?.x ?? 0);
      expect((n?.x ?? 0) + (n?.width ?? 0) + 16, `nav/actions gap at ${width}px`).toBeLessThanOrEqual(brief?.x ?? 0);
    }
  }
});

test.describe("portfolio assistant", () => {
  // The launcher renders only when GROQ_API_KEY is set for the build; the browser-side
  // tests mock /api/chat so they never call Groq.
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    const enabled = await page.getByRole("button", { name: "Ask the AI assistant about Charan" }).count();
    test.skip(enabled === 0, "assistant not configured for this build");
  });

  test("answers a suggested question, links related pages and closes with Escape", async ({ page }) => {
    await page.route("**/api/chat", (route) =>
      route.fulfill({
        status: 200,
        headers: {
          "content-type": "text/plain; charset=utf-8",
          "x-chat-related": encodeURIComponent(JSON.stringify([{ title: "Sighnal", href: "/work/sighnal" }])),
        },
        body: "Charan built Sighnal end to end; see /work/sighnal.",
      }),
    );
    const launcher = page.getByRole("button", { name: "Ask the AI assistant about Charan" });
    await launcher.click();
    const panel = page.getByRole("dialog", { name: "Ask about Charan" });
    await expect(panel).toBeVisible();
    await expect(panel.getByLabel("Your question")).toBeFocused();
    await panel.getByRole("button", { name: "What did Charan build at Sighnal?" }).click();
    await expect(panel.getByTestId("chat-answer")).toContainText("Charan built Sighnal end to end");
    await expect(panel.getByTestId("chat-answer").getByRole("link", { name: "Sighnal case study" })).toBeVisible();
    await expect(panel.getByRole("link", { name: "Sighnal", exact: true })).toBeVisible();

    const results = await new AxeBuilder({ page }).include("#portfolio-assistant").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(results.violations.filter((v) => v.impact === "serious" || v.impact === "critical").map((v) => v.id)).toEqual([]);

    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
    await expect(launcher).toBeFocused();
  });

  test("explains a rate limit and keeps the question", async ({ page }) => {
    await page.route("**/api/chat", (route) => route.fulfill({ status: 429, json: { error: "rate_limited" } }));
    await page.getByRole("button", { name: "Ask the AI assistant about Charan" }).click();
    const panel = page.getByRole("dialog", { name: "Ask about Charan" });
    await panel.getByLabel("Your question").fill("What is his LeetCode rating?");
    await page.keyboard.press("Enter");
    await expect(panel.getByRole("alert")).toContainText("try again in a minute");
    await expect(panel.getByLabel("Your question")).toHaveValue("What is his LeetCode rating?");
  });

  test("the chat endpoint rejects malformed and cross-site requests", async ({ request }) => {
    const bad = await request.post("/api/chat", { data: { messages: [{ role: "system", content: "x" }] } });
    expect(bad.status()).toBe(400);
    const cross = await request.post("/api/chat", {
      headers: { origin: "https://example.com" },
      data: { messages: [{ role: "user", content: "hi" }] },
    });
    expect(cross.status()).toBe(403);
  });
});
