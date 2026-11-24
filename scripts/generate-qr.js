const fs = require("node:fs");
const path = require("node:path");
const QRCode = require("qrcode");
const config = require("../config.js");

const root = path.resolve(__dirname, "..");
const output = path.join(root, "assets");
const targets = {
  "portal": config.portal,
  "workshop-join": config.workshopJoin,
  "alt-lab-1": config.altLab1,
  "alt-lab-2": config.altLab2,
};

async function generate() {
  fs.mkdirSync(output, { recursive: true });
  await Promise.all(
    Object.entries(targets).flatMap(([name, url]) => {
      const options = {
        errorCorrectionLevel: "M",
        margin: 4,
        color: { dark: "#151515", light: "#fffdf7" },
      };
      return [
        QRCode.toFile(path.join(output, `${name}.png`), url, {
          ...options,
          type: "png",
          width: 1000,
        }),
        QRCode.toFile(path.join(output, `${name}.svg`), url, {
          ...options,
          type: "svg",
          width: 1000,
        }),
      ];
    }),
  );
  console.log(`Generated ${Object.keys(targets).length} PNG/SVG QR pairs from config.js.`);
}

generate().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
