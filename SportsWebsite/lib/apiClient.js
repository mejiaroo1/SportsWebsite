const API_KEY = process.env.SPORTS_API_KEY || process.env.VITE_SPORTS_API_KEY;
const API_BASE_URL = process.env.SPORTS_API_BASE_URL || "https://www.thesportsdb.com/api/v2/json";

export class ApiClientError extends Error {
  constructor(message, status = 500, details = null) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.details = details;
  }
}

function buildUrl(endpoint, query = {}) {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = new URL(`${API_BASE_URL}${cleanEndpoint}`);

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

export async function fetchFromSportsApi(endpoint, { query = {}, method = "GET", body } = {}) {
  if (!API_KEY) {
    throw new ApiClientError("Missing SPORTS_API_KEY in environment.", 500);
  }

  const url = buildUrl(endpoint, query);
  const headers = {
    "X-API-KEY": API_KEY,
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const raw = await response.text();
  let payload = {};

  if (raw && raw.trim()) {
    try {
      payload = JSON.parse(raw);
    } catch {
      throw new ApiClientError("Sports API returned non-JSON content.", 502, raw.slice(0, 180));
    }
  }

  if (!response.ok) {
    throw new ApiClientError(
      payload?.message || `Sports API request failed with status ${response.status}.`,
      response.status,
      payload,
    );
  }

  return payload;
}
