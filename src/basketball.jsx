import Navbar from "./Navbar";
import SportCategoryCard from "./SportCategoryCard";
import "./sports-page.css";

const BASKETBALL_LEAGUES = [
  { id: 4387, title: "NBA", description: "National Basketball Association" },
    /* id's are incorrect for all but NBA*/
  { id: 120, title: "WNBA", description: "Women's National Basketball Association" },
  { id: 4388, title: "CBA", description: "China Basketball Association" },
  { id: 4406, title: "Liga ACB", description: "Spanish basketball league" },
  { id: 4435, title: "LNB", description: "French basketball league" },
  { id: 4607, title: "EuroLeague", description: "Top European league" }
];

function Basketball() {
  return (
    <div className="sport-page">
      <Navbar />

      <div className="sport-cards-container">
        {BASKETBALL_LEAGUES.map(l => (
          <SportCategoryCard key={l.id} {...l} />
        ))}
      </div>
    </div>
  );
}

export default Basketball;