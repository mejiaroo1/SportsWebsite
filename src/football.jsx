import Navbar from "./Navbar";
import SportCategoryCard from "./SportCategoryCard";
import "./sports-page.css";

const FOOTBALL_LEAGUES = [
  { id: 4391, title: "NFL", description: "National Football League" },
  /* id's are incorrect for all but NFL*/
  { id: 4479, title: "XFL", description: "Spring football league" },
  { id: 4478, title: "USFL", description: "United States Football League" },
  { id: 4480, title: "CFL", description: "Canadian Football League" },
  { id: 4482, title: "Arena Football", description: "Indoor football league" }
];

function Football() {
  return (
    <div className="sport-page">
      <Navbar />

      <div className="sport-cards-container">
        {FOOTBALL_LEAGUES.map(l => (
          <SportCategoryCard key={l.id} {...l} />
        ))}
      </div>
    </div>
  );
}

export default Football;