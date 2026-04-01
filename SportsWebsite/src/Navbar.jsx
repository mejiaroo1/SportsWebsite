import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { searchLeagues, searchTeams, searchPlayers } from "./api/search.js";
import { FaHome, FaMoon, FaSun } from "react-icons/fa";
import "./HomePage.css";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(true);
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

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      setDarkMode(false);
      document.body.classList.add("light-mode");
    }
  }, []);

  // Toggle theme
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

  // Search logic
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 3) {
      setSearchResults({ teams: [], players: [], leagues: [] });
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
          teams: teams?.slice(0, 5) || [],
          players: players?.slice(0, 5) || [],
          leagues: leagues?.slice(0, 5) || [],
        });
      } catch (err) {
        if (cancelled) return;
        setSearchError(err.message || "Search failed");
        setSearchResults({ teams: [], players: [], leagues: [] });
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

  return (
    <>
      <header className="top-nav">
        <div className="nav-left">
          <Link to="/" className="icon-btn">
            <FaHome size={30} />
          </Link>

          <h1 className="logo">DataPlay</h1>

          {isAboutPage ? (
            <Link to="/" className="nav-link">Home</Link>
          ) : (
            <Link to="/about" className="nav-link">About Us</Link>
          )}
        </div>

        <div className="nav-center">
          <input
            type="text"
            placeholder="Search teams, players, leagues..."
            className="search-bar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        
        <div className="nav-right"> 
          <button className="pill-btn">CT</button> 
          <button className="circle-btn" onClick={toggleTheme}> {darkMode ? "🌙" : "☀️"} </button> 
        </div>
      </header>

      {searchQuery.trim().length >= 3 && (
        <div className="search-results">
          {searching && <div className="search-status">Searching…</div>}
          {searchError && !searching && (
            <div className="search-status search-error">{searchError}</div>
          )}
          {!searching && !searchError && hasResults && (
            <>
              {searchResults.leagues.length > 0 && (
                <div className="search-group">
                  <div className="search-group-title">Leagues</div>
                  <ul>
                    {searchResults.leagues.map((lg) => (
                      <li key={lg.idLeague} className="search-item">
                        <Link
                          to={`/league/${lg.idLeague}`}
                          onClick={() => setSearchQuery("")}
                        >
                          {lg.strLeague}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {searchResults.teams.length > 0 && (
                <div className="search-group">
                  <div className="search-group-title">Teams</div>
                  <ul>
                    {searchResults.teams.map((t) => (
                      <li key={t.idTeam} className="search-item">
                        <Link
                          to={`/team/${t.idTeam}`}
                          onClick={() => setSearchQuery("")}
                        >
                          {t.strTeam}
                          {t.strLeague ? ` · ${t.strLeague}` : ""}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {searchResults.players.length > 0 && (
                <div className="search-group">
                  <div className="search-group-title">Players</div>
                  <ul>
                    {searchResults.players.map((p) => (
                      <li key={p.idPlayer} className="search-item">
                        <Link
                          to={`/player/${p.idPlayer}`}
                          onClick={() => setSearchQuery("")}
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
            <div className="search-status">No matches found.</div>
          )}
        </div>
      )}

      <div className="dropdown-menu">
        <Link to="/basketball" className="dropdown-link">Basketball</Link>
        <Link to="/sports/baseball" className="dropdown-link">Baseball</Link>
        <Link to="/sports/icehockey" className="dropdown-link">Ice Hockey</Link>
        <Link to="/sports/soccer" className="dropdown-link">Soccer</Link>
        <Link to="/sports/football" className="dropdown-link">Football</Link>
        <Link to="/sports/combat" className="dropdown-link">Combat</Link>
        <Link to="/sports/more" className="dropdown-link">More</Link>
      </div>
    </>
  );
}