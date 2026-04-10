import { ApiClientError, fetchFromSportsApi } from "../../../lib/apiClient.js";
import { fail, ok } from "../../../lib/apiResponse.js";
import { resolveLeague } from "../../../lib/leagueMap.js";
import { normalizeTeam } from "../../../lib/normalizeTeam.js";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sport = String(searchParams.get("sport") || "").trim().toLowerCase();
    const leagueInput = String(searchParams.get("league") || "").trim();

    if (!leagueInput) {
      return fail("Missing required query param: league", 400);
    }

    const league = resolveLeague(leagueInput);
    const data = await fetchFromSportsApi(`/search/team/${encodeURIComponent(league.name)}`);

    const rawTeams = data?.teams || data?.team || data?.data || [];
    const teams = rawTeams
      .map(normalizeTeam)
      .filter((team) => team.id && team.name)
      .filter(() => !sport || !league.sport || sport === league.sport);

    return ok(teams);
  } catch (error) {
    if (error instanceof ApiClientError) {
      return fail(error.message, error.status, error.details);
    }
    return fail("Unexpected server error while loading teams.", 500);
  }
}
