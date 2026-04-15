import Navbar from "./Navbar";
import SportCategoryCard from "./SportCategoryCard";
import "./sports-page.css";

const BASEBALL_LEAGUES = [
  { id: 4424, title: "MLB", description: "Major League Baseball" },
  /* id's are incorrect for all but MLB*/
  { id: 4466, title: "NPB", description: "Japan" },
  { id: 4465, title: "KBO", description: "Korea" },
  { id: 4467, title: "CPBL", description: "Taiwan" },
  { id: 4468, title: "LMB", description: "Mexico" },
  { id: 4469, title: "Australian Baseball League", description: "Australia" }
];

function Baseball() {
  return (
    <div className="sport-page">
      <Navbar />

      <div className="sport-cards-container">
        {BASEBALL_LEAGUES.map(l => (
          <SportCategoryCard key={l.id} {...l} />
        ))}
      </div>
    </div>
  );
}

export default Baseball;