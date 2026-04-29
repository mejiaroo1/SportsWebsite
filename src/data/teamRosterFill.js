/**
 * Roster helpers: filter API rows to the current team, optional curated fill
 * when the API has no roster, and search disambiguation for curated rows.
 */

import {
  NBA_CURATED_BY_TEAM_KEY,
  isMainNbaTeam,
} from "./nbaCuratedRosters.js";
import { getNonNbaBasketballCuratedRoster } from "./basketballCuratedRosters.js";
import { getNflCuratedRoster } from "./nflCuratedRosters.js";
import { getMlbCuratedRoster } from "./mlbCuratedRosters.js";
import { getNhlCuratedRoster } from "./nhlCuratedRosters.js";
import { getInternationalBaseballCuratedRoster } from "./internationalBaseballCuratedRosters.js";
import { getSoccerCuratedRoster } from "./soccerCuratedRosters.js";
import { getRugbyCricketCuratedRoster } from "./rugbyCricketCuratedRosters.js";
import { normalizeTeamKey } from "./normalizeTeamKey.js";

export { normalizeTeamKey } from "./normalizeTeamKey.js";
const TEAM_NAME_FALLBACK_COUNT = 10;

function isCombatTeam(team) {
  const sport = String(team?.strSport ?? "").toLowerCase();
  const league = String(team?.strLeague ?? "").toLowerCase();
  return (
    sport.includes("combat") ||
    sport.includes("mma") ||
    sport.includes("boxing") ||
    sport.includes("wrestling") ||
    league.includes("ufc") ||
    league.includes("bellator")
  );
}

function teamTag(teamName) {
  const words = String(teamName || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return "Team";
  const tail = words.slice(-2).join(" ");
  return tail.length > 1 ? tail : words[0];
}

function buildTeamNamedFallback(team, count = TEAM_NAME_FALLBACK_COUNT) {
  const label = teamTag(team?.strTeam);
  const out = [];
  for (let i = 1; i <= count; i += 1) {
    out.push({
      strPlayer: `${label} Player ${i}`,
      strPosition: "—",
    });
  }
  return out;
}

/**
 * Fill missing idTeam / strTeam on roster rows using the team page context
 * (same id as /list/players/{id}). Stops false negatives in playerBelongsToTeam
 * when the API omits team fields on each player.
 */
export function enrichRosterRowsWithTeamContext(apiPlayers, team) {
  if (!team || !Array.isArray(apiPlayers)) return apiPlayers || [];
  const tid = String(team.idTeam ?? "").trim();
  const tname = String(team.strTeam ?? "").trim();
  return apiPlayers.map((p) => {
    const out = { ...p };
    if (tid && !String(out.idTeam ?? "").trim()) out.idTeam = tid;
    if (tname && !String(out.strTeam ?? "").trim()) out.strTeam = tname;
    return out;
  });
}

/**
 * True if a player row from /list/players (or search) should count as this team.
 * Rows from list/players often omit idTeam/strTeam — then we trust the endpoint.
 */
export function playerBelongsToTeam(player, team) {
  if (!player || !team) return false;
  if (!String(player.strPlayer || player.idPlayer || "").trim()) return false;

  const tid = String(team.idTeam ?? "").trim();
  const pidTeam = String(player.idTeam ?? "").trim();
  if (pidTeam && tid && pidTeam !== tid) return false;

  const pTeamRaw = String(player.strTeam || "").trim();
  if (pTeamRaw) {
    const tKey = normalizeTeamKey(team.strTeam);
    const pKey = normalizeTeamKey(pTeamRaw);
    if (tKey && pKey && tKey !== pKey && !tKey.includes(pKey) && !pKey.includes(tKey))
      return false;
  }
  return true;
}

/**
 * Pick a search hit that matches this team when possible (name + team).
 * @param {object[]} players from searchPlayers
 * @param {object} team lookup row
 * @param {string} playerName display / curated name
 */
export function pickPlayerSearchResult(players, team, playerName) {
  if (!Array.isArray(players) || players.length === 0) return null;
  const want = String(playerName || "").trim().toLowerCase();
  const tid = String(team?.idTeam ?? "").trim();
  const tKey = normalizeTeamKey(team?.strTeam);

  const nameEq = (pl) =>
    String(pl?.strPlayer || "").trim().toLowerCase() === want;

  const teamIdEq = (pl) => tid && String(pl?.idTeam ?? "").trim() === tid;
  const teamNameEq = (pl) => {
    const pKey = normalizeTeamKey(pl?.strTeam || "");
    return tKey && pKey && (pKey === tKey || tKey.includes(pKey) || pKey.includes(tKey));
  };

  return (
    players.find((pl) => nameEq(pl) && teamIdEq(pl)) ||
    players.find((pl) => nameEq(pl) && teamNameEq(pl)) ||
    players.find((pl) => nameEq(pl)) ||
    null
  );
}

/**
 * @param {object[]} apiPlayers raw from /list/players
 * @param {object} team row from /lookup/team
 * @returns {object[]} rows with strPlayer, strPosition, optional idPlayer, isRosterFill?: boolean
 */
export function buildDisplayRoster(apiPlayers, team) {
  const enriched = enrichRosterRowsWithTeamContext(
    Array.isArray(apiPlayers) ? apiPlayers : [],
    team
  );
  const raw = enriched.filter((p) => p?.strPlayer);
  const api = raw.filter((p) => playerBelongsToTeam(p, team));
  if (api.length > 0) {
    return api.map((p) => ({ ...p, isRosterFill: false }));
  }

  const tid = String(team?.idTeam ?? "").trim();
  const tname = String(team?.strTeam ?? "").trim();
  const attachTeam = (row) => ({
    ...row,
    ...(tid ? { idTeam: tid } : {}),
    ...(tname ? { strTeam: tname } : {}),
  });

  const key = normalizeTeamKey(team?.strTeam);
  const nbaCurated =
    isMainNbaTeam(team) && key ? NBA_CURATED_BY_TEAM_KEY[key] : null;
  if (nbaCurated?.length) {
    return nbaCurated.map((row) =>
      attachTeam({
        ...row,
        idPlayer: undefined,
        isRosterFill: true,
      })
    );
  }

  const otherBb = getNonNbaBasketballCuratedRoster(team);
  if (otherBb?.length) {
    return otherBb.map((row) =>
      attachTeam({
        ...row,
        idPlayer: undefined,
        isRosterFill: true,
      })
    );
  }

  const nflCurated = getNflCuratedRoster(team);
  if (nflCurated?.length) {
    return nflCurated.map((row) =>
      attachTeam({
        ...row,
        idPlayer: undefined,
        isRosterFill: true,
      })
    );
  }

  const mlbCurated = getMlbCuratedRoster(team);
  if (mlbCurated?.length) {
    return mlbCurated.map((row) =>
      attachTeam({
        ...row,
        idPlayer: undefined,
        isRosterFill: true,
      })
    );
  }

  const intlBaseballCurated = getInternationalBaseballCuratedRoster(team);
  if (intlBaseballCurated?.length) {
    return intlBaseballCurated.map((row) =>
      attachTeam({
        ...row,
        idPlayer: undefined,
        isRosterFill: true,
      })
    );
  }

  const nhlCurated = getNhlCuratedRoster(team);
  if (nhlCurated?.length) {
    return nhlCurated.map((row) =>
      attachTeam({
        ...row,
        idPlayer: undefined,
        isRosterFill: true,
      })
    );
  }

  const soccerCurated = getSoccerCuratedRoster(team);
  if (soccerCurated?.length) {
    return soccerCurated.map((row) =>
      attachTeam({
        ...row,
        idPlayer: undefined,
        isRosterFill: true,
      })
    );
  }

  const rugbyCricketCurated = getRugbyCricketCuratedRoster(team);
  if (rugbyCricketCurated?.length) {
    return rugbyCricketCurated.map((row) =>
      attachTeam({
        ...row,
        idPlayer: undefined,
        isRosterFill: true,
      })
    );
  }

  if (isCombatTeam(team)) return [];

  const generated = buildTeamNamedFallback(team);
  if (generated.length > 0) {
    return generated.map((row) =>
      attachTeam({
        ...row,
        idPlayer: undefined,
        isRosterFill: true,
      })
    );
  }

  return [];
}
