import Navbar from "./Navbar";
import { SportCard } from "./homepage";

const BASKETBALL_LEAGUES = [
  { id: 4387, title: "NBA", description: "National Basketball Association" },
    /* id's are incorrect for all but NBA*/
  { id: 4516, title: "WNBA", description: "Women's National Basketball Association" },
  { id: 4442, title: "CBA", description: "China Basketball Association" },
  { id: 4408, title: "Liga ACB", description: "Spanish basketball league" },
  { id: 4423, title: "LNB", description: "French basketball league" },
  { id: 4546, title: "EuroLeague", description: "Top European league" }
];

function Basketball() {
  return (
    <div className="homepage">
      <Navbar />

      <div className="cards-container">
        {BASKETBALL_LEAGUES.map(l => (
          <SportCard key={l.id} title={l.title} leagueId={l.id} mode="navigate" />
        ))}
      </div>
    </div>
  );
}

export default Basketball;