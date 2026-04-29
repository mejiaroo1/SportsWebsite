import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import "./league-page.css";

import { getLeagueRecentEvents, getLeagueUpcomingEvents } from "./api/games.js";
import { searchPlayers } from "./api/search.js";
import { fetchFromSportsDB } from "./lib/apiClient.js";
import { getFallbackTeamNames, FALLBACK_USES_PLAYER_SEARCH } from "./data/leagueFallbackTeams.js";

/** Combat / individual-sport leagues: no team roster in TheSportsDB sense */
const COMBAT_LEAGUE_IDS = new Set([
  "4443", // UFC
  "4495", // ONE Championship
  "4445", // Boxing
  "4605", // Kickboxing
  "4726", // Wrestling (pro)
  "4883", // NCAA Wrestling (homepage CT)
]);

function isCombatSportLeague(leagueRow, leagueIdParam) {
  const lid = String(leagueIdParam ?? "");
  if (COMBAT_LEAGUE_IDS.has(lid)) return true;

  const sport = (leagueRow?.strSport || "").toLowerCase();
  const leagueName = (leagueRow?.strLeague || "").toLowerCase();

  const sportHints = [
    "fighting",
    "mma",
    "mixed martial",
    "wrestling",
    "boxing",
    "combat",
    "kickboxing",
    "martial",
    "muay thai",
  ];
  if (sportHints.some((h) => sport.includes(h))) return true;

  // Bellator shares an id with CPBL in this app; treat as combat only when league name matches
  if (
    lid === "4467" &&
    (leagueName.includes("bellator") || sport.includes("fight") || sport.includes("mma"))
  ) {
    return true;
  }

  return false;
}

function LeaguePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const RED_LIGHT_THEME_LEAGUE_IDS = new Set([
    "4607",
    "5085",
    "5346",
    "5279",
    "4479",
    "4883",
  ]);
  const useRedLightTheme = RED_LIGHT_THEME_LEAGUE_IDS.has(String(id));

  const [league, setLeague] = useState(null);
  const [recentResults, setRecentResults] = useState([]);
  const [upcomingGames, setUpcomingGames] = useState([]);
  const [teams, setTeams] = useState([]);
  const [standings, setStandings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [resolvingTeamName, setResolvingTeamName] = useState("");
  const [teamLookupError, setTeamLookupError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setLoading(true);
      try {
        const [leagueData, recentData, upcomingData] = await Promise.all([
          fetchFromSportsDB(`/lookup/league/${id}`),
          getLeagueRecentEvents(id),
          getLeagueUpcomingEvents(id),
        ]);

        if (cancelled) return;

        const leagueArray =
          leagueData?.lookup || leagueData?.leagues || [];

        const leagueRow = leagueArray[0] || null;
        setLeague(leagueRow);

        const parseMatchupFromEventName = (name) => {
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
        };

        const getMatchup = (ev) => {
          const home = ev?.strHomeTeam?.trim?.() || "";
          const away = ev?.strAwayTeam?.trim?.() || "";
          if (home || away) return `${home} vs ${away}`.trim();
          const name = ev?.strEvent ?? ev?.strEventAlternate ?? "";
          const parsed = parseMatchupFromEventName(name);
          if (parsed.home && parsed.away) return `${parsed.home} vs ${parsed.away}`;
          return name || "Event";
        };

        const getScore = (ev) => {
          const hs = ev?.intHomeScore;
          const as = ev?.intAwayScore;
          if (hs !== null && hs !== undefined && as !== null && as !== undefined) {
            return `${hs} - ${as}`;
          }
          return ev?.strResult ?? ev?.strStatus ?? "";
        };

        // Transform recent games
        const recentFormatted = (recentData.events || []).map((ev) => ({
          matchup: getMatchup(ev),
          score: getScore(ev),
        }));

        // Transform upcoming games
        const upcomingFormatted = (upcomingData.events || []).map((ev) => ({
          matchup: getMatchup(ev),
          date: ev.dateEvent,
          time: ev.strTime?.slice(0, 5) || "",
          arena: ev.strVenue || "TBD",
        }));

        setRecentResults(recentFormatted);
        setUpcomingGames(upcomingFormatted);

        const loadLeagueTeams = async () => {
          const requestAttempts = [
            () => fetchFromSportsDB(`/lookup/all_teams_league/${id}`),
            () => fetchFromSportsDB(`/lookup/all_teams/${id}`),
            () =>
              leagueRow?.strLeague
                ? fetchFromSportsDB(
                    `/search/all_teams/${encodeURIComponent(leagueRow.strLeague)}`
                  )
                : Promise.resolve({}),
          ];

          for (const attempt of requestAttempts) {
            try {
              const data = await attempt();
              const teamArray = data?.teams || data?.lookup || data?.search || [];
              if (Array.isArray(teamArray) && teamArray.length > 0) {
                setTeams(teamArray);
                return;
              }
            } catch {
              // Try next endpoint shape.
            }
          }

          setTeams([]);
        };

        if (!isCombatSportLeague(leagueRow, id)) {
          await loadLeagueTeams();
        } else {
          setTeams([]);
        }
        setStandings([]);

      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();
    return () => (cancelled = true);
  }, [id]);

  // FEATURED GAME = first recent match
  const featuredGame = useMemo(() => {
    if (recentResults.length === 0) return null;

    const first = recentResults[0];
    const [awayScore, homeScore] = String(first.score || "").split("-");

    return {
      status: "Final",
      away: { team: first.matchup.split(" vs ")[0], score: awayScore },
      home: { team: first.matchup.split(" vs ")[1], score: homeScore },
      note: "Latest Result",
    };
  }, [recentResults]);

  const allTeams = useMemo(() => {
    const sourceTeams =
      teams.length > 0
        ? teams
        : (getFallbackTeamNames(id, league?.strLeague) || []).map((name) => ({
            idTeam: `fallback-${name}`,
            strTeam: name,
            strLeague: league?.strLeague || "",
            isFallback: true,
          }));
    return [...sourceTeams].sort((a, b) =>
      String(a?.strTeam || "").localeCompare(String(b?.strTeam || ""))
    );
  }, [teams, id, league]);

  const filteredTeams = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return allTeams;
    return allTeams.filter((team) =>
      `${team?.strTeam ?? ""} ${team?.strLeague ?? ""}`.toLowerCase().includes(term)
    );
  }, [allTeams, search]);

  const showTeamsSection = useMemo(() => {
    if (league) return !isCombatSportLeague(league, id);
    return !isCombatSportLeague(null, id);
  }, [league, id]);

  const handleFallbackTeamClick = async (teamName) => {
    setTeamLookupError("");
    setResolvingTeamName(teamName);
    try {
      const data = await fetchFromSportsDB(`/search/team/${encodeURIComponent(teamName)}`);
      const teamArray = data?.teams || data?.lookup || data?.search || [];
      const exact = teamArray.find(
        (team) => String(team?.strTeam || "").toLowerCase() === teamName.toLowerCase()
      );
      const first = exact || teamArray[0];
      if (first?.idTeam) {
        navigate(`/team/${first.idTeam}`);
        return;
      }

      if (FALLBACK_USES_PLAYER_SEARCH.has(String(id))) {
        const players = await searchPlayers(teamName);
        const pExact = players.find(
          (p) => String(p?.strPlayer || "").toLowerCase() === teamName.toLowerCase()
        );
        const p = pExact || players[0];
        if (p?.idPlayer) {
          navigate(`/player/${p.idPlayer}`);
          return;
        }
      }

      setTeamLookupError(`Could not find a team page for ${teamName}.`);
    } catch {
      setTeamLookupError(`Unable to open ${teamName} right now.`);
    } finally {
      setResolvingTeamName("");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Navbar />

      <div className={`league-page ${useRedLightTheme ? "league-page-red-light" : ""}`}>
        <div className="league-container">

          {/* HERO */}
          <section className="league-hero">
            <div className="league-hero-left">
              <p className="league-small-title">
                {league?.strSport || "SPORT"}
              </p>

              <h1>{league?.strLeague || "League"}</h1>

              <p className="league-subtitle">
                Live scores, schedules, standings, and stats.
              </p>
            </div>

            {/* FEATURED GAME */}
            {featuredGame && (
              <div className="league-hero-right">
                <div className="featured-label">
                  {featuredGame.status}
                </div>

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

          {/* RECENT + UPCOMING */}
          <section className="league-main-grid">
            <div className="league-panel">
              <h2>Recent Results</h2>
              {recentResults.map((g, i) => (
                <div key={i} className="list-row">
                  <p>{g.matchup}</p>
                  <span>{g.score}</span>
                </div>
              ))}
            </div>

            <div className="league-panel">
              <h2>Upcoming Games</h2>
              {upcomingGames.map((g, i) => (
                <div key={i} className="list-row">
                  <p>{g.matchup}</p>
                  <span>{g.date} {g.time}</span>
                  <span>{g.arena}</span>
                </div>
              ))}
            </div>
          </section>

          {showTeamsSection && (
            <section className="league-bottom-grid">
              <div className="league-panel">
                <h2>Teams</h2>

                <input
                  className="player-search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter teams..."
                />

                <p className="team-grid-status">
                  Showing {filteredTeams.length} of {allTeams.length} teams
                </p>

                <div className="team-grid">
                  {filteredTeams.map((team) => (
                    team.isFallback ? (
                      <button
                        key={team.idTeam}
                        type="button"
                        className="team-grid-item team-grid-button"
                        onClick={() => handleFallbackTeamClick(team.strTeam)}
                        disabled={resolvingTeamName === team.strTeam}
                      >
                        <span className="team-grid-name">{team.strTeam}</span>
                        <span className="team-grid-meta">
                          {resolvingTeamName === team.strTeam
                          ? "Opening..."
                          : FALLBACK_USES_PLAYER_SEARCH.has(String(id))
                            ? "Open player profile"
                            : "Open team page"}
                        </span>
                      </button>
                    ) : (
                      <Link key={team.idTeam} to={`/team/${team.idTeam}`} className="team-grid-item">
                        <span className="team-grid-name">{team.strTeam}</span>
                        {team.strStadium && (
                          <span className="team-grid-meta">{team.strStadium}</span>
                        )}
                      </Link>
                    )
                  ))}
                </div>

                {teamLookupError && <p className="team-grid-empty">{teamLookupError}</p>}

                {filteredTeams.length === 0 && (
                  <p className="team-grid-empty">No teams match your filter.</p>
                )}
              </div>
            </section>
          )}

        </div>
      </div>
    </>
  );
}

export default LeaguePage;