import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import { fetchFromSportsDB } from "./lib/apiClient.js";
import "./league-page.css";
import "./player-detail.css";

/** Prefer SportsDB CDN headshot/cutout with /medium where applicable */
function resolvePlayerHeroImageUrl(player) {
  if (!player) return "";
  const raw = (player.strCutout || player.strThumb || player.strRender || "")
    .toString()
    .trim();
  if (!raw || raw === "null") return "";
  let url = raw;
  if (url.startsWith("//")) url = `https:${url}`;
  else if (!/^https?:\/\//i.test(url)) {
    if (url.startsWith("/")) url = `https://r2.thesportsdb.com${url}`;
    else url = `https://${url}`;
  }
  const isPlayerMedia = /\/images\/media\/player\/(cutout|thumb|render)\//i.test(
    url
  );
  const isSportsDbHost = /(r2|www)\.thesportsdb\.com/i.test(url);
  if (isSportsDbHost && isPlayerMedia) {
    url = url.replace(/\/(preview|small|tiny)(\/?)$/i, "/medium$2");
    if (!/\/medium\/?$/i.test(url) && /\.(png|jpg|jpeg|webp)$/i.test(url)) {
      url = `${url.replace(/\/?$/, "")}/medium`;
    }
  }
  return url;
}

function pickPlayerBio(player) {
  if (!player) return "";
  const raw =
    player.strDescriptionEN || player.strDescription || player.strBiographyEN || "";
  const s = String(raw).trim();
  if (!s || s === "null") return "";
  return s
    .replace(/\r\n/g, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .trim();
}

function dash(v) {
  const s = String(v ?? "").trim();
  return s && s !== "null" ? s : "—";
}

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

  const heroImageUrl = useMemo(
    () => resolvePlayerHeroImageUrl(player),
    [player]
  );

  const bioText = useMemo(() => pickPlayerBio(player), [player]);

  return (
    <>
      <Navbar />
      <div className="league-page player-detail-page">
        <div className="league-container">
          {loading && (
            <div className="league-panel player-detail-state">Loading…</div>
          )}
          {error && !loading && (
            <div className="league-panel player-detail-state">{error}</div>
          )}

          {!loading && !error && player && (
            <>
              <section className="league-hero">
                <div
                  className={`league-hero-left team-hero-left player-hero-left${
                    heroImageUrl ? " player-hero-left--cutout" : ""
                  }`}
                >
                  {heroImageUrl && (
                    <img
                      className="player-hero-cutout-watermark"
                      src={heroImageUrl}
                      alt=""
                      aria-hidden
                      loading="eager"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const el = e.currentTarget;
                        const base = el.src.replace(
                          /\/(medium|small|preview|tiny)\/?$/i,
                          ""
                        );
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
                    {(player.strSport || "PLAYER").toString().toUpperCase()}
                  </p>

                  <h1>{dash(player.strPlayer)}</h1>

                  <div className="player-hero-identity">
                    <div className="player-hero-identity-row">
                      <span className="player-hero-identity-label">Position</span>
                      <span className="player-hero-identity-value">
                        {dash(player.strPosition)}
                      </span>
                    </div>
                    <div className="player-hero-identity-row">
                      <span className="player-hero-identity-label">Team</span>
                      <span className="player-hero-identity-value">
                        {player.idTeam && player.strTeam ? (
                          <Link to={`/team/${player.idTeam}`}>
                            {player.strTeam}
                          </Link>
                        ) : (
                          dash(player.strTeam)
                        )}
                      </span>
                    </div>
                    <div className="player-hero-identity-row">
                      <span className="player-hero-identity-label">
                        Place of birth
                      </span>
                      <span className="player-hero-identity-value">
                        {dash(
                          player.strBirthLocation ||
                            player.strBorn ||
                            player.strBirthCountry
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="player-hero-actions">
                    {player.idTeam && (
                      <Link
                        className="league-btn-primary"
                        to={`/team/${player.idTeam}`}
                      >
                        Team page
                      </Link>
                    )}
                    {player.idLeague && (
                      <Link
                        className="league-btn-secondary"
                        to={`/league/${player.idLeague}`}
                      >
                        League page
                      </Link>
                    )}
                  </div>
                </div>

                <div className="league-hero-right player-hero-profile">
                  <div className="featured-label">Profile</div>
                  <dl className="player-profile-dl">
                    <div className="player-profile-row">
                      <dt>Date of birth</dt>
                      <dd>{dash(player.dateBorn)}</dd>
                    </div>
                    <div className="player-profile-row">
                      <dt>Height</dt>
                      <dd>{dash(player.strHeight)}</dd>
                    </div>
                    <div className="player-profile-row">
                      <dt>Weight</dt>
                      <dd>{dash(player.strWeight)}</dd>
                    </div>
                    <div className="player-profile-row">
                      <dt>Current team</dt>
                      <dd>
                        {player.idTeam && player.strTeam ? (
                          <Link to={`/team/${player.idTeam}`}>
                            {player.strTeam}
                          </Link>
                        ) : (
                          dash(player.strTeam)
                        )}
                      </dd>
                    </div>
                  </dl>
                </div>
              </section>

              <section className="league-bottom-grid player-detail-about-section">
                <div className="league-panel">
                  <h2>About Player</h2>
                  {bioText ? (
                    <div className="player-detail-about-body">{bioText}</div>
                  ) : (
                    <p className="player-detail-about-empty">
                      No biography available for this player.
                    </p>
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

export default PlayerDetail;
