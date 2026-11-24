import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import http from "node:http";
import path from "node:path";

const root = path.join(process.cwd(), "site");
const mime = { ".css": "text/css", ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".png": "image/png" };
const server = http.createServer(async (request, response) => {
  const pathname = new URL(request.url, "http://localhost").pathname;
  const relative = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const file = path.resolve(root, relative);
  if (!file.startsWith(`${root}${path.sep}`)) {
    response.writeHead(403).end("Forbidden");
    return;
  }
  try {
    const info = await stat(file);
    if (!info.isFile()) throw new Error("Not a file");
    response.writeHead(200, { "Content-Type": mime[path.extname(file)] || "application/octet-stream" });
    createReadStream(file).pipe(response);
  } catch {
    response.writeHead(404).end("Not found");
  }
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const { port } = server.address();
try {
  const checks = [
    ["/", "GitHub Copilot Enterprise is active for your account"],
    ["/styles.css", "@layer"],
    ["/app.js", "localStorage"],
    ["/event-config.json", "hackathon-blue-tuna-19"],
    ["/assets/qr/join.png", ""],
  ];
  for (const [url, expected] of checks) {
    const response = await fetch(`http://127.0.0.1:${port}${url}`);
    const body = await response.text();
    if (!response.ok || (expected && !body.includes(expected))) throw new Error(`${url} smoke check failed (${response.status})`);
  }
  console.log(`Smoke checked ${checks.length} local assets on port ${port}`);
} finally {
  server.close();
}
