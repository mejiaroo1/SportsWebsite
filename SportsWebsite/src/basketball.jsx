import React, { useMemo, useState } from "react";
import Navbar from "./Navbar"; // Added Navbar
import "./basketball.css";

function Basketball() {
  const featuredGame = {
    status: "Final",
    away: { team: "Boston Celtics", score: 112 },
    home: { team: "Los Angeles Lakers", score: 108 },
    note: "Featured Matchup",
  };

  const recentResults = [
    { matchup: "Celtics vs Lakers", score: "112 - 108" },
    { matchup: "Warriors vs Suns", score: "119 - 113" },
    { matchup: "Bucks vs Heat", score: "105 - 98" },
    { matchup: "Knicks vs Nets", score: "110 - 104" },
  ];

  const upcomingGames = [
    { matchup: "Warriors vs Suns", date: "March 20, 2026", time: "7:30 PM", arena: "Chase Center" },
    { matchup: "Bucks vs Heat", date: "March 21, 2026", time: "8:00 PM", arena: "Fiserv Forum" },
    { matchup: "Knicks vs Nets", date: "March 22, 2026", time: "6:00 PM", arena: "Madison Square Garden" },
  ];

  const players = [
    { name: "Jayson Tatum", team: "Boston Celtics", pts: 29.4, reb: 8.7, ast: 5.9 },
    { name: "Stephen Curry", team: "Golden State Warriors", pts: 27.8, reb: 4.8, ast: 6.3 },
    { name: "Giannis Antetokounmpo", team: "Milwaukee Bucks", pts: 31.1, reb: 11.2, ast: 6.0 },
    { name: "Luka Doncic", team: "Dallas Mavericks", pts: 30.2, reb: 9.1, ast: 8.4 },
    { name: "Jalen Brunson", team: "New York Knicks", pts: 26.5, reb: 3.9, ast: 6.8 },
    { name: "Kevin Durant", team: "Phoenix Suns", pts: 28.1, reb: 7.1, ast: 5.4 },
  ];

  const standings = [
    { team: "Boston Celtics", w: 58, l: 24 },
    { team: "Milwaukee Bucks", w: 54, l: 28 },
    { team: "New York Knicks", w: 51, l: 31 },
    { team: "Cleveland Cavaliers", w: 49, l: 33 },
    { team: "Miami Heat", w: 46, l: 36 },
    { team: "Philadelphia 76ers", w: 44, l: 38 },
  ];

  const leaders = [
    { label: "Top Scorer", value: "Giannis Antetokounmpo", stat: "31.1 PPG" },
    { label: "Best Record", value: "Boston Celtics", stat: "58-24" },
    { label: "Best Playmaker", value: "Luka Doncic", stat: "8.4 APG" },
    { label: "Most Rebounds", value: "Giannis Antetokounmpo", stat: "11.2 RPG" },
  ];

  const [search, setSearch] = useState("");

  const filteredPlayers = useMemo(() => {
    return players.filter((player) => {
      const text = `${player.name} ${player.team}`.toLowerCase();
      return text.includes(search.toLowerCase());
    });
  }, [search]);

  return (
    <>
      {/* Navbar included at the top */}
      <Navbar />

      <div className="basketball-page">
        <div className="basketball-container">
          <section className="basketball-hero">
            <div className="basketball-hero-left">
              <p className="basketball-small-title">NBA COVERAGE</p>
              <h1>Basketball Central</h1>
              <p className="basketball-subtitle">
                Scores schedules player stats standings and top performers in one place.
              </p>

              <div className="basketball-hero-buttons">
                <a href="#standings" className="basketball-btn-primary">View Standings</a>
                <a href="#players" className="basketball-btn-secondary">Top Players</a>
              </div>
            </div>

            <div className="basketball-hero-right">
              <div className="featured-label">{featuredGame.status}</div>
              <div className="featured-teams">
                <div className="featured-team-block">
                  <span className="featured-team-name">{featuredGame.away.team}</span>
                  <span className="featured-team-score">{featuredGame.away.score}</span>
                </div>

                <div className="featured-vs">VS</div>

                <div className="featured-team-block align-right">
                  <span className="featured-team-name">{featuredGame.home.team}</span>
                  <span className="featured-team-score">{featuredGame.home.score}</span>
                </div>
              </div>

              <p className="featured-note">{featuredGame.note}</p>
            </div>
          </section>

          <section className="leaders-grid">
            {leaders.map((item, index) => (
              <div className="leader-card" key={index}>
                <p className="leader-label">{item.label}</p>
                <h3>{item.value}</h3>
                <span>{item.stat}</span>
              </div>
            ))}
          </section>

          <section className="basketball-main-grid">
            <div className="basketball-panel">
              <div className="panel-title-row">
                <h2>Recent Results</h2>
              </div>

              <div className="list-items">
                {recentResults.map((game, index) => (
                  <div className="list-row" key={index}>
                    <div>
                      <p className="row-title">{game.matchup}</p>
                      <p className="row-sub">{game.score}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="basketball-panel">
              <div className="panel-title-row">
                <h2>Upcoming Games</h2>
              </div>

              <div className="list-items">
                {upcomingGames.map((game, index) => (
                  <div className="list-row" key={index}>
                    <div>
                      <p className="row-title">{game.matchup}</p>
                      <p className="row-sub">{game.date}</p>
                      <p className="row-sub">{game.time}</p>
                      <p className="row-sub">{game.arena}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="basketball-bottom-grid">
            <div className="basketball-panel" id="players">
              <div className="panel-title-row">
                <h2>Top Players</h2>
                <input
                  type="text"
                  placeholder="Search player or team"
                  className="player-search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="player-list">
                {filteredPlayers.map((player, index) => (
                  <div className="player-card" key={index}>
                    <h3>{player.name}</h3>
                    <p>{player.team}</p>
                    <span>
                      {player.pts} PPG | {player.reb} RPG | {player.ast} APG
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="basketball-panel" id="standings">
              <div className="panel-title-row">
                <h2>Eastern Conference Standings</h2>
              </div>

              <div className="standings-table-wrap">
                <table className="standings-table">
                  <thead>
                    <tr>
                      <th>Team</th>
                      <th>W</th>
                      <th>L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.map((team, index) => (
                      <tr key={index}>
                        <td>{team.team}</td>
                        <td>{team.w}</td>
                        <td>{team.l}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="basketball-highlights">
            <div className="basketball-panel">
              <div className="panel-title-row">
                <h2>Highlights</h2>
              </div>

              <div className="highlights-grid">
                <div className="highlight-box">
                  <h3>Clutch Wins</h3>
                  <p>
                    Boston continues closing out tight games with strong fourth quarter defense and shot making.
                  </p>
                </div>

                <div className="highlight-box">
                  <h3>Star Performers</h3>
                  <p>
                    The league’s best players are still putting up huge scoring numbers every night.
                  </p>
                </div>

                <div className="highlight-box">
                  <h3>Playoff Race</h3>
                  <p>
                    Teams in the middle of the standings are fighting for position as the season gets tighter.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default Basketball;