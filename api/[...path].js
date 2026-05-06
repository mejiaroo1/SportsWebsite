export default async function handler(req, res) {
  try {
    const apiKey = process.env.VITE_SPORTS_API_KEY;
    if (!apiKey) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Missing VITE_SPORTS_API_KEY on server." }));
      return;
    }

    const parts = Array.isArray(req.query?.path) ? req.query.path : [req.query?.path].filter(Boolean);
    const endpointPath = parts.join("/");

    // Preserve any query string params besides the catch-all `path`
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(req.query || {})) {
      if (k === "path") continue;
      if (Array.isArray(v)) v.forEach((vv) => qs.append(k, String(vv)));
      else if (v != null) qs.set(k, String(v));
    }

    const upstream = new URL(`https://www.thesportsdb.com/api/v2/json/${endpointPath}`);
    const query = qs.toString();
    if (query) upstream.search = query;

    const upstreamRes = await fetch(upstream, {
      method: req.method || "GET",
      headers: {
        "X-API-KEY": apiKey,
        "Accept": "application/json",
      },
    });

    const text = await upstreamRes.text();

    res.statusCode = upstreamRes.status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    res.end(text);
  } catch (err) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: err?.message || "Proxy error" }));
  }
}

