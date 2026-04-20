import Navbar from "./Navbar";
import { SportCard } from "./homepage";

const FOOTBALL_LEAGUES = [
  { id: 4391, title: "NFL", description: "National Football League" },
  /* id's are incorrect for all but NFL*/
  { id: 4718, title: "XFL", description: "Spring football league" },
  { id: 5262, title: "USFL", description: "United States Football League" },
  { id: 4405, title: "CFL", description: "Canadian Football League" },
  { id: 4470, title: "Arena Football", description: "Indoor football league" }
];

function Football() {
  return (
    <div className="homepage">
      <Navbar />

      <div className="cards-container">
        {FOOTBALL_LEAGUES.map(l => (
          <SportCard key={l.id} title={l.title} leagueId={l.id} mode="navigate" />
        ))}
      </div>
    </div>
  );
}

export default Football;