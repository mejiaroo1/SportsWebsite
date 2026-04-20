import fs from "node:fs";
import path from "node:path";
import process from "node:process";

/**
 * Generate ONE image (cost control).
 *
 * Usage:
 *   PowerShell: $env:GEMINI_API_KEY="..."
 *   node scripts/generateLeagueImage.mjs 4443 "UFC"
 *
 * Output:
 *   public/league-images/<leagueId>.png
 */

export async function generateLeagueImage({ leagueId, leagueName, outPath }) {
  const id = String(leagueId || "").trim();
  const name = String(leagueName || "").trim();

  if (!id || !/^\d+$/.test(id)) {
    throw new Error('Missing/invalid leagueId (e.g. "4443").');
  }
  if (!name) {
    throw new Error('Missing leagueName (e.g. "UFC").');
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY env var.");
  }

  const MODEL = "gemini-3.1-flash-image-preview";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

  // StatMuse-like: clean, minimal, card-friendly illustration (no logos/text).
  const prompt = [
    `Create a clean, minimal sports card banner illustration that represents "${name}" without using any official logos or text.`,
    "Style: modern web-app card art, like StatMuse hero cards: simple shapes, crisp edges, tasteful gradients, subtle grain, high contrast.",
    "Subject: abstract sports energy + 1-2 generic sports elements (e.g. ball, gloves, rink lines, goal net), but keep it non-branded.",
    "Composition: centered focal element, lots of negative space, no clutter.",
    "Background: smooth gradient (2-3 colors), soft glow behind subject.",
    "Constraints: NO text, NO letters, NO numbers, NO watermarks, NO real faces, NO team/league logos.",
    "Output: 16:9, suitable as a website card image.",
  ].join(" ");

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "x-goog-api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Gemini error ${res.status}: ${text.slice(0, 400)}`);
  }

  const json = await res.json();
  const parts = json?.candidates?.[0]?.content?.parts || [];
  const inline = parts.find((p) => p?.inlineData?.data);

  if (!inline?.inlineData?.data) {
    throw new Error("No inline image data returned from Gemini.");
  }

  const buffer = Buffer.from(inline.inlineData.data, "base64");
  const dir = path.dirname(outPath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(outPath, buffer);

  return { outPath, prompt };
}

async function main() {
  const [leagueIdRaw, leagueNameRaw] = process.argv.slice(2);
  const leagueId = String(leagueIdRaw || "").trim();
  const leagueName = String(leagueNameRaw || "").trim();

  if (!leagueId || !/^\d+$/.test(leagueId)) {
    console.error(
      'Missing/invalid leagueId. Example: node scripts/generateLeagueImage.mjs 4443 "UFC"'
    );
    process.exit(1);
  }

  if (!leagueName) {
    console.error(
      'Missing leagueName. Example: node scripts/generateLeagueImage.mjs 4443 "UFC"'
    );
    process.exit(1);
  }

  const outPath = path.join(
    process.cwd(),
    "public",
    "league-images",
    `${leagueId}.png`
  );

  try {
    const { prompt } = await generateLeagueImage({ leagueId, leagueName, outPath });
    console.log(`Saved: ${outPath}`);
    console.log(`Prompt: ${prompt}`);
  } catch (err) {
    console.error(String(err?.message || err));
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await main();
}

