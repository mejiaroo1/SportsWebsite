// src/lib/apiClient.js
// Always go through same-origin `/api` from the browser.
// Vite (dev) proxies `/api/*` to the local Next backend, which handles API key auth server-side.
const BASE_URL = "/api";

export async function fetchFromSportsDB(endpoint, options = {}) {
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const url = `${BASE_URL}${cleanEndpoint}`;
    const headers = new Headers(options.headers || {});
    // Do NOT set X-API-KEY from the browser.

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
