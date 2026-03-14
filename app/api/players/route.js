import { NextResponse } from "next/server";
import { normalizePlayer } from "../../../lib/normalizePlayer";
import { fetchSportsApi } from "../../../lib/sportsApiServerClient";

async function fetchPlayersByTeamId(teamId) {
  const attempts = [
    `/player/${teamId}`,
    `/lookup/players/team/${teamId}`,
    `/players/team/${teamId}`,
  ];

  for (const path of attempts) {
    try {
      const data = await fetchSportsApi(path);
      const players = data?.players ?? data?.player ?? data?.data;
      if (Array.isArray(players)) return players;
    } catch {
      // Try next endpoint variation.
    }
  }

  return [];
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get("teamId");

    if (!teamId) {
      return NextResponse.json(
        { status: "error", message: "Missing required query param: teamId" },
        { status: 400 }
      );
    }

    const rawPlayers = await fetchPlayersByTeamId(teamId);
    const cleanPlayers = rawPlayers.map(normalizePlayer);

    return NextResponse.json({ status: "ok", data: cleanPlayers });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: error?.message || "Failed to fetch players." },
      { status: 500 }
    );
  }
}
