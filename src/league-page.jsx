import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import "./league-page.css";

import { getLeagueRecentEvents, getLeagueUpcomingEvents } from "./api/games.js";
import { fetchFromSportsDB } from "./lib/apiClient.js";

function LeaguePage() {
  const { id } = useParams();
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
  const [players, setPlayers] = useState([]);
  const [standings, setStandings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

        setLeague(leagueArray[0] || null);

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

        //plug real endpoints here:
        setPlayers([]);
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

  const filteredPlayers = useMemo(() => {
    return players.filter((p) =>
      `${p.name} ${p.team}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [players, search]);

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

          {/* PLAYERS (placeholder for now)
          <section className="league-bottom-grid">
            <div className="league-panel">
              <h2>Players</h2>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
              />

              {filteredPlayers.map((p, i) => (
                <div key={i}>
                  <p>{p.name}</p>
                </div>
              ))}
            </div>
          </section>
          */}

        </div>
      </div>
    </>
  );
}

export default LeaguePage;