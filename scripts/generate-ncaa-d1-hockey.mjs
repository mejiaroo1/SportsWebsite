/**
 * NCAA Division I men's ice hockey programs → JSON
 * Run: node scripts/generate-ncaa-d1-hockey.mjs
 */
import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        { headers: { "User-Agent": "DataPlay/1.0 (local dev; sports fallback)" } },
        (res) => {
          let d = "";
          res.on("data", (c) => (d += c));
          res.on("end", () => resolve(d));
        }
      )
      .on("error", reject);
  });
}

function extractSchoolLabel(rowBlock) {
  const lines = rowBlock
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("|"));
  if (!lines.length) return null;
  const first = lines[0].replace(/^\|+/, "").trim();
  const sortPipe = first.match(/\{\{\s*sort\s*\|([^|]+)\|\s*\[\[([^\]|]+)(?:\|[^\]]+)?\]\]\s*\}\}/i);
  if (sortPipe) return sortPipe[2].replace(/_/g, " ").trim();
  const plain = first.match(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/);
  if (plain) {
    const target = plain[2] || plain[1];
    if (/arena|center|centre|stadium|rink/i.test(target)) return null;
    return target.replace(/_/g, " ").trim();
  }
  return null;
}

async function main() {
  const page = "List of NCAA Division I ice hockey programs";
  const url =
    "https://en.wikipedia.org/w/api.php?action=parse&page=" +
    encodeURIComponent(page) +
    "&format=json&prop=wikitext";

  const raw = await fetchText(url);
  const json = JSON.parse(raw);
  const wt = json.parse?.wikitext?.["*"];
  if (!wt) throw new Error("No wikitext");

  const programsIdx = wt.indexOf("==Programs==");
  const start = programsIdx >= 0 ? programsIdx : wt.indexOf("{| class=\"wikitable");
  const after = wt.slice(start >= 0 ? start : 0);
  const endIdx = after.search(/\n==[^=]/);
  const section = endIdx > 0 ? after.slice(0, endIdx) : after;

  const chunks = section.split(/\|-\s*\n/);
  const names = [];
  const seen = new Set();

  for (const chunk of chunks) {
    const label = extractSchoolLabel(chunk);
    if (!label || label.length < 3) continue;
    if (/^File:/i.test(label)) continue;
    const key = label.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    names.push(label);
  }

  names.sort((a, b) => a.localeCompare(b));
  const outPath = path.join(__dirname, "..", "src", "data", "ncaaD1IceHockey.generated.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(names, null, 0), "utf8");
  console.log("Wrote", outPath, "count=", names.length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
