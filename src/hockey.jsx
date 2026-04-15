import Navbar from "./Navbar";
import SportCategoryCard from "./SportCategoryCard";
import "./sports-page.css";

const HOCKEY_LEAGUES = [
  { id: 4380, title: "NHL", description: "National Hockey League" },
    /* id's are incorrect for all but NHL*/
  { id: 4389, title: "KHL", description: "Russia" },
  { id: 4390, title: "UK Elite League", description: "UK" },
  { id: 4392, title: "SHL", description: "Sweden" },
    { id: 4393, title: "Liiga", description: "Finland" },
    { id: 4394, title: "DEL", description: "Germany" }

];

function Hockey() {
  return (
    <div className="sport-page">
      <Navbar />

      <div className="sport-cards-container">
        {HOCKEY_LEAGUES.map(l => (
          <SportCategoryCard key={l.id} {...l} />
        ))}
      </div>
    </div>
  );
}

export default Hockey;