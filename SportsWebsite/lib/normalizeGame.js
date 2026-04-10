export function normalizeGame(raw = {}) {
  const homeTeam = raw.strHomeTeam || raw.homeTeam || raw.home || "";
  const awayTeam = raw.strAwayTeam || raw.awayTeam || raw.away || "";

  return {
    id: raw.idEvent || raw.id || raw.game_id || "",
    date: raw.dateEvent || raw.strTimestamp || raw.date || "",
    homeTeam,
    awayTeam,
    score: {
      home: raw.intHomeScore ?? raw.homeScore ?? null,
      away: raw.intAwayScore ?? raw.awayScore ?? null,
    },
    status: raw.strStatus || raw.status || "",
  };
}
