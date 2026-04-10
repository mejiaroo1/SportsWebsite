import { ApiClientError, fetchFromSportsApi } from "../../../lib/apiClient.js";
import { fail, ok } from "../../../lib/apiResponse.js";
import { normalizePlayer } from "../../../lib/normalizePlayer.js";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const teamId = String(searchParams.get("teamId") || searchParams.get("teamld") || "").trim();

    if (!teamId) {
      return fail("Missing required query param: teamId", 400);
    }

    const data = await fetchFromSportsApi(`/lookup/players/${encodeURIComponent(teamId)}`);
    const rawPlayers = data?.player || data?.players || data?.data || [];

    const players = rawPlayers
      .map(normalizePlayer)
      .filter((player) => player.id && player.name);

    return ok(players);
  } catch (error) {
    if (error instanceof ApiClientError) {
      return fail(error.message, error.status, error.details);
    }
    return fail("Unexpected server error while loading players.", 500);
  }
}
