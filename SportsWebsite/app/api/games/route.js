import { ApiClientError, fetchFromSportsApi } from "../../../lib/apiClient.js";
import { fail, ok } from "../../../lib/apiResponse.js";
import { resolveLeague } from "../../../lib/leagueMap.js";
import { normalizeGame } from "../../../lib/normalizeGame.js";

function isValidDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function matchesDate(gameDate, targetDate) {
  if (!gameDate) {
    return false;
  }
  return String(gameDate).slice(0, 10) === targetDate;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = String(searchParams.get("date") || "").trim();
    const leagueInput = String(searchParams.get("league") || "").trim();

    if (!date) {
      return fail("Missing required query param: date", 400);
    }
    if (!isValidDate(date)) {
      return fail("date must be in YYYY-MM-DD format", 400);
    }
    if (!leagueInput) {
      return fail("Missing required query param: league", 400);
    }

    const league = resolveLeague(leagueInput);

    let rawGames = [];
    if (league.id) {
      const [previous, next] = await Promise.all([
        fetchFromSportsApi(`/schedule/previous/league/${league.id}`),
        fetchFromSportsApi(`/schedule/next/league/${league.id}`),
      ]);

      rawGames = [
        ...(previous?.events || previous?.schedule || previous?.results || []),
        ...(next?.events || next?.schedule || next?.results || []),
      ];
    } else {
      const fallback = await fetchFromSportsApi(`/search/event/${encodeURIComponent(league.name)}`);
      rawGames = fallback?.events || fallback?.event || fallback?.data || [];
    }

    const games = rawGames
      .map(normalizeGame)
      .filter((game) => game.id)
      .filter((game) => matchesDate(game.date, date));

    return ok(games);
  } catch (error) {
    if (error instanceof ApiClientError) {
      return fail(error.message, error.status, error.details);
    }
    return fail("Unexpected server error while loading games.", 500);
  }
}
