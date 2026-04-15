import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./homepage";
import AboutUs from "./aboutus";
import Basketball from "./basketball";
import LeagueDetail from "./LeagueDetail.jsx";
import TeamDetail from "./TeamDetail.jsx";
import PlayerDetail from "./PlayerDetail.jsx";
import Soccer from "./soccer";
import Football from "./football";
import Baseball from "./baseball";
import Hockey from "./hockey";
import Combat from "./combat";
import LeaguePage from "./league-page.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUs />} />
        {/*<Route path="/league/:id" element={<LeagueDetail />} />*/}
        <Route path="/team/:id" element={<TeamDetail />} />
        <Route path="/basketball" element={<Basketball />} />
        <Route path="/player/:id" element={<PlayerDetail />} />
        <Route path="/soccer" element={<Soccer />} />
        <Route path="/football" element={<Football />} />
        <Route path="/baseball" element={<Baseball />} />
        <Route path="/icehockey" element={<Hockey />} />
        <Route path="/combat" element={<Combat />} />
        <Route path="/league/:id" element={<LeaguePage />} />
      </Routes>
    </Router>
  );
}

export default App;