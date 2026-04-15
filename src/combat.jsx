import Navbar from "./Navbar";
import SportCategoryCard from "./SportCategoryCard";
import "./sports-page.css";

const COMBAT_LEAGUES = [
    /* All id's are incorrect */
  { id: 4378, title: "UFC", description: "Mixed Martial Arts" },
  { id: 4399, title: "Bellator", description: "MMA promotion" },
  { id: 4400, title: "ONE Championship", description: "Asia-based MMA promotion" },
  { id: 4445, title: "Boxing", description: "Boxing" },
  { id: 4446, title: "Kickboxing", description: "Kickboxing" },
  { id: 4447, title: "Wrestling", description: "Professional wrestling" }  
];

function Combat() {
  return (
    <div className="sport-page">
      <Navbar />

      <div className="sport-cards-container">
        {COMBAT_LEAGUES.map(l => (
          <SportCategoryCard key={l.id} {...l} />
        ))}
      </div>
    </div>
  );
}

export default Combat;