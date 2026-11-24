const fs = require("node:fs");
const path = require("node:path");
const jsQR = require("jsqr");
const { PNG } = require("pngjs");
const config = require("../config.js");

const expected = {
  "portal.png": config.portal,
  "workshop-join.png": config.workshopJoin,
  "alt-lab-1.png": config.altLab1,
  "alt-lab-2.png": config.altLab2,
};

for (const [file, url] of Object.entries(expected)) {
  const image = PNG.sync.read(fs.readFileSync(path.join(__dirname, "..", "assets", file)));
  const decoded = jsQR(new Uint8ClampedArray(image.data), image.width, image.height);
  if (!decoded) throw new Error(`${file} could not be decoded.`);
  if (decoded.data !== url) {
    throw new Error(`${file} decoded to an unexpected URL: ${decoded.data}`);
  }
}

console.log(`Decoded and verified ${Object.keys(expected).length} QR PNG assets.`);
