import { normalizeTeamKey } from "./normalizeTeamKey.js";

export const NHL_LEAGUE_ID = "4380";

export function isNhlTeam(team) {
  return String(team?.idLeague ?? "").trim() === NHL_LEAGUE_ID;
}

const NHL_CORE_BY_TEAM = {
  "anaheim ducks": ["Trevor Zegras", "Troy Terry", "Mason McTavish", "Leo Carlsson", "Frank Vatrano", "Cam Fowler", "Lukas Dostal", "Radko Gudas"],
  "boston bruins": ["David Pastrňák", "Charlie McAvoy", "Brad Marchand", "Pavel Zacha", "Hampus Lindholm", "Jeremy Swayman", "Charlie Coyle", "Matthew Poitras"],
  "buffalo sabres": ["Rasmus Dahlin", "Tage Thompson", "Alex Tuch", "Dylan Cozens", "Owen Power", "Ukko-Pekka Luukkonen", "Bowen Byram", "JJ Peterka"],
  "calgary flames": ["Nazem Kadri", "MacKenzie Weegar", "Jonathan Huberdeau", "Rasmus Andersson", "Jacob Markström", "Yegor Sharangovich", "Blake Coleman", "Connor Zary"],
  "carolina hurricanes": ["Sebastian Aho", "Andrei Svechnikov", "Jaccob Slavin", "Brent Burns", "Martin Nečas", "Seth Jarvis", "Frederik Andersen", "Teuvo Teräväinen"],
  "chicago blackhawks": ["Connor Bedard", "Seth Jones", "Taylor Hall", "Tyler Bertuzzi", "Nick Foligno", "Petr Mrázek", "Philipp Kurashev", "Jason Dickinson"],
  "colorado avalanche": ["Nathan MacKinnon", "Cale Makar", "Mikko Rantanen", "Devon Toews", "Artturi Lehkonen", "Alexandar Georgiev", "Valeri Nichushkin", "Samuel Girard"],
  "columbus blue jackets": ["Johnny Gaudreau", "Zach Werenski", "Kirill Marchenko", "Kent Johnson", "Boone Jenner", "Adam Fantilli", "Elvis Merzļikins", "Damon Severson"],
  "dallas stars": ["Jason Robertson", "Miro Heiskanen", "Roope Hintz", "Jake Oettinger", "Wyatt Johnston", "Matt Duchene", "Jamie Benn", "Tyler Seguin"],
  "detroit red wings": ["Dylan Larkin", "Lucas Raymond", "Alex DeBrincat", "Moritz Seider", "Patrick Kane", "Ville Husso", "Simon Edvinsson", "J.T. Compher"],
  "edmonton oilers": ["Connor McDavid", "Leon Draisaitl", "Evan Bouchard", "Zach Hyman", "Ryan Nugent-Hopkins", "Stuart Skinner", "Darnell Nurse", "Mattias Ekholm"],
  "florida panthers": ["Aleksander Barkov", "Matthew Tkachuk", "Sam Reinhart", "Sergei Bobrovsky", "Aaron Ekblad", "Sam Bennett", "Carter Verhaeghe", "Gustav Forsling"],
  "los angeles kings": ["Anže Kopitar", "Adrian Kempe", "Kevin Fiala", "Drew Doughty", "Quinton Byfield", "Brandt Clarke", "Phillip Danault", "Cam Talbot"],
  "minnesota wild": ["Kirill Kaprizov", "Joel Eriksson Ek", "Mats Zuccarello", "Brock Faber", "Marco Rossi", "Matt Boldy", "Jared Spurgeon", "Filip Gustavsson"],
  "montreal canadiens": ["Nick Suzuki", "Cole Caufield", "Juraj Slafkovský", "Kaiden Guhle", "Mike Matheson", "Sam Montembeault", "Brendan Gallagher", "Alex Newhook"],
  "nashville predators": ["Roman Josi", "Filip Forsberg", "Juuse Saros", "Ryan O'Reilly", "Brady Skjei", "Steven Stamkos", "Jonathan Marchessault", "Tommy Novak"],
  "new jersey devils": ["Jack Hughes", "Nico Hischier", "Jesper Bratt", "Luke Hughes", "Dougie Hamilton", "Timo Meier", "Jacob Markström", "Dawson Mercer"],
  "new york islanders": ["Mathew Barzal", "Bo Horvat", "Noah Dobson", "Ilya Sorokin", "Brock Nelson", "Kyle Palmieri", "Ryan Pulock", "Anders Lee"],
  "new york rangers": ["Artemi Panarin", "Adam Fox", "Igor Shesterkin", "Chris Kreider", "Mika Zibanejad", "Vincent Trocheck", "Alexis Lafrenière", "K'Andre Miller"],
  "ottawa senators": ["Brady Tkachuk", "Tim Stützle", "Jake Sanderson", "Thomas Chabot", "Drake Batherson", "Linus Ullmark", "Claude Giroux", "Shane Pinto"],
  "philadelphia flyers": ["Travis Konecny", "Sean Couturier", "Owen Tippett", "Travis Sanheim", "Jamie Drysdale", "Ivan Fedotov", "Cam York", "Morgan Frost"],
  "pittsburgh penguins": ["Sidney Crosby", "Evgeni Malkin", "Kris Letang", "Erik Karlsson", "Bryan Rust", "Tristan Jarry", "Rickard Rakell", "Lars Eller"],
  "san jose sharks": ["Macklin Celebrini", "Will Smith", "Logan Couture", "Mario Ferraro", "William Eklund", "Yaroslav Askarov", "Tyler Toffoli", "Fabian Zetterlund"],
  "seattle kraken": ["Matty Beniers", "Jared McCann", "Vince Dunn", "Brandon Montour", "Jordan Eberle", "Philipp Grubauer", "Shane Wright", "Oliver Bjorkstrand"],
  "st louis blues": ["Robert Thomas", "Jordan Kyrou", "Pavel Buchnevich", "Colton Parayko", "Jordan Binnington", "Brayden Schenn", "Justin Faulk", "Jake Neighbours"],
  "tampa bay lightning": ["Nikita Kucherov", "Brayden Point", "Victor Hedman", "Andrei Vasilevskiy", "Jake Guentzel", "Brandon Hagel", "Anthony Cirelli", "Mikhail Sergachev"],
  "toronto maple leafs": ["Auston Matthews", "Mitch Marner", "William Nylander", "John Tavares", "Morgan Rielly", "Joseph Woll", "Matthew Knies", "Chris Tanev"],
  "utah hockey club": ["Clayton Keller", "Logan Cooley", "Nick Schmaltz", "Mikhail Sergachev", "Lawson Crouse", "Karel Vejmelka", "Sean Durzi", "Dylan Guenther"],
  "vancouver canucks": ["Quinn Hughes", "Elias Pettersson", "J.T. Miller", "Brock Boeser", "Thatcher Demko", "Filip Hronek", "Conor Garland", "Nils Höglander"],
  "vegas golden knights": ["Jack Eichel", "Mark Stone", "Shea Theodore", "Alex Pietrangelo", "Adin Hill", "William Karlsson", "Jonathan Marchessault", "Ivan Barbashev"],
  "washington capitals": ["Alex Ovechkin", "John Carlson", "Dylan Strome", "Tom Wilson", "Charlie Lindgren", "Pierre-Luc Dubois", "Jakob Chychrun", "Aliaksei Protas"],
  "winnipeg jets": ["Connor Hellebuyck", "Kyle Connor", "Mark Scheifele", "Josh Morrissey", "Nikolaj Ehlers", "Cole Perfetti", "Adam Lowry", "Gabriel Vilardi"],
};

export function getNhlCuratedRoster(team) {
  if (!isNhlTeam(team)) return null;
  const key = normalizeTeamKey(team?.strTeam);
  if (!key) return null;
  const rows = NHL_CORE_BY_TEAM[key];
  if (!Array.isArray(rows) || rows.length === 0) return null;
  return rows.map((name) => ({ strPlayer: name, strPosition: "—" }));
}
