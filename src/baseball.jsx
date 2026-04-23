import Navbar from "./Navbar";
import { SportCard } from "./homepage";

const BASEBALL_LEAGUES = [
  { id: 4424, title: "MLB", description: "Major League Baseball" },
  /* id's are incorrect for all but MLB*/
  { id: 4591, title: "NPB", description: "Japan" },
  { id: 4465, title: "KBO", description: "Korea" },
  { id: 4467, title: "CPBL", description: "Taiwan" },
  { id: 4468, title: "LMB", description: "Mexico" },
  { id: 4469, title: "Australian Baseball League", description: "Australia" }
];

function Baseball() {
  const sportBackgroundImageId = 4424;
  return (
    <div className="homepage">
      <Navbar />

      <div className="cards-container">
        {BASEBALL_LEAGUES.map(l => (
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

export default Baseball;