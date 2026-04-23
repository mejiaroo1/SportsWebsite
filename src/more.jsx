import Navbar from "./Navbar";
import { SportCard } from "./homepage";

const MORE_SPORTS = [
  {
    sport: "Rugby",
    backgroundImageId: 4384,
    leagues: [
      { id: 4416, title: "NRL" },
      { id: 4551, title: "Super Rugby League" },
      { id: 4430, title: "French Top 14" },
    ],
  },
  {
    sport: "Cricket",
    backgroundImageId: 4413,
    leagues: [
      { id: 4460, title: "Indian Premier League" },
      { id: 4463, title: "English t20 Blast" },
      { id: 4461, title: "Australian Big Bash League" },
    ],
  },
  {
    sport: "Volleyball",
    backgroundImageId: 4541,
    leagues: [
      { id: 4582, title: "French Ligue A Mens Volleyball" },
      { id: 4544, title: "Italian Volleyball League" },
      { id: 5757, title: "Korean V-League" },
    ],
  },
  {
    sport: "Tennis",
    backgroundImageId: 4510,
    leagues: [
      { id: 4464, title: "ATP World Tour" },
      { id: 4517, title: "WTA Tour" },
      { id: 5347, title: "Davis Cup" },
    ],
  },
];

function More() {
  return (
    <div className="homepage">
      <Navbar />

      {MORE_SPORTS.map((group) => (
        <section key={group.sport} className="more-sport-section">
          <h2 className="more-sport-title">{group.sport}</h2>
          <div className="cards-container">
            {group.leagues.map((league) => (
              <SportCard
                key={league.id}
                title={league.title}
                leagueId={league.id}
                mode="navigate"
                backgroundImageId={group.backgroundImageId}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default More;
