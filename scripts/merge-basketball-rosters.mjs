/**
 * After `node scripts/emit-basketball-append.mjs`, run this to splice
 * `basketballCuratedRosters.rest.js` after the WNBA block in
 * `src/data/basketballCuratedRosters.js` (everything before the first
 * `\\n/** China CBA` marker is kept).
 */
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const mainPath = join(root, "src/data/basketballCuratedRosters.js");
const restPath = join(root, "src/data/basketballCuratedRosters.rest.js");

const main = fs.readFileSync(mainPath, "utf8");
const marker = "\n/** China CBA";
const i = main.indexOf(marker);
if (i === -1) {
  console.error("Marker not found:", marker);
  process.exit(1);
}
const head = main.slice(0, i);
const rest = fs.readFileSync(restPath, "utf8");
fs.writeFileSync(mainPath, `${head}\n${rest}`);
console.log("Merged", restPath, "into", mainPath);
