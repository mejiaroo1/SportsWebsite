import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="homepage">

      <header className="top-nav">
        <div className="nav-left">
          <button 
            className="icon-btn"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button> 

          <h1 className="logo">DataPlay</h1>
          <Link to="/about" className="nav-link">About Us</Link>
        </div>

        <div className="nav-center">
          <input
            type="text"
            placeholder="Search teams, players, leagues..."
            className="search-bar"
          />
        </div>

        <div className="nav-right">
          <button className="circle-btn">🌙</button> 
          <button className="nav-btn">Sign In</button>
        </div>
      </header>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="dropdown-menu">
          <Link to="/sports/basketball" className="dropdown-link">Basketball</Link>
          <Link to="/sports/baseball" className="dropdown-link">Baseball</Link>
          <Link to="/sports/motorsport" className="dropdown-link">Motorsport</Link>
          <Link to="/sports/soccer" className="dropdown-link">Soccer</Link>
          <Link to="/sports/fighting" className="dropdown-link">Fighting</Link>
          <Link to="/sports/more" className="dropdown-link">More</Link>
        </div>
      )}

      <main className="cards-container">
        <SportCard title="Basketball" />
        <SportCard title="Baseball" />
        <SportCard title="Motorsport" />
        <SportCard title="Soccer" />
        <SportCard title="Fighting" />
        <SportCard title="More" />
      </main>

    </div>
  );
}

function SportCard({ title }) {
  return (
    <div className="sport-card">
      <div className="card-header">
        <span className="add-icon">＋</span>
        <h2>{title}</h2>
      </div>

      <div className="live-score">
        <p>Live Scores Scrolling...</p>
      </div>

      <div className="standings">
        <p>Team Standings Window</p>
      </div>
    </div>
  );
}