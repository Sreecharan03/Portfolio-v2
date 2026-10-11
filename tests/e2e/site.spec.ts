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
  await expect(page.getByText("Intelligence,")).toBeVisible();
  await expect(page.getByRole("link", { name: "Explore work" })).toBeVisible();
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
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("internal links resolve", async ({ page, request }) => {
  await page.goto("/");
  const hrefs = await page.evaluate(() =>
    Array.from(new Set(Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href^='/']")).map((a) => a.getAttribute("href") ?? ""))),
  );
  for (const href of hrefs) {
    const path = href.split("#")[0] || "/";
    const res = await request.get(path);
    expect(res.status(), href).toBe(200);
  }
});

test("architecture walkthrough responds to clicks and arrow keys", async ({ page }) => {
  await page.goto("/work/sighnal");
  const tabs = page.getByRole("tablist", { name: "Architecture walkthrough" });
  await tabs.getByRole("tab", { name: /Classify/ }).click();
  await expect(page.getByRole("tabpanel").filter({ hasText: "Step 03 of 06" })).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.getByRole("tab", { name: /Understand/ })).toHaveAttribute("aria-selected", "true");
});

test("SQL guard blocks destructive SQL with the repository's rules", async ({ page }) => {
  await page.goto("/work/financial-agents");
  await page.getByRole("button", { name: "Stacked DROP" }).click();
  await expect(page.getByText("BLOCKED", { exact: true })).toBeVisible();
  await expect(page.getByText(/Stacked destructive statement/)).toBeVisible();
  await page.getByLabel("Generated SQL").fill("SELECT symbol FROM stock_prices");
  await expect(page.getByText("ALLOWED", { exact: true })).toBeVisible();
});

test("RAG verifier reproduces the documented confidence formula", async ({ page }) => {
  await page.goto("/work/agentic-rag");
  // defaults: 0.4 × 0.78 + 0.4 × 0.64 + 0.2 × 1 = 0.768
  await expect(page.getByText("0.768")).toBeVisible();
  await page.getByLabel("The answer is a refusal (“could not find…”)").check();
  await expect(page.getByText("0.568")).toBeVisible();
  await expect(page.getByText("MEDIUM_CONFIDENCE")).toBeVisible();
});

test("junction sandbox picks the controller's next phase", async ({ page }) => {
  await page.goto("/work/smart-traffic");
  await expect(page.getByText(/Next green:/)).toContainText("East");
  await expect(page.getByText(/Next green:/)).toContainText("30 s");
});
