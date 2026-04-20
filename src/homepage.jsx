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

  // Load summary data when card has a league (for collapsed view)
  useEffect(() => {
    if (!leagueId) return;
    setError(null);
    setLoading(true);
    getLeagueRecentEvents(leagueId)
      .then((data) => setRecentEvents((data.events || []).slice(0, 5)))
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
      .then((data) => setUpcomingEvents(data.events || []))
      .catch(() => setUpcomingEvents([]));
  }, [isActive, leagueId]);

  const recentSummary = recentEvents.slice(0, 3);

  const normalizeTeam = (ev, side) =>
    ev?.[side === "home" ? "strHomeTeam" : "strAwayTeam"] ??
    ev?.[side === "home" ? "strHomeTeamName" : "strAwayTeamName"] ??
    ev?.[side === "home" ? "homeTeam" : "awayTeam"] ??
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
    return `${h} – ${a}`;
  };

  const latestFinal = recentEvents.find((ev) => {
    const h = normalizeScore(ev, "home");
    const a = normalizeScore(ev, "away");
    return h !== null && a !== null;
  });
  const latestWinner = (() => {
    if (!latestFinal) return null;
    const h = normalizeScore(latestFinal, "home");
    const a = normalizeScore(latestFinal, "away");
    if (h === null || a === null) return null;
    if (h === a) return "Draw";
    return h > a ? normalizeTeam(latestFinal, "home") : normalizeTeam(latestFinal, "away");
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
            {latestWinner && (
              <div className="summary-leader">
                <span className="summary-label">Latest winner</span>
                <span className="summary-leader-name">{latestWinner}</span>
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
            {!latestWinner && recentSummary.length === 0 && !loading && (
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
                          {ev.strHomeTeam} vs {ev.strAwayTeam}
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
  );
}

// TheSportsDB league IDs – premium access; see https://www.thesportsdb.com/documentation
const DEFAULT_LEAGUES = [
  { id: 4328, title: "Premier League", sport: "Soccer" },
  { id: 4335, title: "La Liga", sport: "Soccer" },
  { id: 4346, title: "MLS", sport: "Soccer" },
  { id: 4387, title: "NBA", sport: "Basketball" },
  { id: 4380, title: "NHL", sport: "Ice Hockey" },
  { id: 4391, title: "NFL", sport: "Football" },
  { id: 4424, title: "MLB", sport: "Baseball" },
];

function HomePage() {
  const [activeId, setActiveId] = useState(null);
  return (
    <div className="homepage">
      <Navbar />
      <div className="cards-container">
        {DEFAULT_LEAGUES.map(({ id, title }) => (
          <SportCard
            key={id}
            title={title}
            leagueId={id}
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