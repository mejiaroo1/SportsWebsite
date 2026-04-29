import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import { fetchFromSportsDB } from "./lib/apiClient.js";
import {
  getTeamRecentEvents,
  getTeamUpcomingEvents,
} from "./api/games.js";
import {
  buildDisplayRoster,
} from "./data/teamRosterFill.js";
import { normalizeTeamKey } from "./data/normalizeTeamKey.js";
import "./league-page.css";
import "./team-detail.css";

function parseMatchupFromEventName(name) {
  if (!name || typeof name !== "string") return { home: "", away: "" };
  const vs =
    name.includes(" vs ")
      ? " vs "
      : name.includes(" v ")
        ? " v "
        : name.includes(" @ ")
          ? " @ "
          : null;
  if (!vs) return { home: name, away: "" };
  const [a, b] = name.split(vs);
  if (vs === " @ ") return { away: (a || "").trim(), home: (b || "").trim() };
  return { home: (a || "").trim(), away: (b || "").trim() };
}

function getMatchup(ev) {
  const home = ev?.strHomeTeam?.trim?.() || "";
  const away = ev?.strAwayTeam?.trim?.() || "";
  if (home || away) return `${home} vs ${away}`.trim();
  const name = ev?.strEvent ?? ev?.strEventAlternate ?? "";
  const parsed = parseMatchupFromEventName(name);
  if (parsed.home && parsed.away) return `${parsed.home} vs ${parsed.away}`;
  return name || "Event";
}

function getScore(ev) {
  const hs = ev?.intHomeScore;
  const as = ev?.intAwayScore;
  if (hs !== null && hs !== undefined && as !== null && as !== undefined) {
    return `${hs} - ${as}`;
  }
  return ev?.strResult ?? ev?.strStatus ?? "";
}

/** Prefer full-size badge URL (e.g. …/badge/….png/medium on r2 / www CDN) */
function resolveTeamBadgeUrl(team) {
  if (!team) return "";
  const raw = (
    team.strTeamBadge ||
    team.strBadge ||
    team.strTeamLogo ||
    team.strLogo ||
    team.strTeamJersey ||
    ""
  )
    .toString()
    .trim();
  if (!raw || raw === "null") return "";
  let url = raw;
  if (url.startsWith("//")) url = `https:${url}`;
  else if (!/^https?:\/\//i.test(url)) {
    if (url.startsWith("/")) url = `https://r2.thesportsdb.com${url}`;
    else url = `https://${url}`;
  }
  const isTeamBadgePath = /\/images\/media\/team\/badge\//i.test(url);
  const isSportsDbHost = /(r2|www)\.thesportsdb\.com/i.test(url);
  if (isSportsDbHost && isTeamBadgePath) {
    url = url.replace(/\/(preview|small|tiny)(\/?)$/i, "/medium$2");
    if (!/\/medium\/?$/i.test(url) && /\.(png|jpg|jpeg|webp)$/i.test(url)) {
      url = `${url.replace(/\/?$/, "")}/medium`;
    }
  }
  return url;
}

function pickTeamDescription(team) {
  if (!team) return "";
  const raw =
    team.strDescriptionEN ||
    team.strDescription ||
    team.strTeamDescription ||
    "";
  const s = String(raw).trim();
  if (!s || s === "null") return "";
  return s
    .replace(/\r\n/g, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .trim();
}

function TeamDetail() {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [recent, setRecent] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [rosterPlayers, setRosterPlayers] = useState([]);
  const [rosterFilter, setRosterFilter] = useState("");
  const [brokenPlayerThumbs, setBrokenPlayerThumbs] = useState(() => new Set());
  const [resolvingFillPlayer, setResolvingFillPlayer] = useState("");
  const [verifiedFillRowsByName, setVerifiedFillRowsByName] = useState({});
  const [verifyingFillRows, setVerifyingFillRows] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fillValidationCacheRef = useRef(new Map());

  const markPlayerThumbBroken = useCallback((playerId) => {
    setBrokenPlayerThumbs((prev) => {
      const next = new Set(prev);
      next.add(playerId);
      return next;
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      setRosterPlayers([]);
      setRosterFilter("");
      setBrokenPlayerThumbs(new Set());
      setVerifiedFillRowsByName({});
      setVerifyingFillRows(false);
      fillValidationCacheRef.current.clear();
      try {
        const [teamData, recentData, upcomingData, playersData] =
          await Promise.all([
            fetchFromSportsDB(`/lookup/team/${id}`),
            getTeamRecentEvents(id),
            getTeamUpcomingEvents(id),
            fetchFromSportsDB(`/list/players/${id}`).catch(() => ({})),
          ]);
        if (cancelled) return;
        const teamArray =
          teamData?.lookup || teamData?.teams || teamData?.search || [];
        setTeam(teamArray[0] || null);
        setRecent(recentData.events || []);
        setUpcoming(upcomingData.events || []);
        const plist =
          playersData?.players ||
          playersData?.lookup ||
          playersData?.search ||
          [];
        setRosterPlayers(Array.isArray(plist) ? plist : []);
      } catch (e) {
        if (cancelled) return;
        setError(e.message || "Failed to load team");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const recentResults = useMemo(
    () =>
      recent.map((ev) => ({
        matchup: getMatchup(ev),
        score: getScore(ev),
      })),
    [recent]
  );

  const upcomingGames = useMemo(
    () =>
      upcoming.map((ev) => ({
        matchup: getMatchup(ev),
        date: ev.dateEvent,
        time: ev.strTime?.slice(0, 5) || "",
        arena: ev.strVenue || "TBD",
      })),
    [upcoming]
  );

  const featuredGame = useMemo(() => {
    if (recentResults.length === 0) return null;
    const first = recentResults[0];
    const [awayScore, homeScore] = String(first.score || "").split("-");
    const parts = first.matchup.split(" vs ");
    return {
      status: "Latest",
      away: { team: parts[0] || "", score: (awayScore || "").trim() },
      home: { team: parts[1] || "", score: (homeScore || "").trim() },
      note: "Most recent result",
    };
  }, [recentResults]);

  const heroSubtitle = useMemo(() => {
    if (!team) return "";
    const bits = [];
    if (team.strStadium) bits.push(team.strStadium);
    if (team.strCountry) bits.push(team.strCountry);
    if (team.intFormedYear) bits.push(`Founded ${team.intFormedYear}`);
    return bits.join(" · ");
  }, [team]);

  const badgeUrl = useMemo(() => resolveTeamBadgeUrl(team), [team]);

  const descriptionText = useMemo(() => pickTeamDescription(team), [team]);

  const displayRoster = useMemo(() => {
    if (!team) return [];
    return buildDisplayRoster(rosterPlayers, team);
  }, [rosterPlayers, team]);

  const sortedRoster = useMemo(() => {
    return [...displayRoster].sort((a, b) =>
      String(a?.strPlayer || "").localeCompare(String(b?.strPlayer || ""))
    );
  }, [displayRoster]);

  useEffect(() => {
    let cancelled = false;

    async function verifyFillRowsAgainstPlayerTeam() {
      const teamId = String(team?.idTeam ?? "").trim();
      const teamKey = normalizeTeamKey(team?.strTeam);
      if (!teamId || !teamKey) {
        setVerifiedFillRowsByName({});
        setVerifyingFillRows(false);
        return;
      }

      const fillRows = sortedRoster.filter((p) => Boolean(p.isRosterFill || !p.idPlayer));
      if (fillRows.length === 0) {
        setVerifiedFillRowsByName({});
        setVerifyingFillRows(false);
        return;
      }

      setVerifyingFillRows(true);
      const entries = await Promise.all(
        fillRows.map(async (row) => {
          const name = String(row?.strPlayer || "").trim();
          if (!name) return [name, null];
          const cacheKey = `${teamId}::${name.toLowerCase()}`;
          if (fillValidationCacheRef.current.has(cacheKey)) {
            return [name, fillValidationCacheRef.current.get(cacheKey)];
          }

          let resolved = null;
          try {
            const players = await searchPlayers(name);
            const exactByName = players.filter(
              (pl) =>
                String(pl?.strPlayer || "").trim().toLowerCase() ===
                name.toLowerCase()
            );
            const candidates = exactByName.length > 0 ? exactByName : players;

            for (const candidate of candidates) {
              if (!candidate?.idPlayer) continue;
              const pdata = await fetchFromSportsDB(
                `/lookup/player/${candidate.idPlayer}`
              ).catch(() => ({}));
              const parr = pdata?.lookup || pdata?.players || pdata?.search || [];
              const pdetail = parr[0] || candidate;
              const pTeamId = String(
                pdetail?.idTeam ?? candidate?.idTeam ?? ""
              ).trim();
              const pTeamKey = normalizeTeamKey(
                pdetail?.strTeam ?? candidate?.strTeam
              );

              if (
                (pTeamId && pTeamId === teamId) ||
                (!pTeamId && pTeamKey && pTeamKey === teamKey)
              ) {
                resolved = {
                  ...row,
                  ...candidate,
                  ...pdetail,
                  idPlayer: String(candidate.idPlayer),
                  isRosterFill: true,
                };
                break;
              }
            }
          } catch {
            resolved = null;
          }

          fillValidationCacheRef.current.set(cacheKey, resolved);
          return [name, resolved];
        })
      );

      if (cancelled) return;
      setVerifiedFillRowsByName(Object.fromEntries(entries));
      setVerifyingFillRows(false);
    }

    verifyFillRowsAgainstPlayerTeam();
    return () => {
      cancelled = true;
    };
  }, [sortedRoster, team]);

  const teamCheckedRoster = useMemo(() => {
    return sortedRoster.flatMap((p) => {
      const isFill = Boolean(p.isRosterFill || !p.idPlayer);
      if (!isFill) return [p];
      const key = String(p?.strPlayer || "").trim();
      if (!key) return [p];
      const resolved = verifiedFillRowsByName[key];
      // Keep names visible; swap in verified data when available.
      return resolved ? [resolved] : [p];
    });
  }, [sortedRoster, verifiedFillRowsByName]);

  const filteredRoster = useMemo(() => {
    const term = rosterFilter.trim().toLowerCase();
    if (!term) return teamCheckedRoster;
    return teamCheckedRoster.filter((p) =>
      `${p?.strPlayer ?? ""} ${p?.strPosition ?? ""} ${p?.strNationality ?? ""}`
        .toLowerCase()
        .includes(term)
    );
  }, [teamCheckedRoster, rosterFilter]);

  return (
    <>
      <Navbar />
      <div className="league-page team-detail-page">
        <div className="league-container">
          {loading && (
            <div className="league-panel team-detail-state">Loading…</div>
          )}
          {error && !loading && (
            <div className="league-panel team-detail-state">{error}</div>
          )}

          {!loading && !error && team && (
            <>
              <section className="league-hero">
                <div
                  className={`league-hero-left team-hero-left${badgeUrl ? " team-hero-left--badge" : ""}`}
                >
                  {badgeUrl && (
                    <img
                      className="team-hero-badge-watermark"
                      src={badgeUrl}
                      alt=""
                      aria-hidden
                      loading="eager"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const el = e.currentTarget;
                        const base = el.src.replace(/\/(medium|small|preview|tiny)\/?$/i, "");
                        if (base !== el.src && !el.dataset.retriedBase) {
                          el.dataset.retriedBase = "1";
                          el.src = base;
                          return;
                        }
                        el.style.display = "none";
                      }}
                    />
                  )}

                  <p className="league-small-title">
                    {team.strSport || "TEAM"}
                  </p>

                  <h1>{team.strTeam}</h1>

                  {heroSubtitle && (
                    <p className="league-subtitle">{heroSubtitle}</p>
                  )}

                  {team.idLeague && (
                    <div className="team-hero-actions">
                      <Link
                        className="league-btn-primary"
                        to={`/league/${team.idLeague}`}
                      >
                        League page
                      </Link>
                    </div>
                  )}
                </div>

                {featuredGame && featuredGame.away.team && featuredGame.home.team && (
                  <div className="league-hero-right">
                    <div className="featured-label">{featuredGame.status}</div>
                    <div className="featured-teams">
                      <div className="featured-team-block">
                        <span>{featuredGame.away.team}</span>
                        <span>{featuredGame.away.score}</span>
                      </div>
                      <div className="featured-vs">VS</div>
                      <div className="featured-team-block">
                        <span>{featuredGame.home.team}</span>
                        <span>{featuredGame.home.score}</span>
                      </div>
                    </div>
                    <p>{featuredGame.note}</p>
                  </div>
                )}
              </section>

              <section className="league-bottom-grid team-detail-description-section">
                <div className="league-panel">
                  <h2>About</h2>
                  {descriptionText ? (
                    <div className="team-detail-description-body">
                      {descriptionText}
                    </div>
                  ) : (
                    <p className="team-detail-description-empty">
                      No team description available.
                    </p>
                  )}
                </div>
              </section>

              <section className="league-main-grid">
                <div className="league-panel">
                  <h2>Recent Results</h2>
                  {recentResults.length === 0 ? (
                    <p className="league-subtitle" style={{ marginBottom: 0 }}>
                      No recent results.
                    </p>
                  ) : (
                    recentResults.slice(0, 12).map((g, i) => (
                      <div key={i} className="list-row">
                        <p>{g.matchup}</p>
                        <span>{g.score}</span>
                      </div>
                    ))
                  )}
                </div>

                <div className="league-panel">
                  <h2>Upcoming Games</h2>
                  {upcomingGames.length === 0 ? (
                    <p className="league-subtitle" style={{ marginBottom: 0 }}>
                      No upcoming games scheduled.
                    </p>
                  ) : (
                    upcomingGames.slice(0, 12).map((g, i) => (
                      <div key={i} className="list-row">
                        <p>{g.matchup}</p>
                        <span>
                          {g.date} {g.time}
                        </span>
                        <span>{g.arena}</span>
                      </div>
                    ))
                  )}
                </div>
              </section>

              <section className="league-bottom-grid team-detail-players-section">
                <div className="league-panel">
                  <h2>Players</h2>

                  <input
                    className="player-search"
                    value={rosterFilter}
                    onChange={(e) => setRosterFilter(e.target.value)}
                    placeholder="Filter players..."
                    disabled={teamCheckedRoster.length === 0}
                  />

                  <p className="team-grid-status">
                    Showing {filteredRoster.length} of {teamCheckedRoster.length}{" "}
                    {teamCheckedRoster.length === 1 ? "player" : "players"}
                  </p>

                  {teamCheckedRoster.length === 0 ? (
                    <p className="team-grid-empty">
                      {verifyingFillRows
                        ? "Verifying player-team assignments..."
                        : "No roster is available for this team."}
                    </p>
                  ) : (
                    <>
                      <div className="team-grid">
                        {filteredRoster.map((p) => {
                          const isFill = Boolean(p.isRosterFill || !p.idPlayer);
                          const fillKey = `fill-${sortedRoster.indexOf(p)}`;
                          const pid = p.idPlayer ? String(p.idPlayer) : fillKey;
                          const thumbUrl = (p.strCutout || p.strThumb || "").trim();
                          const showThumb =
                            !isFill &&
                            Boolean(thumbUrl) &&
                            !brokenPlayerThumbs.has(pid);
                          const metaLine =
                            isFill && resolvingFillPlayer === p.strPlayer
                              ? "Opening…"
                              : p.strPosition?.trim() || "—";
                          const inner = (
                            <>
                              {showThumb ? (
                                <img
                                  className="team-detail-player-headshot"
                                  src={thumbUrl}
                                  alt=""
                                  loading="lazy"
                                  onError={() => markPlayerThumbBroken(pid)}
                                />
                              ) : (
                                <div className="team-detail-player-headshot team-detail-player-headshot--empty" />
                              )}
                              <span className="team-grid-name">{p.strPlayer}</span>
                              <span className="team-grid-meta">{metaLine}</span>
                            </>
                          );

                          return (
                            <div key={pid} className="team-grid-item">
                              {inner}
                            </div>
                          );
                        })}
                      </div>

                      {filteredRoster.length === 0 && (
                        <p className="team-grid-empty">
                          No players match your filter.
                        </p>
                      )}
                    </>
                  )}
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default TeamDetail;
