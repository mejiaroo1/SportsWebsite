import React from "react";
import "./HomePage.css";

export default function HomePage() {
  return (
    <div className="homepage">

      {/* Header of page */}
      <header className="top-nav">
        <div className="nav-left">
          <button className="icon-btn">☰</button> 
          <h1 className="logo">DataPlay</h1>
          <a href="/about" className="nav-link">About Us</a>
        </div>

        <div className="nav-center">
        </div>

        <div className="nav-right">
          <button className="pill-btn">CT</button>
          <input
            type="text"
            placeholder="Search teams, players, leagues..."
            className="search-bar"
          />
          <button className="circle-btn">🌙</button> 
          <button className="nav-btn">Sign In</button>
        </div>
      </header>

      {/* Selections for sports cards */}
      <main className="cards-container">
        <SportCard title="Basketball" />
        <SportCard title="Baseball" />
        <SportCard title="Football" />
        <SportCard title="Soccer" />
        <SportCard title="Hockey" />
        <SportCard title="More" />
      </main>

    </div>
  );
}

/* card layout */
function SportCard({ title }) {
  return (
    <div className="sport-card">
      <div className="card-header">
        <span className="add-icon">＋</span>
        <h2>{title}</h2>
      </div>

      {/* Placeholder for live scores */}
      <div className="live-score">
        <p>Live Scores Scrolling...</p>
      </div>

      {/* Placeholder for team standings */}
      <div className="standings">
        <p>Team Standings Window</p>
      </div>
    </div>
  );
}