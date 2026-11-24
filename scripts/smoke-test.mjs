import { createReadStream } from "node:fs";
import { access, stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, resolve, sep } from "node:path";

const root = resolve(import.meta.dirname, "../dist");
await access(root);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? "/", "http://127.0.0.1");
    const pathname = decodeURIComponent(url.pathname);
    const relative = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
    const file = resolve(root, relative);
    if (file !== root && !file.startsWith(`${root}${sep}`)) throw new Error("Invalid path");
    const info = await stat(file);
    if (!info.isFile()) throw new Error("Not a file");
    response.writeHead(200, { "content-type": contentTypes[extname(file)] ?? "application/octet-stream" });
    createReadStream(file).pipe(response);
  } catch {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
});

await new Promise((resolveReady) => server.listen(0, "127.0.0.1", resolveReady));
const { port } = server.address();
const base = `http://127.0.0.1:${port}`;

try {
  const required = [
    "/",
    "/styles.css",
    "/app.js",
    "/event-config.js",
    "/assets/portal.png",
    "/assets/join.png",
    "/assets/alternate-lab-1.png",
    "/assets/alternate-lab-2.png",
  ];
  for (const path of required) {
    const response = await fetch(`${base}${path}`);
    assertResponse(response, path);
  }

  const html = await (await fetch(base)).text();
  const localResources = [
    ...html.matchAll(/(?:src|href)="([^"]+)"/g),
  ]
    .map((match) => match[1])
    .filter((url) => !url.startsWith("#") && !url.startsWith("https:") && !url.startsWith("mailto:"));
  for (const resource of localResources) {
    assertResponse(await fetch(new URL(resource, base)), resource);
  }

  const deployed = await fetch(`${base}/event-config.js`).then((response) => response.text());
  if (!deployed.includes("dhruv-maker-og.github.io")) throw new Error("Built config is incomplete");
  console.log(`Smoke test passed for ${required.length} critical resources on ${base}`);
} finally {
  server.close();
}

function assertResponse(response, path) {
  if (!response.ok) throw new Error(`${path} returned ${response.status}`);
}
