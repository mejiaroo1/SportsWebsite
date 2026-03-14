export function normalizePlayer(raw = {}) {
  const first = raw.strFirstName ?? "";
  const last = raw.strLastName ?? "";
  const fallbackName = `${first} ${last}`.trim() || null;

  return {
    id: raw.idPlayer ?? null,
    name: raw.strPlayer ?? fallbackName,
    teamId: raw.idTeam ?? null,
    position: raw.strPosition ?? null,
    number: raw.strNumber ?? null,
    nationality: raw.strNationality ?? null,
    thumb: raw.strThumb ?? null,
    cutout: raw.strCutout ?? null,
    height: raw.strHeight ?? null,
    weight: raw.strWeight ?? null,
    birthDate: raw.dateBorn ?? null,
  };
}
