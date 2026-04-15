export function normalizePlayer(raw = {}) {
  return {
    id: raw.idPlayer || raw.id || raw.player_id || "",
    name: raw.strPlayer || raw.name || raw.player_name || "",
    teamId: raw.idTeam || raw.teamId || raw.team_id || "",
    position: raw.strPosition || raw.position || "",
  };
}
