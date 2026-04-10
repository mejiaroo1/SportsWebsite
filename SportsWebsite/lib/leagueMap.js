const LEAGUE_MAP = {
  nba: { code: "nba", name: "NBA", id: "4387", sport: "basketball" },
  nfl: { code: "nfl", name: "NFL", id: "4391", sport: "american football" },
  mlb: { code: "mlb", name: "MLB", id: "4424", sport: "baseball" },
  nhl: { code: "nhl", name: "NHL", id: "4380", sport: "ice hockey" },
  epl: { code: "epl", name: "English Premier League", id: "4328", sport: "soccer" },
};

export function resolveLeague(input = "") {
  const key = String(input).trim().toLowerCase();
  if (!key) {
    return null;
  }

  if (LEAGUE_MAP[key]) {
    return LEAGUE_MAP[key];
  }

  return { code: key, name: input, id: "", sport: "" };
}
