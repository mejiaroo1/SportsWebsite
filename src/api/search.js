import { fetchFromSportsDB } from "../lib/apiClient";

function toSlug(query) {
  return String(query)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "_");
}

export async function searchLeagues(query) {
  if (!query) return [];
  const slug = toSlug(query);
  const data = await fetchFromSportsDB(`/search/league/${encodeURIComponent(slug)}`);
  return data?.search || [];
}

export async function searchTeams(query) {
  if (!query) return [];
  const slug = toSlug(query);
  const data = await fetchFromSportsDB(`/search/team/${encodeURIComponent(slug)}`);
  return data?.search || [];
}

export async function searchPlayers(query) {
  if (!query) return [];
  const slug = toSlug(query);
  const data = await fetchFromSportsDB(`/search/player/${encodeURIComponent(slug)}`);
  return data?.search || [];
}