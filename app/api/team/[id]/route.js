import { NextResponse } from "next/server";
import { normalizeTeamDetails } from "../../../../lib/normalizeTeam";
import { fetchSportsApi } from "../../../../lib/sportsApiServerClient";

async function fetchTeamById(teamId) {
  const attempts = [`/lookup/team/${teamId}`, `/team/${teamId}`];

  for (const path of attempts) {
    try {
      const data = await fetchSportsApi(path);
      const firstTeam = data?.teams?.[0] ?? data?.team?.[0] ?? data?.team ?? data?.data?.[0];
      if (firstTeam) return firstTeam;
    } catch {
      // Try next endpoint variation.
    }
  }

  return null;
}

export async function GET(_request, { params }) {
  try {
    const id = params?.id;
    if (!id) {
      return NextResponse.json(
        { status: "error", message: "Missing team id in route params." },
        { status: 400 }
      );
    }

    const rawTeam = await fetchTeamById(id);
    if (!rawTeam) {
      return NextResponse.json(
        { status: "error", message: `Team not found for id ${id}.` },
        { status: 404 }
      );
    }

    return NextResponse.json({ status: "ok", data: normalizeTeamDetails(rawTeam) });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: error?.message || "Failed to fetch team details." },
      { status: 500 }
    );
  }
}
