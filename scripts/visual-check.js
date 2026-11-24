const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright-core");
const axeSource = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");

const root = path.join(__dirname, "..", "dist");
const screenshots = path.join(__dirname, "..", ".visual-check");
const types = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

const server = http.createServer((request, response) => {
  const pathname = request.url === "/" ? "/index.html" : request.url.split("?")[0];
  const file = path.resolve(root, `.${pathname}`);
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    response.writeHead(404).end("Not found");
    return;
  }
  response.writeHead(200, { "content-type": types[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(response);
});

async function checkViewport(browser, port, name, viewport) {
  const page = await browser.newPage({ viewport, reducedMotion: "reduce" });
  await page.goto(`http://127.0.0.1:${port}`, { waitUntil: "networkidle" });
  await page.addScriptTag({ content: axeSource });
  const results = await page.evaluate(async () => {
    const accessibility = await window.axe.run(document, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
    });
    const qrImages = [...document.querySelectorAll(".qr-stage img, .lab-alt img")];
    return {
      title: document.title,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      violations: accessibility.violations.map(({ id, impact, description, nodes }) => ({
        id,
        impact,
        description,
        count: nodes.length,
        nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })),
      })),
      qrVisible: qrImages.every((image) => image.complete && image.naturalWidth > 0),
    };
  });

  if (results.title !== "WeAreDevelopers Bengaluru — Copilot Workshop") {
    throw new Error(`${name}: unexpected title`);
  }
  if (results.overflow > 1) {
    throw new Error(`${name}: page has ${results.overflow}px horizontal overflow`);
  }
  if (!results.qrVisible) {
    throw new Error(`${name}: at least one QR image did not load`);
  }
  if (results.violations.length) {
    throw new Error(`${name}: accessibility violations: ${JSON.stringify(results.violations)}`);
  }

  if (viewport.width <= 620) {
    const menu = page.getByRole("button", { name: "Menu" });
    await menu.click();
    if ((await menu.getAttribute("aria-expanded")) !== "true") {
      throw new Error("mobile: navigation did not expand");
    }
    await page.getByRole("link", { name: "01 Setup" }).click();
  }

  const checkbox = page.locator("#check-account");
  await checkbox.check();
  await page.reload({ waitUntil: "networkidle" });
  if (!(await checkbox.isChecked())) {
    throw new Error(`${name}: checklist progress did not persist`);
  }
  await checkbox.uncheck();

  await page.screenshot({ path: path.join(screenshots, `${name}.png`), fullPage: true });
  await page.close();
  return results;
}

server.listen(0, "127.0.0.1", async () => {
  const { port } = server.address();
  let browser;
  try {
    const executablePath =
      process.platform === "win32"
        ? "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
        : undefined;
    browser = await chromium.launch({ executablePath, headless: true });
    fs.mkdirSync(screenshots, { recursive: true });
    const results = await Promise.all([
      checkViewport(browser, port, "mobile", { width: 390, height: 844 }),
      checkViewport(browser, port, "laptop", { width: 1440, height: 900 }),
      checkViewport(browser, port, "projector", { width: 1920, height: 1080 }),
    ]);
    console.log(
      `Rendered ${results.length} viewports with no WCAG A/AA violations or horizontal overflow.`,
    );
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    server.close();
  }
});
