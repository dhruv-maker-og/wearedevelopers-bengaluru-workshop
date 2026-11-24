const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");

const root = path.join(__dirname, "..", "dist");
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

server.listen(0, "127.0.0.1", async () => {
  const { port } = server.address();
  try {
    const checks = ["/", "/styles.css", "/app.js", "/config.js", "/assets/workshop-join.png"];
    const responses = await Promise.all(
      checks.map((pathname) => fetch(`http://127.0.0.1:${port}${pathname}`)),
    );
    responses.forEach((response) => assert.equal(response.status, 200));
    const page = await responses[0].text();
    assert.match(page, /WeAreDevelopers Bengaluru/);
    assert.match(page, /assets\/workshop-join\.png/);
    console.log(`Local smoke test passed on port ${port}.`);
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    server.close();
  }
});
