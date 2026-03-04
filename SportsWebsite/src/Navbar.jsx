import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./HomePage.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
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

  return (
    <>
      <header className="top-nav">
        <div className="nav-left">
          <button 
            className="icon-btn"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>

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
          />
        </div>

        <div className="nav-right">
          <button className="circle-btn" onClick={toggleTheme}>
            {darkMode ? "🌙" : "☀️"}
          </button>
          <button className="nav-btn">Sign In</button>
        </div>
      </header>

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
    </>
  );
}