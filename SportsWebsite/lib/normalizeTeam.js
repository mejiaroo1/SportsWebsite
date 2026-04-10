export function normalizeTeam(raw = {}) {
  return {
    id: raw.idTeam || raw.id || raw.team_id || "",
    name: raw.strTeam || raw.name || raw.team_name || "",
    abbrev: raw.strTeamShort || raw.strTeamAlternate || raw.abbrev || "",
    logo: raw.strBadge || raw.strLogo || raw.logo || "",
  };
}
