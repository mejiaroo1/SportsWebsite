const env = globalThis?.process?.env ?? {};
const API_KEY = env.SPORTS_API_KEY ?? env.VITE_SPORTS_API_KEY;
const BASE_URL = env.SPORTS_API_BASE_URL ?? "https://www.thesportsdb.com/api/v2/json";

function buildUrl(pathname) {
  const cleanPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${BASE_URL}${cleanPath}`;
}

export async function fetchSportsApi(pathname) {
  if (!API_KEY) {
    throw new Error("Missing SPORTS_API_KEY (or VITE_SPORTS_API_KEY).");
  }

  const response = await fetch(buildUrl(pathname), {
    method: "GET",
    headers: { "X-API-KEY": API_KEY, Accept: "application/json" },
    cache: "no-store",
  });

  const text = await response.text();
  const data = text ? safeParseJson(text) : {};

  if (!response.ok) {
    const message = data?.message || text?.slice(0, 160) || `Sports API error ${response.status}`;
    throw new Error(message);
  }

  return data;
}

function safeParseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}
