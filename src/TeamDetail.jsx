import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import { fetchFromSportsDB } from "./lib/apiClient.js";
import {
  getTeamRecentEvents,
  getTeamUpcomingEvents,
} from "./api/games.js";
import "./homepage.css";

function TeamDetail() {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [recent, setRecent] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [teamData, recentData, upcomingData] = await Promise.all([
          fetchFromSportsDB(`/lookup/team/${id}`),
          getTeamRecentEvents(id),
          getTeamUpcomingEvents(id),
        ]);
        if (cancelled) return;
        const teamArray =
          teamData?.lookup || teamData?.teams || teamData?.search || [];
        setTeam(teamArray[0] || null);
        setRecent(recentData.events || []);
        setUpcoming(upcomingData.events || []);
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

  return (
    <div className="homepage">
      <Navbar />
      <main className="detail-page-main">
        {loading && <div className="card-message card-loading">Loading…</div>}
        {error && !loading && (
          <div className="card-message card-error">{error}</div>
        )}
        {!loading && !error && team && (
          <section className="detail-card">
            <header className="detail-header">
              <h2 className="detail-title">{team.strTeam}</h2>
              <div className="detail-meta">
                {team.strLeague && <span>{team.strLeague}</span>}
                {team.strCountry && <span> · {team.strCountry}</span>}
                {team.intFormedYear && (
                  <span> · Founded {team.intFormedYear}</span>
                )}
              </div>
            </header>

            {recent.length > 0 && (
              <section className="stats-block">
                <h3>Recent results</h3>
                <ul className="recent-list full">
                  {recent.slice(0, 10).map((ev) => (
                    <li key={ev.idEvent} className="recent-item full">
                      <span className="recent-match">
                        {ev.strHomeTeam} {ev.intHomeScore} – {ev.intAwayScore}{" "}
                        {ev.strAwayTeam}
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

            {upcoming.length > 0 && (
              <section className="stats-block">
                <h3>Upcoming</h3>
                <ul className="upcoming-list">
                  {upcoming.slice(0, 10).map((ev) => (
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
          </section>
        )}
      </main>
    </div>
  );
}

export default TeamDetail;

