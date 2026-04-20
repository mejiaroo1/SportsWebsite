import Navbar from "./Navbar";
import { SportCard } from "./homepage";

const SOCCER_LEAGUES = [
  { id: 4328, title: "Premier League", description: "England" },
  { id: 4335, title: "La Liga", description: "Spain" },
  { id: 4331, title: "Bundesliga", description: "Germany" },
  { id: 4332, title: "Serie A", description: "Italy" },
  { id: 4346, title: "MLS", description: "USA" },
  { id: 4334, title: "Ligue 1", description: "France" }
];

function Soccer() {
  return (
    <div className="homepage">
      <Navbar />

      <div className="cards-container">
        {SOCCER_LEAGUES.map(l => (
          <SportCard key={l.id} title={l.title} leagueId={l.id} mode="navigate" />
        ))}
      </div>
    </div>
  );
}

export default Soccer;