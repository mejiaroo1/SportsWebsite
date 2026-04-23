import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLeagueRecentEvents, getLeagueUpcomingEvents } from "./api/games.js";
import Navbar from "./Navbar.jsx";
import "./homepage.css";

function SportCard({ title, leagueId, mode = "expand", isActive, onClose, ...props }) {
  const [recentEvents, setRecentEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const isNavigateMode = mode === "navigate";
  const backgroundImageId = props.backgroundImageId ?? leagueId;

  // Load summary data when card has a league (for collapsed view)
  useEffect(() => {
    if (!leagueId) return;
    setError(null);
    setLoading(true);
    getLeagueRecentEvents(leagueId)
      .then((data) => {
        if (String(leagueId) === "4443") {
          console.log("[UFC] recent schedule response", data);
        }
        setRecentEvents((data.events || []).slice(0, 5));
      })
      .catch((err) => {
        setError(err.message);
        setRecentEvents([]);
      })
      .finally(() => setLoading(false));
  }, [leagueId]);

  // Load upcoming events only when expanded
  useEffect(() => {
    if (!isActive || !leagueId) {
      setUpcomingEvents([]);
      return;
    }
    getLeagueUpcomingEvents(leagueId)
      .then((data) => {
        if (String(leagueId) === "4443") {
          console.log("[UFC] upcoming schedule response", data);
        }
        setUpcomingEvents(data.events || []);
      })
      .catch(() => setUpcomingEvents([]));
  }, [isActive, leagueId]);

  const recentSummary = recentEvents.slice(0, 3);

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
    if (vs === " @ ") {
      // "Away @ Home"
      return { away: (a || "").trim(), home: (b || "").trim() };
    }
    return { home: (a || "").trim(), away: (b || "").trim() };
  };

  const getFallbackTeamName = (ev, side) => {
    const eventName =
      ev?.strEvent ??
      ev?.strEventAlternate ??
      ev?.event ??
      ev?.name ??
      "";
    const parsed = parseMatchupFromEventName(eventName);
    return side === "home" ? parsed.home : parsed.away;
  };

  const normalizeTeam = (ev, side) =>
    ev?.[side === "home" ? "strHomeTeam" : "strAwayTeam"] ??
    ev?.[side === "home" ? "strHomeTeamName" : "strAwayTeamName"] ??
    ev?.[side === "home" ? "homeTeam" : "awayTeam"] ??
    getFallbackTeamName(ev, side) ??
    "";

  const normalizeScore = (ev, side) => {
    const raw =
      side === "home"
        ? ev?.intHomeScore ?? ev?.intHome ?? ev?.homeScore
        : ev?.intAwayScore ?? ev?.intAway ?? ev?.awayScore;
    if (raw === null || raw === undefined || raw === "") return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  };

  const formatScore = (ev) => {
    const h = normalizeScore(ev, "home");
    const a = normalizeScore(ev, "away");
    if (h !== null && a !== null) return `${h} – ${a}`;
    return ev?.strResult ?? ev?.strStatus ?? "";
  };

  const latestFinal = recentEvents.find((ev) => {
    const h = normalizeScore(ev, "home");
    const a = normalizeScore(ev, "away");
    return h !== null && a !== null;
  });

  const extractWinnerFromResult = (ev) => {
    const winner =
      ev?.strWinner ??
      ev?.strWinningTeam ??
      ev?.strWinTeam ??
      "";
    if (winner) return String(winner).trim();

    const result = (ev?.strResult ?? "").toString();
    // Common combat formats: "Fighter A def Fighter B", "Fighter A defeated Fighter B"
    const m = result.match(/^\s*(.+?)\s+(?:def\.?|defeated|beat)\s+/i);
    if (m?.[1]) return m[1].trim();
    return null;
  };

  const latestSummary = (() => {
    // Team sports: derive from numeric scores when present
    if (latestFinal) {
      const h = normalizeScore(latestFinal, "home");
      const a = normalizeScore(latestFinal, "away");
      if (h === null || a === null) return null;
      if (h === a) return { label: "Latest result", value: "Draw" };
      const w = h > a ? normalizeTeam(latestFinal, "home") : normalizeTeam(latestFinal, "away");
      return { label: "Latest winner", value: w || null };
    }

    // Combat / no numeric scores: show winner if present; otherwise show event title
    const candidate =
      recentEvents.find((ev) => extractWinnerFromResult(ev)) ||
      recentEvents.find((ev) => (ev?.strResult ?? ev?.strStatus ?? "").toString().trim()) ||
      recentEvents[0];
    if (!candidate) return null;

    const w = extractWinnerFromResult(candidate);
    if (w) return { label: "Latest winner", value: w };

    const eventName =
      candidate?.strEvent ??
      candidate?.strEventAlternate ??
      "";
    const resultText = (candidate?.strResult ?? candidate?.strStatus ?? "").toString().trim();
    return {
      label: "Latest event",
      value: resultText ? `${eventName}${eventName && resultText ? " · " : ""}${resultText}` : (eventName || null),
    };
  })();

  return (
    <div
      className={`sport-card ${isActive ? "expanded" : ""}`}
      onClick={
        isNavigateMode
          ? () => navigate(`/league/${leagueId}`)
          : !isActive
            ? props.onClick
            : undefined
      }
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (isNavigateMode && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          navigate(`/league/${leagueId}`);
          return;
        }
        if (!isActive && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          props.onClick?.(e);
        }
      }}
      aria-expanded={isActive}
    >
      <div className="league-card-bg" aria-hidden="true">
        <img
          className="league-card-bg-image"
          src={`/league-images/${backgroundImageId}.png`}
          alt=""
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <div className="league-card-bg-overlay" />
      </div>

      <div className="league-card-content">
        <div className="card-header">
          <h2 className="card-title">{title}</h2>
          {!isNavigateMode && isActive && onClose && (
            <button
              type="button"
              className="close-btn"
              onClick={(e) => {
                e.stopPropagation();
                onClose(e);
              }}
              aria-label="Close"
            >
              ×
            </button>
          )}
        </div>

        {error && (
          <div className="card-message card-error" role="alert">
            {error}
          </div>
        )}

        {loading && !recentEvents.length && !error && (
          <div className="card-message card-loading">Loading…</div>
        )}

        {!loading && !error && (
          <>
            {/* Summary: always visible (leader + recent results) */}
            <div className="card-summary">
              {latestSummary?.value && (
                <div className="summary-leader">
                  <span className="summary-label">{latestSummary.label}</span>
                  <span className="summary-leader-name">{latestSummary.value}</span>
                </div>
              )}
              {recentSummary.length > 0 && (
                <div className="summary-recent">
                  <span className="summary-label">Recent results</span>
                  <ul className="recent-list compact">
                    {recentSummary.map((ev) => (
                      <li key={ev.idEvent} className="recent-item compact">
                        <span className="recent-match">
                          {normalizeTeam(ev, "home")} {formatScore(ev)} {normalizeTeam(ev, "away")}
                        </span>
                        {ev.dateEvent && (
                          <span className="recent-date">{ev.dateEvent}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {!latestSummary?.value && recentSummary.length === 0 && !loading && (
                <div className="card-message">No standings or results for this league.</div>
              )}
            </div>

            {/* Expanded: recent + upcoming (v2 does not provide standings tables) */}
            {!isNavigateMode && isActive && (
              <div className="stats-section expanded-details">
                {recentEvents.length > 0 && (
                  <section className="stats-block">
                    <h3>Recent results</h3>
                    <ul className="recent-list full">
                      {recentEvents.map((ev) => (
                        <li key={ev.idEvent} className="recent-item full">
                          <span className="recent-match">
                            {normalizeTeam(ev, "home")} {formatScore(ev)} {normalizeTeam(ev, "away")}
                          </span>
                          <span className="recent-meta">
                            {ev.dateEvent}
                            {ev.strVenue && ` · ${ev.strVenue}`}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {upcomingEvents.length > 0 && (
                  <section className="stats-block">
                    <h3>Upcoming</h3>
                    <ul className="upcoming-list">
                      {upcomingEvents.slice(0, 10).map((ev) => (
                        <li key={ev.idEvent} className="upcoming-item">
                          <span className="upcoming-match">
                            {normalizeTeam(ev, "home")}
                            {normalizeTeam(ev, "home") && normalizeTeam(ev, "away") ? " vs " : ""}
                            {normalizeTeam(ev, "away")}
                          </span>
                          <span className="upcoming-date">
                            {ev.dateEvent}
                            {ev.strTime ? ` ${ev.strTime.slice(0, 5)}` : ""}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// TheSportsDB league IDs – premium access; see https://www.thesportsdb.com/documentation
const DEFAULT_LEAGUES = [
  { id: 4328, title: "Premier League", sport: "Soccer" },
  { id: 4387, title: "NBA", sport: "Basketball" },
  { id: 4380, title: "NHL", sport: "Ice Hockey" },
  { id: 4391, title: "NFL", sport: "Football" },
  { id: 4424, title: "MLB", sport: "Baseball" },
  { id: 4443, title: "UFC", sport: "Combat" },
];

// "CT mode" featured leagues (college / developmental / feeder leagues)
const COLLEGE_LEAGUES = [
  { id: 5279, title: "MLS Next Pro", sport: "Soccer" },
  { id: 4607, title: "NCAA Division 1 Basketball", sport: "Basketball" },
  { id: 5346, title: "NCAA Division 1 Ice Hockey", sport: "Ice Hockey" },
  { id: 4479, title: "NCAA Division 1 Football", sport: "Football" },
  { id: 5085, title: "Triple-A East", sport: "Baseball" },
  { id: 4883, title: "NCAA Wrestling", sport: "Combat" },
];

const SPORT_BACKGROUND_IMAGE_IDS = {
  Soccer: 4328,
  Basketball: 4387,
  "Ice Hockey": 4380,
  Football: 4391,
  Baseball: 4424,
  Combat: 4443,
};

function HomePage() {
  const [activeId, setActiveId] = useState(null);
  const [collegeMode, setCollegeMode] = useState(
    localStorage.getItem("collegeMode") === "true" ||
      document.body.classList.contains("college-mode")
  );

  useEffect(() => {
    const handler = (e) => {
      const enabled = Boolean(e?.detail?.enabled);
      setCollegeMode(enabled);
      setActiveId(null);
    };
    window.addEventListener("college-mode-change", handler);
    return () => window.removeEventListener("college-mode-change", handler);
  }, []);

  const leagues = collegeMode ? COLLEGE_LEAGUES : DEFAULT_LEAGUES;
  return (
    <div className={`homepage ${collegeMode ? "college-mode" : ""}`}>
      <Navbar />
      <div className="cards-container">
        {leagues.map(({ id, title, sport }) => (
          <SportCard
            key={id}
            title={title}
            leagueId={id}
            backgroundImageId={SPORT_BACKGROUND_IMAGE_IDS[sport] ?? id}
            isActive={activeId === id}
            onClick={() => setActiveId(id)}
            onClose={() => setActiveId(null)}
          />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
export { SportCard };