/** Canonical key for matching team.strTeam to curated roster maps. */
export function normalizeTeamKey(str) {
  return String(str || "")
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}
