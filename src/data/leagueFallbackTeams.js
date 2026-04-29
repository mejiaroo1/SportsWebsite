/**
 * Fallback team (or searchable entry) names per TheSportsDB league id used in the app.
 * NCAA lists are generated JSON (see scripts/). Combat leagues omit teams in the UI.
 */
import ncaaD1Mbb from "./ncaaD1MenBasketball.generated.json";
import ncaaFbs from "./ncaaFbsFootball.generated.json";
import ncaaD1Hockey from "./ncaaD1IceHockey.generated.json";

/** Leagues where grid entries are individuals → try /search/player after team search */
export const FALLBACK_USES_PLAYER_SEARCH = new Set(["4464", "4517"]);

const BY_ID = {
  // —— Major leagues (homepage + sport pages) ——
  "4387": [
    "Atlanta Hawks", "Boston Celtics", "Brooklyn Nets", "Charlotte Hornets", "Chicago Bulls",
    "Cleveland Cavaliers", "Dallas Mavericks", "Denver Nuggets", "Detroit Pistons",
    "Golden State Warriors", "Houston Rockets", "Indiana Pacers", "LA Clippers",
    "Los Angeles Lakers", "Memphis Grizzlies", "Miami Heat", "Milwaukee Bucks",
    "Minnesota Timberwolves", "New Orleans Pelicans", "New York Knicks", "Oklahoma City Thunder",
    "Orlando Magic", "Philadelphia 76ers", "Phoenix Suns", "Portland Trail Blazers",
    "Sacramento Kings", "San Antonio Spurs", "Toronto Raptors", "Utah Jazz", "Washington Wizards",
  ],
  "4516": [
    "Atlanta Dream", "Chicago Sky", "Connecticut Sun", "Dallas Wings", "Golden State Valkyries",
    "Indiana Fever", "Las Vegas Aces", "Los Angeles Sparks", "Minnesota Lynx",
    "New York Liberty", "Phoenix Mercury", "Seattle Storm", "Washington Mystics",
  ],
  "4380": [
    "Anaheim Ducks", "Boston Bruins", "Buffalo Sabres", "Calgary Flames", "Carolina Hurricanes",
    "Chicago Blackhawks", "Colorado Avalanche", "Columbus Blue Jackets", "Dallas Stars",
    "Detroit Red Wings", "Edmonton Oilers", "Florida Panthers", "Los Angeles Kings",
    "Minnesota Wild", "Montreal Canadiens", "Nashville Predators", "New Jersey Devils",
    "New York Islanders", "New York Rangers", "Ottawa Senators", "Philadelphia Flyers",
    "Pittsburgh Penguins", "San Jose Sharks", "Seattle Kraken", "St. Louis Blues",
    "Tampa Bay Lightning", "Toronto Maple Leafs", "Utah Hockey Club", "Vancouver Canucks",
    "Vegas Golden Knights", "Washington Capitals", "Winnipeg Jets",
  ],
  "4391": [
    "Arizona Cardinals", "Atlanta Falcons", "Baltimore Ravens", "Buffalo Bills", "Carolina Panthers",
    "Chicago Bears", "Cincinnati Bengals", "Cleveland Browns", "Dallas Cowboys",
    "Denver Broncos", "Detroit Lions", "Green Bay Packers", "Houston Texans",
    "Indianapolis Colts", "Jacksonville Jaguars", "Kansas City Chiefs", "Las Vegas Raiders",
    "Los Angeles Chargers", "Los Angeles Rams", "Miami Dolphins", "Minnesota Vikings",
    "New England Patriots", "New Orleans Saints", "New York Giants", "New York Jets",
    "Philadelphia Eagles", "Pittsburgh Steelers", "San Francisco 49ers", "Seattle Seahawks",
    "Tampa Bay Buccaneers", "Tennessee Titans", "Washington Commanders",
  ],
  "4424": [
    "Arizona Diamondbacks", "Atlanta Braves", "Baltimore Orioles", "Boston Red Sox",
    "Chicago Cubs", "Chicago White Sox", "Cincinnati Reds", "Cleveland Guardians",
    "Colorado Rockies", "Detroit Tigers", "Houston Astros", "Kansas City Royals",
    "Los Angeles Angels", "Los Angeles Dodgers", "Miami Marlins", "Milwaukee Brewers",
    "Minnesota Twins", "New York Mets", "New York Yankees", "Oakland Athletics",
    "Philadelphia Phillies", "Pittsburgh Pirates", "San Diego Padres", "San Francisco Giants",
    "Seattle Mariners", "St. Louis Cardinals", "Tampa Bay Rays", "Texas Rangers",
    "Toronto Blue Jays", "Washington Nationals",
  ],

  // —— Soccer ——
  "4328": [
    "Arsenal", "Aston Villa", "AFC Bournemouth", "Brentford", "Brighton & Hove Albion",
    "Burnley", "Chelsea", "Crystal Palace", "Everton", "Fulham",
    "Leeds United", "Leicester City", "Liverpool", "Manchester City", "Manchester United",
    "Newcastle United", "Nottingham Forest", "Sunderland", "Tottenham Hotspur", "West Ham United",
    "Wolverhampton Wanderers",
  ],
  "4335": [
    "Deportivo Alavés", "Athletic Bilbao", "Atlético Madrid", "CA Osasuna", "Celta de Vigo",
    "Elche CF", "FC Barcelona", "Getafe CF", "Girona FC", "Levante UD",
    "RCD Espanyol de Barcelona", "RCD Mallorca", "Rayo Vallecano", "Real Betis", "Real Madrid",
    "Real Oviedo", "Real Sociedad", "Sevilla FC", "Valencia CF", "Villarreal CF",
  ],
  "4331": [
    "1. FC Heidenheim 1846", "1. FC Union Berlin", "1. FSV Mainz 05", "Bayer 04 Leverkusen",
    "FC Bayern Munich", "Borussia Dortmund", "Borussia Mönchengladbach", "Eintracht Frankfurt",
    "FC Augsburg", "FC St. Pauli", "Holstein Kiel", "RB Leipzig", "SC Freiburg", "SV Werder Bremen",
    "TSG 1899 Hoffenheim", "VfL Bochum", "VfB Stuttgart", "VfL Wolfsburg",
  ],
  "4332": [
    "AC Milan", "AC Monza", "AS Roma", "Atalanta BC", "Bologna FC 1909",
    "Cagliari Calcio", "Como 1907", "Cremonese", "Fiorentina", "Genoa CFC",
    "Hellas Verona", "Inter Milan", "Juventus", "SS Lazio", "US Lecce",
    "SSC Napoli", "Parma Calcio 1913", "Pisa SC", "Torino FC", "Udinese Calcio",
    "Venezia FC",
  ],
  "4346": [
    "Atlanta United FC", "Austin FC", "Charlotte FC", "Chicago Fire FC", "FC Cincinnati",
    "Colorado Rapids", "Columbus Crew", "D.C. United", "FC Dallas", "Houston Dynamo FC",
    "Inter Miami CF", "LA Galaxy", "Los Angeles Football Club", "Minnesota United FC",
    "CF Montréal", "Nashville SC", "New England Revolution", "New York City FC",
    "New York Red Bulls", "Orlando City SC", "Philadelphia Union", "Portland Timbers",
    "Real Salt Lake", "San Diego FC", "San Jose Earthquakes", "Seattle Sounders FC",
    "Sporting Kansas City", "St. Louis CITY SC", "Toronto FC", "Vancouver Whitecaps FC",
  ],
  "4334": [
    "AS Monaco", "AJ Auxerre", "Stade Brestois 29", "Le Havre AC", "RC Lens", "Lille OSC",
    "FC Lorient", "Olympique Lyonnais", "Olympique de Marseille", "FC Metz", "Montpellier HSC",
    "FC Nantes", "OGC Nice", "Paris Saint-Germain", "Stade de Reims", "Stade Rennais FC",
    "RC Strasbourg Alsace", "Toulouse FC",
  ],

  // —— Basketball ——
  "4442": [
    "Beijing Ducks", "Guangdong Southern Tigers", "Liaoning Flying Leopards", "Xinjiang Flying Tigers",
    "Zhejiang Golden Bulls", "Zhejiang Lions", "Shanghai Sharks", "Shandong Heroes",
    "Qingdao Eagles", "Jilin Northeast Tigers", "Shenzhen Leopards", "Guangzhou Loong Lions",
    "Shanxi Loongs", "Fujian Sturgeons", "Jiangsu Dragons", "Sichuan Blue Whales",
    "Tianjin Pioneers", "Ningbo Rockets", "Nanjing Monkey Kings", "Beijing Royal Fighters",
  ],
  "4423": [
    "ASVEL Lyon-Villeurbanne", "AS Monaco Basket", "Paris Basketball", "JL Bourg Basket",
    "Cholet Basket", "JDA Dijon Basket", "Le Mans Sarthe Basket", "Limoges CSP",
    "Metropolitans 92", "Nanterre 92", "Saint-Quentin Basket-Ball", "SLUC Nancy Basket",
    "Strasbourg IG", "Champagne Basket", "Élan Béarnais Pau-Lacq-Orthez", "Elan Chalon",
    "BCM Gravelines-Dunkerque", "Roanne Chorale", "Le Portel",
  ],
  "4546": [
    "Real Madrid Baloncesto", "FC Barcelona Bàsquet", "Olympiacos BC", "Panathinaikos BC",
    "Maccabi Tel Aviv BC", "KK Partizan", "KK Crvena zvezda", "Virtus Segafredo Bologna",
    "Olimpia Milano", "FC Bayern Munich", "ALBA Berlin", "LDLC ASVEL",
    "AS Monaco Basket", "Fenerbahçe Beko", "Anadolu Efes", "Saski Baskonia",
    "Valencia Basket", "BC Žalgiris Kaunas",
  ],
  "4549": [
    "Angola", "Argentina", "Australia", "Brazil", "Canada", "China", "Croatia", "Dominican Republic",
    "Egypt", "Finland", "France", "Georgia", "Germany", "Greece", "Iran", "Italy",
    "Ivory Coast", "Japan", "Latvia", "Lebanon", "Lithuania", "Mexico", "Montenegro",
    "New Zealand", "Philippines", "Puerto Rico", "Serbia", "Slovenia", "South Sudan", "Spain",
    "United States", "Venezuela",
  ],

  // —— American football ——
  "4718": [
    "Arlington Renegades", "DC Defenders", "Houston Roughnecks", "Orlando Guardians",
    "San Antonio Brahmas", "Seattle Sea Dragons", "St. Louis Battlehawks", "Vegas Vipers",
  ],
  "5262": [
    "Birmingham Stallions", "Houston Gamblers", "Memphis Showboats", "Michigan Panthers",
    "New Jersey Generals", "New Orleans Breakers", "Philadelphia Stars", "Pittsburgh Maulers",
  ],
  "4405": [
    "BC Lions", "Calgary Stampeders", "Edmonton Elks", "Saskatchewan Roughriders",
    "Winnipeg Blue Bombers", "Hamilton Tiger-Cats", "Toronto Argonauts", "Ottawa Redblacks",
    "Montreal Alouettes",
  ],
  "4470": [
    "Albany Firebirds", "Billings Outlaws", "Green Bay Blizzard", "Iowa Barnstormers",
    "Massachusetts Pirates", "Nashville Kats", "Northern Arizona Wranglers", "Quad City Steamwheelers",
    "San Antonio Gunslingers", "Sioux Falls Storm", "Tucson Sugar Skulls", "West Texas Warbirds",
    "Frisco Fighters", "Bismarck Bucks",
  ],

  // —— Baseball ——
  "4591": [
    "Chiba Lotte Marines", "Chunichi Dragons", "Fukuoka SoftBank Hawks", "Hanshin Tigers",
    "Hiroshima Toyo Carp", "Hokkaido Nippon-Ham Fighters", "ORIX Buffaloes", "Saitama Seibu Lions",
    "Tohoku Rakuten Golden Eagles", "Tokyo Yakult Swallows", "Yokohama DeNA BayStars", "Yomiuri Giants",
  ],
  "4465": [
    "Doosan Bears", "Hanwha Eagles", "KIA Tigers", "Kiwoom Heroes", "KT Wiz",
    "LG Twins", "Lotte Giants", "NC Dinos", "Samsung Lions", "SSG Landers",
  ],
  "4467": [
    "CTBC Brothers", "Fubon Guardians", "Rakuten Monkeys", "Uni-President 7-Eleven Lions",
    "Wei Chuan Dragons", "TSG Hawks",
  ],
  "4468": [
    "Algodoneros de Unión Laguna", "Bravos de León", "Conspiradores de Querétaro", "Diablos Rojos del México",
    "Dorados de Chihuahua", "El Águila de Veracruz", "Generales de Durango", "Guerreros de Oaxaca",
    "Leones de Yucatán", "Mariachis de Guadalajara", "Olmecas de Tabasco", "Pericos de Puebla",
    "Piratas de Campeche", "Rieleros de Aguascalientes", "Saraperos de Saltillo", "Sultanes de Monterrey",
    "Tecolotes de los Dos Laredos", "Tigres de Quintana Roo", "Toros de Tijuana", "Venados de Mazatlán",
  ],
  "4469": [
    "Adelaide Giants", "Brisbane Bandits", "Canberra Cavalry", "Geelong-Korea", "Melbourne Aces",
    "Perth Heat", "Sydney Blue Sox", "Wellington Saints",
  ],

  // —— Hockey ——
  "4920": [
    "Admiral Vladivostok", "Ak Bars Kazan", "Amur Khabarovsk", "Avangard Omsk", "Avtomobilist Yekaterinburg",
    "Barys Astana", "CSKA Moscow", "Dinamo Minsk", "Dinamo Moscow", "Kunlun Red Star",
    "Lada Togliatti", "Lokomotiv Yaroslavl", "Metallurg Magnitogorsk", "Neftekhimik Nizhnekamsk",
    "Salavat Yulaev Ufa", "Severstal Cherepovets", "Sibir Novosibirsk", "SKA Saint Petersburg",
    "Sochi", "Spartak Moscow", "Torpedo Nizhny Novgorod", "Traktor Chelyabinsk", "Vityaz Podolsk",
  ],
  "4381": [
    "Belfast Giants", "Cardiff Devils", "Coventry Blaze", "Dundee Stars", "Fife Flyers",
    "Glasgow Clan", "Guildford Flames", "Manchester Storm", "Nottingham Panthers", "Sheffield Steelers",
  ],
  "4419": [
    "Brynäs IF", "Djurgårdens IF", "Frölunda HC", "Färjestad BK", "HV71", "Leksands IF",
    "Linköping HC", "Luleå HF", "Malmö Redhawks", "IK Oskarshamn", "Rögle BK", "Skellefteå AIK",
    "Timrå IK", "Växjö Lakers",
  ],
  "4931": [
    "HIFK", "HPK", "Ilves", "JYP", "Jukurit", "KalPa", "KooKoo", "Kärpät", "Lukko",
    "Pelicans", "SaiPa", "Sport", "Tappara", "TPS", "Ässät",
  ],
  "4925": [
    "Adler Mannheim", "Augsburger Panther", "Düsseldorfer EG", "EHC Red Bull München",
    "Eisbären Berlin", "ERC Ingolstadt", "Fischtown Pinguins Bremerhaven", "Grizzlys Wolfsburg",
    "Iserlohn Roosters", "Kölner Haie", "Löwen Frankfurt", "Nürnberg Ice Tigers",
    "Schwenninger Wild Wings", "Straubing Tigers",
  ],

  // —— Rugby ——
  "4416": [
    "Brisbane Broncos", "Canberra Raiders", "Canterbury-Bankstown Bulldogs", "Cronulla-Sutherland Sharks",
    "Dolphins", "Gold Coast Titans", "Manly Warringah Sea Eagles", "Melbourne Storm",
    "Newcastle Knights", "New Zealand Warriors", "North Queensland Cowboys", "Parramatta Eels",
    "Penrith Panthers", "South Sydney Rabbitohs", "St. George Illawarra Dragons", "Sydney Roosters",
    "Wests Tigers",
  ],
  "4551": [
    "Blues", "Brumbies", "Chiefs", "Crusaders", "Fijian Drua", "Highlanders", "Hurricanes",
    "Melbourne Rebels", "Moana Pasifika", "NSW Waratahs", "Queensland Reds", "Western Force",
  ],
  "4430": [
    "Aviron Bayonnais", "Union Bordeaux Bègles", "Castres Olympique", "ASM Clermont Auvergne",
    "Stade Rochelais", "Racing 92", "Stade Toulousain", "RC Toulon", "Stade Français Paris",
    "USA Perpignan", "Section Paloise", "Montpellier Hérault Rugby", "Lyon OU", "CA Brive",
  ],

  // —— Cricket ——
  "4460": [
    "Chennai Super Kings", "Delhi Capitals", "Gujarat Titans", "Kolkata Knight Riders",
    "Lucknow Super Giants", "Mumbai Indians", "Punjab Kings", "Rajasthan Royals",
    "Royal Challengers Bengaluru", "Sunrisers Hyderabad",
  ],
  "4463": [
    "Birmingham Bears", "Derbyshire Falcons", "Durham", "Essex Eagles", "Glamorgan",
    "Gloucestershire", "Hampshire Hawks", "Kent Spitfires", "Lancashire Lightning",
    "Leicestershire Foxes", "Middlesex", "Northamptonshire Steelbacks", "Nottinghamshire Outlaws",
    "Somerset", "Surrey", "Sussex Sharks", "Warwickshire", "Worcestershire Rapids",
    "Yorkshire Vikings",
  ],
  "4461": [
    "Adelaide Strikers", "Brisbane Heat", "Hobart Hurricanes", "Melbourne Renegades",
    "Melbourne Stars", "Perth Scorchers", "Sydney Sixers", "Sydney Thunder",
  ],

  // —— Volleyball ——
  "4582": [
    "Arago de Sète", "AS Cannes Volley-Ball", "AS Saint-Priest", "Chaumont VB 52",
    "GFC Ajaccio Volley-Ball", "Montpellier UC", "Nantes Rezé Métropole Volley", "Paris Volley",
    "Poitiers Volley", "Saint-Jean-d'Illac", "Spacer's Toulouse Volley", "Tourcoing Lille Métropole Volley",
    "Tours Volley-Ball", "Nice Volley-Ball",
  ],
  "4544": [
    "Allianz Milano", "Cucine Lube Civitanova", "Gas Sales Bluenergy Piacenza", "Gioiella Prisma Taranto",
    "Itas Trentino", "Kioene Padova", "Modena Volley", "Rana Verona", "Sir Safety Susa Perugia",
    "Top Volley Cisterna", "Vero Volley Monza", "WithU Verona Volley",
  ],
  "5757": [
    "Ansan OK Financial Group Okman", "Cheonan Hyundai Capital Skywalkers", "Daejeon Samsung Fire Bluefangs",
    "Incheon Korean Air Jumbos", "Suwon KEPCO Vixtorm", "Uijeongbu KB Insurance Stars",
    "Wonju DB Promy", "Seoul Woori Card Wibee",
  ],

  // —— Tennis / national team style ——
  "4464": [
    "Novak Djokovic", "Carlos Alcaraz", "Jannik Sinner", "Daniil Medvedev", "Alexander Zverev",
    "Andrey Rublev", "Taylor Fritz", "Casper Ruud", "Holger Rune", "Stefanos Tsitsipas",
    "Grigor Dimitrov", "Tommy Paul", "Ben Shelton", "Hubert Hurkacz", "Frances Tiafoe",
    "Lorenzo Musetti", "Ugo Humbert", "Alex de Minaur", "Sebastian Korda", "Karen Khachanov",
    "Felix Auger-Aliassime", "Jack Draper", "Arthur Fils", "Gael Monfils", "Marcos Giron",
    "Nicolas Jarry", "Jordan Thompson", "Alejandro Tabilo", "Tomas Machac", "Matteo Berrettini",
  ],
  "4517": [
    "Iga Swiatek", "Aryna Sabalenka", "Coco Gauff", "Jessica Pegula", "Elena Rybakina",
    "Marketa Vondrousova", "Ons Jabeur", "Maria Sakkari", "Barbora Krejcikova", "Jelena Ostapenko",
    "Madison Keys", "Danielle Collins", "Emma Navarro", "Paula Badosa", "Daria Kasatkina",
    "Beatriz Haddad Maia", "Donna Vekic", "Victoria Azarenka", "Karolina Muchova", "Elina Svitolina",
    "Anastasia Pavlyuchenkova", "Linda Noskova", "Mirra Andreeva", "Diana Shnaider", "Magda Linette",
    "Elise Mertens", "Yulia Putintseva", "Anna Kalinskaya", "Sloane Stephens", "Bianca Andreescu",
  ],
  "5347": [
    "Argentina", "Australia", "Austria", "Belgium", "Brazil", "Canada", "Chile", "China",
    "Colombia", "Croatia", "Czech Republic", "Finland", "France", "Germany", "Great Britain",
    "Greece", "Hungary", "India", "Israel", "Italy", "Japan", "Kazakhstan", "South Korea",
    "Mexico", "Morocco", "Netherlands", "Norway", "Poland", "Portugal", "Serbia", "Slovakia",
    "Spain", "Sweden", "Switzerland", "United States", "Uzbekistan",
  ],

  // —— MiLB / MLS Next Pro ——
  "5085": [
    "Buffalo Bisons", "Charlotte Knights", "Columbus Clippers", "Durham Bulls", "Gwinnett Stripers",
    "Indianapolis Indians", "Iowa Cubs", "Jacksonville Jumbo Shrimp", "Lehigh Valley IronPigs",
    "Louisville Bats", "Memphis Redbirds", "Nashville Sounds", "Norfolk Tides", "Omaha Storm Chasers",
    "Rochester Red Wings", "Scranton/Wilkes-Barre RailRiders", "St. Paul Saints", "Syracuse Mets",
    "Toledo Mud Hens", "Wichita Wind Surge", "Worcester Red Sox",
  ],
  "5279": [
    "Atlanta United 2", "Austin FC II", "Carolina Core FC", "Chicago Fire FC II", "Chattanooga FC",
    "Colorado Rapids 2", "Columbus Crew 2", "Crown Legacy FC", "D.C. United 2", "FC Cincinnati 2",
    "Houston Dynamo 2", "Huntsville City FC", "Inter Miami CF II", "LA Galaxy II", "LAFC 2",
    "Minnesota United FC 2", "New England Revolution II", "New York City FC II", "New York Red Bulls II",
    "North Texas SC", "Orlando City B", "Philadelphia Union II", "Portland Timbers 2",
    "Real Monarchs", "Sporting Kansas City II", "St. Louis CITY SC 2", "The Town FC",
    "Toronto FC II", "Vancouver Whitecaps FC 2",
  ],
};

/**
 * @param {string|number} leagueId
 * @param {string} [strLeague] API league name (unused except future disambiguation)
 * @returns {readonly string[]}
 */
export function getFallbackTeamNames(leagueId, strLeague) {
  void strLeague;
  const id = String(leagueId ?? "");
  if (id === "4607") return [...ncaaD1Mbb];
  if (id === "4479") return [...ncaaFbs];
  if (id === "5346") return [...ncaaD1Hockey];
  const list = BY_ID[id];
  return Array.isArray(list) ? [...list] : [];
}
