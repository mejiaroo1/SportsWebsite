function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function normalizeTeam(raw = {}) {
  return {
    id: raw.idTeam ?? null,
    name: raw.strTeam ?? null,
    abbrev: raw.strTeamShort ?? raw.strTeam ?? null,
    logo: raw.strBadge ?? raw.strLogo ?? null,
    league: raw.strLeague ?? null,
    sport: raw.strSport ?? null,
    country: raw.strCountry ?? null,
    stadium: raw.strStadium ?? null,
    foundedYear: toNumber(raw.intFormedYear),
    description: raw.strDescriptionEN ?? null,
  };
}

export function normalizeTeamDetails(raw = {}) {
  const team = normalizeTeam(raw);
  return {
    ...team,
    website: raw.strWebsite ?? null,
    facebook: raw.strFacebook ?? null,
    instagram: raw.strInstagram ?? null,
    twitter: raw.strTwitter ?? null,
  };
}
