// src/lib/apiClient.js
// TheSportsDB v2 requires header-based auth (X-API-KEY) and uses a different URL structure.
// Docs: https://www.thesportsdb.com/documentation
const API_KEY = import.meta.env.VITE_SPORTS_API_KEY;
// Always go through the same-origin `/api` proxy from the browser.
// Vite (dev) forwards `/api/*` to TheSportsDB v2 and injects X-API-KEY server-side.
const BASE_URL = "/api";

export async function fetchFromSportsDB(endpoint, options = {}) {
    if (!API_KEY) {
        throw new Error("Missing API key. Set VITE_SPORTS_API_KEY in .env or .env.local.");
    }

    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const url = `${BASE_URL}${cleanEndpoint}`;
    const headers = new Headers(options.headers || {});
    // Do NOT set X-API-KEY from the browser – proxy handles auth to avoid CORS issues.

    try {
        const response = await fetch(url, { ...options, headers });
        const text = await response.text();

        if (!response.ok) {
            throw new Error(`Server Error ${response.status}: ${text.substring(0, 100)}`);
        }

        // Empty or non-JSON response → avoid "Unexpected end of JSON input"
        if (!text || !text.trim()) {
            return {};
        }
        try {
            return JSON.parse(text);
        } catch (parseErr) {
            console.warn("Sports API non-JSON response:", text.substring(0, 80));
            return {};
        }
    } catch (error) {
        console.error("Fetch error details:", error.message);
        throw error;
    }
}