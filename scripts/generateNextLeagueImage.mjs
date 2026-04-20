import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { generateLeagueImage } from "./generateLeagueImage.mjs";

/**
 * Auto-generate ONE missing league image per run.
 *
 * It parses featured leagues from `src/homepage.jsx`:
 * - DEFAULT_LEAGUES
 * - COLLEGE_LEAGUES
 *
 * Then it finds the first league without:
 *   public/league-images/<id>.png
 *
 * Rate limit:
 * - Writes `.cache/league-image-gen.json`
 * - Refuses to run again within a cooldown window unless you set FORCE=1
 *
 * Usage (PowerShell):
 *   $env:GEMINI_API_KEY="..."
 *   node scripts/generateNextLeagueImage.mjs
 *
 * Optional:
 *   $env:FORCE="1"                            # bypass cooldown
 *   $env:LEAGUE_IMAGE_COOLDOWN_SECONDS="60"   # default 60
 */

const ROOT = process.cwd();
const homepagePath = path.join(ROOT, "src", "homepage.jsx");
const outDir = path.join(ROOT, "public", "league-images");
const cacheDir = path.join(ROOT, ".cache");
const cachePath = path.join(cacheDir, "league-image-gen.json");

function readCooldownSeconds() {
  const raw = process.env.LEAGUE_IMAGE_COOLDOWN_SECONDS;
  const n = Number(raw ?? 60);
  return Number.isFinite(n) && n >= 0 ? n : 60;
}

function shouldBlockByCooldown() {
  if (process.env.FORCE === "1") return { blocked: false };
  if (!fs.existsSync(cachePath)) return { blocked: false };
  try {
    const json = JSON.parse(fs.readFileSync(cachePath, "utf8"));
    const lastAt = Number(json?.lastGeneratedAtMs);
    if (!Number.isFinite(lastAt)) return { blocked: false };
    const cooldownMs = readCooldownSeconds() * 1000;
    const now = Date.now();
    const remainingMs = lastAt + cooldownMs - now;
    if (remainingMs > 0) {
      return {
        blocked: true,
        remainingSeconds: Math.ceil(remainingMs / 1000),
        lastLeagueId: json?.lastLeagueId,
      };
    }
    return { blocked: false };
  } catch {
    return { blocked: false };
  }
}

function writeCooldown({ leagueId, leagueName }) {
  fs.mkdirSync(cacheDir, { recursive: true });
  fs.writeFileSync(
    cachePath,
    JSON.stringify(
      {
        lastGeneratedAtMs: Date.now(),
        lastLeagueId: String(leagueId),
        lastLeagueName: String(leagueName),
      },
      null,
      2
    )
  );
}

function extractFeaturedLeagues(source, constName) {
  const start = source.indexOf(`const ${constName} = [`);
  if (start === -1) return [];
  const afterStart = source.slice(start);
  const end = afterStart.indexOf("];");
  if (end === -1) return [];
  const block = afterStart.slice(0, end);

  const leagues = [];
  // Very small “good enough” parser for lines like:
  // { id: 4443, title: "UFC", sport: "Combat" },
  const re = /\{\s*id:\s*(\d+)\s*,\s*title:\s*"([^"]+)"[^}]*\}/g;
  let m;
  while ((m = re.exec(block))) {
    leagues.push({ id: Number(m[1]), title: m[2] });
  }
  return leagues;
}

async function main() {
  const cooldown = shouldBlockByCooldown();
  if (cooldown.blocked) {
    console.log(
      `Cooldown active: wait ${cooldown.remainingSeconds}s before generating another image (set FORCE=1 to bypass).`
    );
    process.exit(0);
  }

  if (!fs.existsSync(homepagePath)) {
    console.error(`Missing file: ${homepagePath}`);
    process.exit(1);
  }

  const source = fs.readFileSync(homepagePath, "utf8");
  const featured = [
    ...extractFeaturedLeagues(source, "DEFAULT_LEAGUES"),
    ...extractFeaturedLeagues(source, "COLLEGE_LEAGUES"),
  ];

  // de-dupe by id, keep first occurrence
  const seen = new Set();
  const leagues = featured.filter((l) => {
    if (seen.has(l.id)) return false;
    seen.add(l.id);
    return true;
  });

  if (!leagues.length) {
    console.log("No featured leagues found in src/homepage.jsx.");
    process.exit(0);
  }

  fs.mkdirSync(outDir, { recursive: true });

  const next = leagues.find((l) => !fs.existsSync(path.join(outDir, `${l.id}.png`)));
  if (!next) {
    console.log("All featured leagues already have images.");
    process.exit(0);
  }

  const outPath = path.join(outDir, `${next.id}.png`);
  const { prompt } = await generateLeagueImage({
    leagueId: next.id,
    leagueName: next.title,
    outPath,
  });

  writeCooldown({ leagueId: next.id, leagueName: next.title });

  console.log(`Generated 1 image: ${outPath}`);
  console.log(`League: ${next.title} (${next.id})`);
  console.log(`Prompt: ${prompt}`);
}

main().catch((err) => {
  console.error(String(err?.message || err));
  process.exit(1);
});

