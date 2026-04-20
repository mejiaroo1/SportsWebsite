import { fetchFromSportsDB } from "../lib/apiClient.js";

function normalizeKey(query) {
  return String(query)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function toSlugUnderscore(query) {
  return String(query)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "_");
}

function toSlugNoSpaces(query) {
  return String(query)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

const LEAGUE_ALIASES = {
  // Soccer
  laliga: ["LaLiga", "La Liga", "Spanish La Liga"],
  // Basketball
  gleague: ["NBA G League", "G League", "G-League", "NBA Development League"],
};

async function searchWithSlugs(endpointBase, slugs, idKey) {
  const results = [];
  const seen = new Set();

  const responses = await Promise.all(
    slugs.map(async (slug) => {
      const data = await fetchFromSportsDB(
        `/${endpointBase}/${encodeURIComponent(slug)}`
      );
      return data?.search || [];
    })
  );

  for (const arr of responses) {
    for (const item of arr) {
      const id = item?.[idKey];
      if (!id || seen.has(id)) continue;
      seen.add(id);
      results.push(item);
    }
  }

  return results;
}

export async function searchLeagues(query) {
  if (!query) return [];
  const base = String(query).trim();
  const key = normalizeKey(base);
  const aliasQueries = LEAGUE_ALIASES[key] || [];

  // Try a few variants because TheSportsDB search is sensitive to formatting:
  // - underscores (most common)
  // - no-spaces (helps "La Liga" -> "laliga")
  // - a couple known aliases (helps "G league" -> "NBA G League")
  const candidateStrings = [base, ...aliasQueries];
  const slugs = [
    ...new Set(
      candidateStrings
        .flatMap((q) => [toSlugUnderscore(q), toSlugNoSpaces(q)])
        .filter(Boolean)
        .slice(0, 6) // keep requests bounded
    ),
  ];

  return await searchWithSlugs("search/league", slugs, "idLeague");
}

export async function searchTeams(query) {
  if (!query) return [];
  const base = String(query).trim();
  const slugs = [...new Set([toSlugUnderscore(base), toSlugNoSpaces(base)].filter(Boolean))];
  return await searchWithSlugs("search/team", slugs.slice(0, 2), "idTeam");
}

export async function searchPlayers(query) {
  if (!query) return [];
  const base = String(query).trim();
  const slugs = [...new Set([toSlugUnderscore(base), toSlugNoSpaces(base)].filter(Boolean))];
  return await searchWithSlugs("search/player", slugs.slice(0, 2), "idPlayer");
}