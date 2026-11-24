import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import QRCode from "qrcode";

const root = resolve(import.meta.dirname, "..");
const source = resolve(root, "src");
const output = resolve(root, "dist");
const config = JSON.parse(await readFile(resolve(root, "event.config.json"), "utf8"));

const required = [
  "portal",
  "windowsApp",
  "appDocs",
  "join",
  "organization",
  "lab1",
  "alternateLab1",
  "lab2",
  "alternateLab2",
];

for (const key of required) {
  const value = config[key];
  if (typeof value !== "string" || !value.startsWith("https://")) {
    throw new Error(`event.config.json: ${key} must be an HTTPS URL`);
  }
}

await rm(output, { recursive: true, force: true });
await mkdir(resolve(output, "assets"), { recursive: true });
await cp(source, output, { recursive: true });
await writeFile(
  resolve(output, "event-config.js"),
  `window.EVENT_CONFIG = Object.freeze(${JSON.stringify(config)});\n`,
);

const qrTargets = {
  "portal.png": config.portal,
  "join.png": config.join,
  "alternate-lab-1.png": config.alternateLab1,
  "alternate-lab-2.png": config.alternateLab2,
};

await Promise.all(
  Object.entries(qrTargets).map(([name, url]) =>
    QRCode.toFile(resolve(output, "assets", name), url, {
      type: "png",
      width: 720,
      margin: 4,
      errorCorrectionLevel: "M",
      color: { dark: "#08111d", light: "#ffffff" },
    }),
  ),
);

console.log(`Built ${output}`);
