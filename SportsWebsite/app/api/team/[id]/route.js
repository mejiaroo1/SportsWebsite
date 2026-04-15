import { ApiClientError, fetchFromSportsApi } from "../../../../lib/apiClient.js";
import { fail, ok } from "../../../../lib/apiResponse.js";
import { normalizeTeam } from "../../../../lib/normalizeTeam.js";

export async function GET(_request, { params }) {
  try {
    const id = String(params?.id || "").trim();

    if (!id) {
      return fail("Missing team id in route param.", 400);
    }

    const data = await fetchFromSportsApi(`/lookup/team/${encodeURIComponent(id)}`);
    const rawTeam = (data?.teams || data?.team || data?.data || [])[0];

    if (!rawTeam) {
      return fail("Team not found.", 404);
    }

    const team = {
      ...normalizeTeam(rawTeam),
      stats: {
        formedYear: rawTeam.intFormedYear || "",
        stadium: rawTeam.strStadium || "",
        country: rawTeam.strCountry || "",
        website: rawTeam.strWebsite || "",
        description: rawTeam.strDescriptionEN || "",
      },
    };

    return ok(team);
  } catch (error) {
    if (error instanceof ApiClientError) {
      return fail(error.message, error.status, error.details);
    }
    return fail("Unexpected server error while loading team details.", 500);
  }
}
