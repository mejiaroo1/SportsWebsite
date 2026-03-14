function toScore(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function normalizeGame(raw = {}) {
  return {
    id: raw.idEvent ?? null,
    date: raw.dateEvent ?? null,
    time: raw.strTime ?? null,
    homeTeam: {
      id: raw.idHomeTeam ?? null,
      name: raw.strHomeTeam ?? null,
      score: toScore(raw.intHomeScore),
    },
    awayTeam: {
      id: raw.idAwayTeam ?? null,
      name: raw.strAwayTeam ?? null,
      score: toScore(raw.intAwayScore),
    },
    status: raw.strStatus ?? null,
    league: raw.strLeague ?? null,
    season: raw.strSeason ?? null,
  };
}
