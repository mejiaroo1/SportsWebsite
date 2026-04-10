import { fetchFromSportsDB } from "../lib/apiClient";

export async function getTeamsByLeague(leagueName) {
    // v2 doesn't use PHP endpoints. Prefer searching the league then listing teams, but keep
    // this helper as a no-op placeholder until wired to a v2 flow.
    // (Not currently used by the homepage cards.)
    return await fetchFromSportsDB(`/search/team/${encodeURIComponent(String(leagueName))}`);
}

/**
 * v2 does not provide a dedicated standings/table endpoint (see docs).
 * Keep a stable interface for the UI and return an empty table.
 */
export async function getLeagueStandings(leagueId, season) {
    void leagueId;
    void season;
    return { table: [] };
}