import Navbar from "./Navbar";
import { SportCard } from "./homepage";

const COMBAT_LEAGUES = [
    /* All id's are incorrect */
  { id: 4443, title: "UFC", description: "Mixed Martial Arts" },
  { id: 4467, title: "Bellator", description: "MMA promotion" },
  { id: 4495, title: "ONE Championship", description: "Asia-based MMA promotion" },
  { id: 4445, title: "Boxing", description: "Boxing" },
  { id: 4605, title: "Kickboxing", description: "Kickboxing" },
  { id: 4726, title: "Wrestling", description: "Professional wrestling" }  
];

function Combat() {
  const sportBackgroundImageId = 4443;
  return (
    <div className="homepage">
      <Navbar />

      <div className="cards-container">
        {COMBAT_LEAGUES.map(l => (
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

export default Combat;