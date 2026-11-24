import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import QRCode from "qrcode";
import { event } from "../event.config.js";

const root = process.cwd();
const source = path.join(root, "src");
const output = path.join(root, "site");

await rm(output, { recursive: true, force: true });
await mkdir(path.join(output, "assets", "qr"), { recursive: true });

let html = await readFile(path.join(source, "index.html"), "utf8");
for (const [key, value] of Object.entries(event.urls)) {
  html = html.replaceAll(`{{${key}}}`, value);
}
html = html
  .replaceAll("{{name}}", event.name)
  .replaceAll("{{title}}", event.title)
  .replaceAll("{{dateLabel}}", event.dateLabel);

if (html.includes("{{")) {
  throw new Error("Build output contains unresolved template values");
}

await Promise.all([
  writeFile(path.join(output, "index.html"), html),
  copyFile(path.join(source, "styles.css"), path.join(output, "styles.css")),
  copyFile(path.join(source, "app.js"), path.join(output, "app.js")),
  writeFile(
    path.join(output, "event-config.json"),
    `${JSON.stringify({ name: event.name, title: event.title, dateLabel: event.dateLabel, urls: event.urls }, null, 2)}\n`,
  ),
]);

await Promise.all(
  Object.entries(event.qr).map(([name, configKey]) =>
    QRCode.toFile(path.join(output, "assets", "qr", `${name}.png`), event.urls[configKey], {
      type: "png",
      errorCorrectionLevel: "M",
      margin: 3,
      width: 520,
      color: { dark: "#111827ff", light: "#ffffffff" },
    }),
  ),
);

console.log(`Built ${output}`);
