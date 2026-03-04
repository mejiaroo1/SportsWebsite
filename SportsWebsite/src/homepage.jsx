import React, { useState } from "react";
import Navbar from "./Navbar";
import "./HomePage.css";

export default function HomePage() {
  const [activeCard, setActiveCard] = useState(null);

  const sports = [
    "Basketball",
    "Baseball",
    "Motorsport",
    "Soccer",
    "Fighting",
    "More"
  ];

  return (
    <div className="homepage">

      <Navbar />

      <main className="cards-container">

        {sports.map((sport) => (
          <SportCard
            key={sport}
            title={sport}
            isActive={activeCard === sport}
            isHidden={activeCard && activeCard !== sport}
            onClick={() => setActiveCard(sport)}
            onClose={() => setActiveCard(null)}
          />
        ))}

      </main>

    </div>
  );
}

function SportCard({ title, isActive, isHidden, onClick, onClose }) {
  return (
    <div
      className={`sport-card 
        ${isActive ? "expanded" : ""} 
        ${isHidden ? "hidden" : ""}`}
      onClick={!isActive ? onClick : undefined}
    >
      {isActive && (
        <button
          className="close-btn"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          ✕
        </button>
      )}

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