import { normalizeTeamKey } from "./normalizeTeamKey.js";

const NRL_ID = "4416";
const SUPER_RUGBY_ID = "4551";
const IPL_ID = "4460";
const BBL_ID = "4461";

const NRL_BY_TEAM = {
  "brisbane broncos": ["Reece Walsh", "Payne Haas", "Adam Reynolds", "Kotoni Staggs", "Patrick Carrigan", "Ezra Mam", "Herbie Farnworth", "Selwyn Cobbo"],
  "canberra raiders": ["Jamayne Isaako", "Jordan Rapana", "Joseph Tapine", "Hudson Young", "Jamal Fogarty", "Josh Papalii", "Sebastian Kris", "Xavier Savage"],
  "canterbury bankstown bulldogs": ["Matt Burton", "Viliame Kikau", "Stephen Crichton", "Reed Mahoney", "Max King", "Jake Averillo", "Jacob Kiraz", "Connor Tracey"],
  "cronulla sutherland sharks": ["Nicho Hynes", "Briton Nikora", "Sione Katoa", "Blayke Brailey", "Ronaldo Mulitalo", "Cameron McInnes", "Teig Wilton", "Will Kennedy"],
  dolphins: ["Hamiso Tabuai-Fidow", "Isaiya Katoa", "Kodi Nikorima", "Felise Kaufusi", "Tom Gilbert", "Jeremy Marshall-King", "Jamayne Isaako", "Herbie Farnworth"],
  "gold coast titans": ["Tino Fa'asuamaleaui", "AJ Brimson", "David Fifita", "Kieran Foran", "Alofiana Khan-Pereira", "Chris Randall", "Jayden Campbell", "Moeaki Fotuaika"],
  "manly warringah sea eagles": ["Tom Trbojevic", "Daly Cherry-Evans", "Haumole Olakau'atu", "Taniela Paseka", "Jake Trbojevic", "Reuben Garrick", "Tolutau Koula", "Lachlan Croker"],
  "melbourne storm": ["Cameron Munster", "Harry Grant", "Jahrome Hughes", "Xavier Coates", "Ryan Papenhuyzen", "Nelson Asofa-Solomona", "Trent Loiero", "Nick Meaney"],
  "newcastle knights": ["Kalyn Ponga", "Tyson Frizell", "Dane Gagai", "Jackson Hastings", "Leo Thompson", "Bradman Best", "Fletcher Sharpe", "Adam Elliott"],
  "new zealand warriors": ["Shaun Johnson", "Roger Tuivasa-Sheck", "Addin Fonua-Blake", "Tohu Harris", "Dallin Watene-Zelezniak", "Wayde Egan", "Charnze Nicoll-Klokstad", "Jackson Ford"],
  "north queensland cowboys": ["Tom Dearden", "Reuben Cotter", "Valentine Holmes", "Scott Drinkwater", "Jason Taumalolo", "Murray Taulagi", "Jeremiah Nanai", "Chad Townsend"],
  "parramatta eels": ["Mitchell Moses", "Clint Gutherson", "Junior Paulo", "Dylan Brown", "Maika Sivo", "Reagan Campbell-Gillard", "J'maine Hopgood", "Bryce Cartwright"],
  "penrith panthers": ["Nathan Cleary", "Isaah Yeo", "Dylan Edwards", "Brian To'o", "Jarome Luai", "Liam Martin", "Moses Leota", "Sunia Turuva"],
  "south sydney rabbitohs": ["Latrell Mitchell", "Cody Walker", "Damien Cook", "Cam Murray", "Alex Johnston", "Keaon Koloamatangi", "Jai Arrow", "Jack Wighton"],
  "st george illawarra dragons": ["Ben Hunt", "Moses Suli", "Tyrell Sloan", "Jack de Belin", "Zac Lomax", "Jaydn Su'A", "Toby Couchman", "Mikaele Ravalawa"],
  "sydney roosters": ["James Tedesco", "Sam Walker", "Joey Manu", "Joseph-Aukuso Suaalii", "Victor Radley", "Angus Crichton", "Jared Waerea-Hargreaves", "Brandon Smith"],
  "wests tigers": ["Api Koroisau", "Jahream Bula", "Stefano Utoikamanu", "John Bateman", "Daine Laurie", "Alex Twal", "Luke Brooks", "Junior Tupou"],
};

const SUPER_BY_TEAM = {
  blues: ["Hoskins Sotutu", "Rieko Ioane", "Mark Tele'a", "Dalton Papali'i", "Stephen Perofeta", "Caleb Clarke", "Finlay Christie", "Patrick Tuipulotu"],
  brumbies: ["Tom Wright", "Allan Alaalatoa", "Noah Lolesio", "Rob Valetini", "Len Ikitau", "Nick Frost", "Ryan Lonergan", "James Slipper"],
  chiefs: ["Damian McKenzie", "Shaun Stevenson", "Samipeni Finau", "Anton Lienert-Brown", "Luke Jacobson", "Brodie Retallick", "Cortez Ratima", "Quinn Tupaea"],
  crusaders: ["Will Jordan", "David Havili", "Scott Barrett", "Sevu Reece", "Ethan Blackadder", "Codie Taylor", "Richie Mo'unga", "Tamaiti Williams"],
  "fijian drua": ["Frank Lomani", "Mesake Doge", "Selestino Ravutaumada", "Iosefo Masi", "Tevita Ikanivere", "Vuate Karawalevu", "Etonia Waqa", "Meli Derenalagi"],
  highlanders: ["Folau Fakatava", "Mitch Hunt", "Billy Harmon", "Timoci Tavatavanawai", "Josh Dickson", "Caleb Tangitau", "Hugh Renton", "Thomas Umaga-Jensen"],
  hurricanes: ["Ardie Savea", "Jordie Barrett", "Cam Roigard", "Asafo Aumua", "Tyrel Lomax", "Brett Cameron", "Billy Proctor", "Du'Plessis Kirifi"],
  "melbourne rebels": ["Andrew Kellaway", "Matt Philip", "Rob Leota", "Carter Gordon", "Pone Fa'amausili", "Tupou Vaa'i", "Cabous Eloff", "Darby Lancaster"],
  "moana pasifika": ["Ardie Savea", "Danny Toala", "Fine Inisi", "Patrick Pellegrini", "Sione Havili Talitui", "Lotu Inisi", "Semisi Tupou Ta'eiloa", "William Havili"],
  "nsw waratahs": ["Mark Nawaqanitawase", "Taniela Tupou", "Ben Donaldson", "Charlie Gamble", "Langi Gleeson", "Jake Gordon", "Joseph-Aukuso Suaalii", "Lalakai Foketi"],
  "queensland reds": ["Tate McDermott", "Fraser McReight", "Harry Wilson", "Jock Campbell", "Tom Lynagh", "Lukhan Salakaia-Loto", "Filipo Daugunu", "Hunter Paisami"],
  "western force": ["Ben Donaldson", "Nic White", "Jeremy Williams", "Tom Robertson", "Harry Potter", "Feleti Kaitu'u", "Santiago Medrano", "Izack Rodda"],
};

const IPL_BY_TEAM = {
  "chennai super kings": ["MS Dhoni", "Ruturaj Gaikwad", "Ravindra Jadeja", "Deepak Chahar", "Moeen Ali", "Shivam Dube", "Matheesha Pathirana", "Devon Conway"],
  "delhi capitals": ["Rishabh Pant", "David Warner", "Axar Patel", "Kuldeep Yadav", "Mitchell Marsh", "Prithvi Shaw", "Anrich Nortje", "Khaleel Ahmed"],
  "gujarat titans": ["Shubman Gill", "Rashid Khan", "Mohammed Shami", "Sai Sudharsan", "Rahul Tewatia", "David Miller", "Wriddhiman Saha", "Noor Ahmad"],
  "kolkata knight riders": ["Shreyas Iyer", "Andre Russell", "Sunil Narine", "Rinku Singh", "Varun Chakravarthy", "Venkatesh Iyer", "Mitchell Starc", "Phil Salt"],
  "lucknow super giants": ["KL Rahul", "Nicholas Pooran", "Marcus Stoinis", "Ravi Bishnoi", "Mayank Yadav", "Krunal Pandya", "Ayush Badoni", "Quinton de Kock"],
  "mumbai indians": ["Rohit Sharma", "Jasprit Bumrah", "Suryakumar Yadav", "Hardik Pandya", "Ishan Kishan", "Tilak Varma", "Tim David", "Piyush Chawla"],
  "punjab kings": ["Shikhar Dhawan", "Sam Curran", "Arshdeep Singh", "Liam Livingstone", "Kagiso Rabada", "Jitesh Sharma", "Rahul Chahar", "Harpreet Brar"],
  "rajasthan royals": ["Sanju Samson", "Yashasvi Jaiswal", "Jos Buttler", "Riyan Parag", "Trent Boult", "Yuzvendra Chahal", "Ravichandran Ashwin", "Avesh Khan"],
  "royal challengers bengaluru": ["Virat Kohli", "Faf du Plessis", "Glenn Maxwell", "Mohammed Siraj", "Rajat Patidar", "Dinesh Karthik", "Cameron Green", "Yash Dayal"],
  "sunrisers hyderabad": ["Pat Cummins", "Travis Head", "Heinrich Klaasen", "Abhishek Sharma", "Bhuvneshwar Kumar", "Aiden Markram", "T Natarajan", "Mayank Markande"],
};

const BBL_BY_TEAM = {
  "adelaide strikers": ["Travis Head", "Alex Carey", "Chris Lynn", "Matthew Short", "Wes Agar", "Liam Scott", "Cameron Boyce", "Jamie Overton"],
  "brisbane heat": ["Usman Khawaja", "Marnus Labuschagne", "Xavier Bartlett", "Michael Neser", "Jimmy Peirson", "Matt Renshaw", "Spencer Johnson", "Colin Munro"],
  "hobart hurricanes": ["Matthew Wade", "Ben McDermott", "Nathan Ellis", "Caleb Jewell", "Chris Jordan", "Tim David", "Paddy Dooley", "Nikhil Chaudhary"],
  "melbourne renegades": ["Aaron Finch", "Shaun Marsh", "Will Sutherland", "Kane Richardson", "Adam Zampa", "Jake Fraser-McGurk", "Tom Rogers", "Joe Clarke"],
  "melbourne stars": ["Glenn Maxwell", "Marcus Stoinis", "Adam Milne", "Hilton Cartwright", "Beau Webster", "Sam Harper", "Nathan Coulter-Nile", "Luke Wood"],
  "perth scorchers": ["Ashton Turner", "Josh Inglis", "Jhye Richardson", "Aaron Hardie", "Andrew Tye", "Mitchell Marsh", "Jason Behrendorff", "Lance Morris"],
  "sydney sixers": ["Moises Henriques", "Sean Abbott", "Josh Philippe", "Steve Smith", "Ben Dwarshuis", "Jordan Silk", "Jackson Bird", "Hayden Kerr"],
  "sydney thunder": ["David Warner", "Alex Hales", "Chris Green", "Daniel Sams", "Tanveer Sangha", "Jason Sangha", "Nathan McAndrew", "Oliver Davies"],
};

const BY_LEAGUE_ID = {
  [NRL_ID]: NRL_BY_TEAM,
  [SUPER_RUGBY_ID]: SUPER_BY_TEAM,
  [IPL_ID]: IPL_BY_TEAM,
  [BBL_ID]: BBL_BY_TEAM,
};

export function getRugbyCricketCuratedRoster(team) {
  const lid = String(team?.idLeague ?? "").trim();
  const map = BY_LEAGUE_ID[lid];
  if (!map) return null;
  const key = normalizeTeamKey(team?.strTeam);
  if (!key) return null;
  const rows = map[key];
  if (!Array.isArray(rows) || rows.length === 0) return null;
  return rows.map((name) => ({ strPlayer: name, strPosition: "—" }));
}
