// src/api/games.js
import { fetchFromSportsDB } from "../lib/apiClient.js";

/**
 * Fetches live scores for a specific sport.
 * @param {string} sport - The name of the sport (e.g., 'Soccer', 'Basketball')
 */
export async function getLiveScores(sport) {
    // v2: /livescore/{sport}
    return await fetchFromSportsDB(`/livescore/${encodeURIComponent(String(sport).toLowerCase())}`);
}

/**
 * Fetches recent/past events for a league.
 * @param {string|number} leagueId - The league ID
 */
export async function getLeagueRecentEvents(leagueId) {
    // v2: /schedule/previous/league/{idLeague}
    const data = await fetchFromSportsDB(`/schedule/previous/league/${leagueId}`);
    return { events: data?.events || data?.schedule || data?.results || [] };
}

/**
 * Fetches upcoming events for a league.
 * @param {string|number} leagueId - The league ID
 */
export async function getLeagueUpcomingEvents(leagueId) {
    // v2: /schedule/next/league/{idLeague}
    const data = await fetchFromSportsDB(`/schedule/next/league/${leagueId}`);
    return { events: data?.events || data?.schedule || data?.results || [] };
}

/**
 * Fetches recent/past events for a team.
 * @param {string|number} teamId - The team ID
 */
export async function getTeamRecentEvents(teamId) {
    const data = await fetchFromSportsDB(`/schedule/previous/team/${teamId}`);
    return { events: data?.events || data?.schedule || data?.results || [] };
}

/**
 * Fetches upcoming events for a team.
 * @param {string|number} teamId - The team ID
 */
export async function getTeamUpcomingEvents(teamId) {
    const data = await fetchFromSportsDB(`/schedule/next/team/${teamId}`);
    return { events: data?.events || data?.schedule || data?.results || [] };
}