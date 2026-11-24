import AxeBuilder from "@axe-core/playwright";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const root = path.join(process.cwd(), "site");
const mime = { ".css": "text/css", ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".png": "image/png" };
const server = createServer(async (request, response) => {
  const relative = new URL(request.url, "http://localhost").pathname.replace(/^\/+/, "") || "index.html";
  const file = path.resolve(root, relative);
  if (!file.startsWith(`${root}${path.sep}`)) {
    response.writeHead(403).end();
    return;
  }
  try {
    await stat(file);
    response.writeHead(200, { "Content-Type": mime[path.extname(file)] || "application/octet-stream" });
    response.end(await readFile(file));
  } catch {
    response.writeHead(404).end("Not found");
  }
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const { port } = server.address();
const browser = await chromium.launch({ headless: true });
try {
  for (const viewport of [
    { name: "mobile", width: 390, height: 844 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "projector", width: 1440, height: 900 },
  ]) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await page.goto(`http://127.0.0.1:${port}`, { waitUntil: "networkidle" });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (overflow > 1) throw new Error(`${viewport.name}: ${overflow}px horizontal overflow`);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    if (results.violations.length) {
      const violations = results.violations.map(({ id, impact, nodes }) =>
        `${id} (${impact}): ${nodes.map(({ target, failureSummary }) => `${target.join(" ")} ${failureSummary}`).join("; ")}`,
      ).join("\n");
      throw new Error(`${viewport.name}: accessibility violations: ${violations}`);
    }
    if (viewport.name === "mobile") {
      await page.locator(".check-control").first().click();
      await page.reload();
      if (!(await page.locator('[data-check="join"]').isChecked())) throw new Error("Checklist progress did not persist");
      await page.locator("#clear-progress").click();
      if (await page.locator('[data-check="join"]').isChecked()) throw new Error("Checklist reset failed");
    }
    await page.close();
    await context.close();
    console.log(`${viewport.name}: no overflow; WCAG A/AA automated checks passed`);
  }
} finally {
  await browser.close();
  server.close();
}
