const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const output = path.join(root, "dist");
const publicFiles = ["index.html", "styles.css", "app.js", "config.js", "assets"];

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });

for (const file of publicFiles) {
  fs.cpSync(path.join(root, file), path.join(output, file), { recursive: true });
}

const config = require(path.join(root, "config.js"));
for (const [name, url] of Object.entries(config)) {
  if (!/^https:\/\/[^\s]+$/.test(url)) {
    throw new Error(`Invalid HTTPS URL for ${name}`);
  }
}

console.log(`Built static portal in ${path.relative(root, output)}.`);
