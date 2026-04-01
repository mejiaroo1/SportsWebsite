import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./homepage";
import AboutUs from "./aboutus";
import Basketball from "./basketball";
import LeagueDetail from "./LeagueDetail.jsx";
import TeamDetail from "./TeamDetail.jsx";
import PlayerDetail from "./PlayerDetail.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/league/:id" element={<LeagueDetail />} />
        <Route path="/team/:id" element={<TeamDetail />} />
        <Route path="/basketball" element={<Basketball />} />
        <Route path="/player/:id" element={<PlayerDetail />} />
      </Routes>
    </Router>
  );
}

export default App;