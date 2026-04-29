import { normalizeTeamKey } from "./normalizeTeamKey.js";

export const MLB_LEAGUE_ID = "4424";

export function isMlbTeam(team) {
  return String(team?.idLeague ?? "").trim() === MLB_LEAGUE_ID;
}

const MLB_CORE_BY_TEAM = {
  "arizona diamondbacks": ["Corbin Carroll", "Ketel Marte", "Zac Gallen", "Christian Walker", "Gabriel Moreno", "Lourdes Gurriel Jr.", "Merrill Kelly", "Eugenio Suárez"],
  "atlanta braves": ["Ronald Acuña Jr.", "Matt Olson", "Austin Riley", "Ozzie Albies", "Spencer Strider", "Chris Sale", "Sean Murphy", "Michael Harris II"],
  "baltimore orioles": ["Gunnar Henderson", "Adley Rutschman", "Jordan Westburg", "Grayson Rodriguez", "Jackson Holliday", "Colton Cowser", "Cedric Mullins", "Anthony Santander"],
  "boston red sox": ["Rafael Devers", "Triston Casas", "Jarren Duran", "Brayan Bello", "Trevor Story", "Masataka Yoshida", "Tanner Houck", "Ceddanne Rafaela"],
  "chicago cubs": ["Seiya Suzuki", "Dansby Swanson", "Nico Hoerner", "Ian Happ", "Shota Imanaga", "Justin Steele", "Cody Bellinger", "Christopher Morel"],
  "chicago white sox": ["Luis Robert Jr.", "Andrew Vaughn", "Garrett Crochet", "Yoán Moncada", "Eloy Jiménez", "Michael Kopech", "Korey Lee", "Paul DeJong"],
  "cincinnati reds": ["Elly De La Cruz", "Spencer Steer", "Hunter Greene", "Matt McLain", "Jeimer Candelario", "Nick Lodolo", "Christian Encarnacion-Strand", "Tyler Stephenson"],
  "cleveland guardians": ["José Ramírez", "Steven Kwan", "Shane Bieber", "Josh Naylor", "Andrés Giménez", "Emmanuel Clase", "Triston McKenzie", "Bo Naylor"],
  "colorado rockies": ["Kris Bryant", "Brendan Rodgers", "Ezequiel Tovar", "Nolan Jones", "Ryan McMahon", "Kyle Freeland", "German Márquez", "Brenton Doyle"],
  "detroit tigers": ["Tarik Skubal", "Riley Greene", "Spencer Torkelson", "Kerry Carpenter", "Matt Vierling", "Javier Báez", "Casey Mize", "Parker Meadows"],
  "houston astros": ["Yordan Alvarez", "Jose Altuve", "Kyle Tucker", "Framber Valdez", "Alex Bregman", "Yainer Diaz", "Jeremy Peña", "Cristian Javier"],
  "kansas city royals": ["Bobby Witt Jr.", "Salvador Perez", "Cole Ragans", "Vinnie Pasquantino", "Maikel Garcia", "Brady Singer", "Seth Lugo", "MJ Melendez"],
  "los angeles angels": ["Mike Trout", "Taylor Ward", "Logan O'Hoppe", "Zach Neto", "Patrick Sandoval", "Reid Detmers", "Nolan Schanuel", "Luis Rengifo"],
  "los angeles dodgers": ["Shohei Ohtani", "Mookie Betts", "Freddie Freeman", "Yoshinobu Yamamoto", "Tyler Glasnow", "Will Smith", "Teoscar Hernández", "Max Muncy"],
  "miami marlins": ["Jazz Chisholm Jr.", "Jesús Luzardo", "Sandy Alcántara", "Jake Burger", "Eury Pérez", "Bryan De La Cruz", "Edward Cabrera", "Josh Bell"],
  "milwaukee brewers": ["Christian Yelich", "William Contreras", "Freddy Peralta", "Rhys Hoskins", "Willy Adames", "Brice Turang", "Devin Williams", "Jackson Chourio"],
  "minnesota twins": ["Carlos Correa", "Byron Buxton", "Pablo López", "Royce Lewis", "Joe Ryan", "Max Kepler", "Jhoan Duran", "Edouard Julien"],
  "new york mets": ["Francisco Lindor", "Pete Alonso", "Kodai Senga", "Brandon Nimmo", "Jeff McNeil", "Edwin Díaz", "Starling Marte", "Luis Severino"],
  "new york yankees": ["Aaron Judge", "Juan Soto", "Gerrit Cole", "Giancarlo Stanton", "Anthony Rizzo", "Carlos Rodón", "Gleyber Torres", "Anthony Volpe"],
  "oakland athletics": ["Brent Rooker", "Zack Gelof", "JJ Bleday", "Mason Miller", "Shea Langeliers", "Esteury Ruiz", "Paul Blackburn", "Seth Brown"],
  "philadelphia phillies": ["Bryce Harper", "Trea Turner", "Zack Wheeler", "J.T. Realmuto", "Kyle Schwarber", "Aaron Nola", "Alec Bohm", "Nick Castellanos"],
  "pittsburgh pirates": ["Oneil Cruz", "Bryan Reynolds", "Mitch Keller", "Ke'Bryan Hayes", "David Bednar", "Jared Jones", "Henry Davis", "Andrew McCutchen"],
  "san diego padres": ["Fernando Tatis Jr.", "Manny Machado", "Xander Bogaerts", "Yu Darvish", "Joe Musgrove", "Luis Arraez", "Jake Cronenworth", "Ha-Seong Kim"],
  "san francisco giants": ["Logan Webb", "Jung Hoo Lee", "Camilo Doval", "Patrick Bailey", "Thairo Estrada", "Michael Conforto", "Jorge Soler", "Kyle Harrison"],
  "seattle mariners": ["Julio Rodríguez", "Luis Castillo", "Cal Raleigh", "George Kirby", "Logan Gilbert", "J.P. Crawford", "Andrés Muñoz", "Jorge Polanco"],
  "st louis cardinals": ["Nolan Arenado", "Paul Goldschmidt", "Sonny Gray", "Willson Contreras", "Lars Nootbaar", "Masyn Winn", "Ryan Helsley", "Brendan Donovan"],
  "tampa bay rays": ["Yandy Díaz", "Randy Arozarena", "Isaac Paredes", "Shane McClanahan", "Zach Eflin", "Junior Caminero", "Pete Fairbanks", "Josh Lowe"],
  "texas rangers": ["Corey Seager", "Marcus Semien", "Adolis García", "Nathan Eovaldi", "Josh Jung", "Jonah Heim", "Max Scherzer", "Evan Carter"],
  "toronto blue jays": ["Vladimir Guerrero Jr.", "Bo Bichette", "Kevin Gausman", "George Springer", "Chris Bassitt", "Daulton Varsho", "Jordan Romano", "Alejandro Kirk"],
  "washington nationals": ["CJ Abrams", "MacKenzie Gore", "Josiah Gray", "Lane Thomas", "Keibert Ruiz", "James Wood", "Dylan Crews", "Kyle Finnegan"],
};

export function getMlbCuratedRoster(team) {
  if (!isMlbTeam(team)) return null;
  const key = normalizeTeamKey(team?.strTeam);
  if (!key) return null;
  const rows = MLB_CORE_BY_TEAM[key];
  if (!Array.isArray(rows) || rows.length === 0) return null;
  return rows.map((name) => ({ strPlayer: name, strPosition: "—" }));
}
