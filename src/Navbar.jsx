import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { searchLeagues, searchTeams, searchPlayers } from "./api/search.js";
import { FaHome } from "react-icons/fa";
import "./homepage.css";

const MIN_QUERY_LENGTH = 2;
const MAX_LEAGUE_RESULTS = 40;
const MAX_TEAM_RESULTS = 100;
const MAX_PLAYER_RESULTS = 3000;

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(true);
  const [collegeMode, setCollegeMode] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState({
    teams: [],
    players: [],
    leagues: [],
  });
  const [searchError, setSearchError] = useState(null);

  const location = useLocation();
  const isAboutPage = location.pathname === "/about";

  /* ---------------- THEME ---------------- */

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {
      setDarkMode(false);
      document.body.classList.add("light-mode");
    }
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.body.classList.add("light-mode");
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.remove("light-mode");
      localStorage.setItem("theme", "dark");
    }

    setDarkMode(!darkMode);
  };

  /* ---------------- COLLEGE MODE ---------------- */

  useEffect(() => {
    const saved = localStorage.getItem("collegeMode");
    const enabled = saved === "true";
    setCollegeMode(enabled);
    if (enabled) {
      document.body.classList.add("college-mode");
    } else {
      document.body.classList.remove("college-mode");
    }
  }, []);

  const toggleCollegeMode = () => {
    const next = !collegeMode;
    if (next) document.body.classList.add("college-mode");
    else document.body.classList.remove("college-mode");
    localStorage.setItem("collegeMode", String(next));
    setCollegeMode(next);
    window.dispatchEvent(
      new CustomEvent("college-mode-change", { detail: { enabled: next } })
    );
  };

  /* ---------------- SEARCH ---------------- */

  useEffect(() => {
    const q = searchQuery.trim();

    if (q.length < MIN_QUERY_LENGTH) {
      setSearchResults({
        teams: [],
        players: [],
        leagues: [],
      });

      setSearchError(null);
      return;
    }

    let cancelled = false;

    setSearching(true);
    setSearchError(null);

    const handle = setTimeout(async () => {
      try {
        const [teams, players, leagues] = await Promise.all([
          searchTeams(q),
          searchPlayers(q),
          searchLeagues(q),
        ]);

        if (cancelled) return;

        setSearchResults({
          teams: teams?.slice(0, MAX_TEAM_RESULTS) || [],
          players: players?.slice(0, MAX_PLAYER_RESULTS) || [],
          leagues: leagues?.slice(0, MAX_LEAGUE_RESULTS) || [],
        });
      } catch (err) {
        if (cancelled) return;

        setSearchError(err.message || "Search failed");

        setSearchResults({
          teams: [],
          players: [],
          leagues: [],
        });
      } finally {
        if (!cancelled) setSearching(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(handle);
    };

  }, [searchQuery]);

  const hasResults =
    searchResults.teams.length ||
    searchResults.players.length ||
    searchResults.leagues.length;

  /* ---------------- UI ---------------- */

  return (
    <>
      <header className="top-nav">

        {/* LEFT */}
        <div className="nav-left">

          <Link to="/" className="icon-btn">
            <FaHome size={30} />
          </Link>

          <h1 className="logo"> 
              Data
            <span className={`logo-play ${collegeMode ? "college" : ""}`}>
              Play
            </span>
          </h1>

          {isAboutPage ? (
            <Link to="/" className="nav-link"></Link>
          ) : (
            <Link to="/about" className="nav-link">
              About Us
            </Link>
          )}

        </div>


        {/* CENTER */}
        <div className="nav-center">

          <input
            type="text"
            placeholder="Search teams, players, leagues..."
            className="search-bar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

        </div>


        {/* RIGHT */}
        <div className="nav-right">

          {/* COLLEGE TEAMS BUTTON */}
          <button
            className={`pill-btn ${collegeMode ? "active" : ""} ${!darkMode ? "light-mode" : ""}`}
            onClick={toggleCollegeMode}
          >
            CT
          </button>

          {/* DARK MODE BUTTON */}
          <button
            className="circle-btn"
            onClick={toggleTheme}
          >
            {darkMode ? "🌙" : "☀️"}
          </button>

        </div>

      </header>


      {/* SEARCH RESULTS */}
      {searchQuery.trim().length >= MIN_QUERY_LENGTH && (

        <div
          className="search-results"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >

          {searching && (
            <div className="search-status">
              Searching…
            </div>
          )}


          {searchError && !searching && (
            <div className="search-status search-error">
              {searchError}
            </div>
          )}


          {!searching && !searchError && hasResults && (
            <>

              {/* LEAGUES */}
              {searchResults.leagues.length > 0 && (

                <div className="search-group">

                  <div className="search-group-title">
                    Leagues
                  </div>

                  <ul>

                    {searchResults.leagues.map((lg) => (

                      <li
                        key={lg.idLeague}
                        className="search-item"
                      >

                        <Link
                          to={`/league/${lg.idLeague}`}
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSearchQuery("");
                          }}
                        >
                          {lg.strLeague}
                        </Link>

                      </li>

                    ))}

                  </ul>

                </div>

              )}


              {/* TEAMS */}
              {searchResults.teams.length > 0 && (

                <div className="search-group">

                  <div className="search-group-title">
                    Teams
                  </div>

                  <ul>

                    {searchResults.teams.map((t) => (

                      <li
                        key={t.idTeam}
                        className="search-item"
                      >

                        <Link
                          to={`/team/${t.idTeam}`}
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSearchQuery("");
                          }}
                        >
                          {t.strTeam}
                          {t.strLeague ? ` · ${t.strLeague}` : ""}
                        </Link>

                      </li>

                    ))}

                  </ul>

                </div>

              )}


              {/* PLAYERS */}
              {searchResults.players.length > 0 && (

                <div className="search-group">

                  <div className="search-group-title">
                    Players
                  </div>

                  <ul>

                    {searchResults.players.map((p) => (

                      <li
                        key={p.idPlayer}
                        className="search-item"
                      >

                        <Link
                          to={`/player/${p.idPlayer}`}
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSearchQuery("");
                          }}
                        >
                          {p.strPlayer}
                          {p.strTeam ? ` · ${p.strTeam}` : ""}
                        </Link>

                      </li>

                    ))}

                  </ul>

                </div>

              )}

            </>
          )}


          {!searching && !searchError && !hasResults && (
            <div className="search-status">
              No matches found.
            </div>
          )}

        </div>

      )}


      {/* DROPDOWN NAV */}
      <div className="dropdown-menu">

        <Link
          to={collegeMode ? "/league/4607" : "/basketball"}
          className="dropdown-link"
        >
          Basketball
        </Link>

        <Link
          to={collegeMode ? "/league/5085" : "/baseball"}
          className="dropdown-link"
        >
          Baseball
        </Link>

        <Link
          to={collegeMode ? "/league/5346" : "/icehockey"}
          className="dropdown-link"
        >
          Ice Hockey
        </Link>

        <Link
          to={collegeMode ? "/league/5279" : "/soccer"}
          className="dropdown-link"
        >
          Soccer
        </Link>

        <Link
          to={collegeMode ? "/league/4479" : "/football"}
          className="dropdown-link"
        >
          Football
        </Link>

        <Link
          to={collegeMode ? "/league/4883" : "/combat"}
          className="dropdown-link"
        >
          Combat
        </Link>

        <Link
          to="/more"
          className="dropdown-link"
        >
          More
        </Link>

      </div>

    </>
  );
}