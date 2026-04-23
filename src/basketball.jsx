import Navbar from "./Navbar";
import { SportCard } from "./homepage";

const BASKETBALL_LEAGUES = [
  { id: 4387, title: "NBA", description: "National Basketball Association" },
  { id: 4516, title: "WNBA", description: "Women's National Basketball Association" },
  { id: 4442, title: "CBA", description: "China Basketball Association" },
  { id: 4423, title: "LNB", description: "French basketball league" },
  {id: 4546, title: "EuroLeague", description: "European basketball league"},
  {id: 4549, title: "FIBA Basketball World Cup", description: "International basketball competition"}
];

function Basketball() {
  const sportBackgroundImageId = 4387;
  return (
    <div className="homepage">
      <Navbar />

      <div className="cards-container">
        {BASKETBALL_LEAGUES.map(l => (
          <SportCard
            key={l.id}
            title={l.title}
            leagueId={l.id}
            mode="navigate"
            backgroundImageId={sportBackgroundImageId}
          />
        ))}
      </div>
    </div>
  );
}

export default Basketball;