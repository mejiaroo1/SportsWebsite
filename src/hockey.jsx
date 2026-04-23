import Navbar from "./Navbar";
import { SportCard } from "./homepage";

const HOCKEY_LEAGUES = [
  { id: 4380, title: "NHL", description: "National Hockey League" },
    /* id's are incorrect for all but NHL*/
  { id: 4920, title: "KHL", description: "Russia" },
  { id: 4381, title: "UK Elite League", description: "UK" },
  { id: 4419, title: "SHL", description: "Sweden" },
    { id: 4931, title: "Liiga", description: "Finland" },
    { id: 4925, title: "DEL", description: "Germany" }

];

function Hockey() {
  const sportBackgroundImageId = 4380;
  return (
    <div className="homepage">
      <Navbar />

      <div className="cards-container">
        {HOCKEY_LEAGUES.map(l => (
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

export default Hockey;