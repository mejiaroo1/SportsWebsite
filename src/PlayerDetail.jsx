import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import { fetchFromSportsDB } from "./lib/apiClient.js";
import "./homepage.css";

function PlayerDetail() {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchFromSportsDB(`/lookup/player/${id}`);
        if (cancelled) return;
        const playerArray =
          data?.lookup || data?.players || data?.search || [];
        setPlayer(playerArray[0] || null);
      } catch (e) {
        if (cancelled) return;
        setError(e.message || "Failed to load player");
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
        {!loading && !error && player && (
          <section className="detail-card">
            <header className="detail-header">
              <h2 className="detail-title">{player.strPlayer}</h2>
              <div className="detail-meta">
                {player.strPosition && <span>{player.strPosition}</span>}
                {player.strTeam && <span> · {player.strTeam}</span>}
                {player.strNationality && (
                  <span> · {player.strNationality}</span>
                )}
              </div>
            </header>

            <section className="stats-block">
              <h3>Profile</h3>
              <ul className="detail-list">
                {player.dateBorn && (
                  <li>
                    <strong>Born:</strong> {player.dateBorn}
                  </li>
                )}
                {player.strHeight && (
                  <li>
                    <strong>Height:</strong> {player.strHeight}
                  </li>
                )}
                {player.strWeight && (
                  <li>
                    <strong>Weight:</strong> {player.strWeight}
                  </li>
                )}
                {player.strTeam && player.idTeam && (
                  <li>
                    <strong>Team:</strong>{" "}
                    <Link to={`/team/${player.idTeam}`}>{player.strTeam}</Link>
                  </li>
                )}
              </ul>
            </section>

            {player.strDescriptionEN && (
              <section className="stats-block">
                <h3>About</h3>
                <p className="detail-bio">{player.strDescriptionEN}</p>
              </section>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default PlayerDetail;

