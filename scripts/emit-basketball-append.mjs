/**
 * Generates `src/data/basketballCuratedRosters.rest.js` (CBA, LNB, EuroLeague, FIBA
 * maps + exports). Merge into the hand-edited WNBA file with:
 *   node scripts/merge-basketball-rosters.mjs
 */
import { writeFileSync } from "fs";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const { normalizeTeamKey } = await import(
  pathToFileURL(join(root, "src/data/normalizeTeamKey.js")).href
);

const r = (strPlayer, strPosition) => ({ strPlayer, strPosition });
const G = "G",
  F = "F",
  C = "C";

function blockFromNames(names, pool, count) {
  return names
    .map((name, ti) => {
      const key = normalizeTeamKey(name);
      const rows = [];
      for (let i = 0; i < count; i++) {
        const [p, pos] = pool[(ti * 3 + i) % pool.length];
        rows.push(r(p, pos));
      }
      const inner = rows
        .map(
          (x) =>
            `    r(${JSON.stringify(x.strPlayer)}, ${JSON.stringify(x.strPosition)}),`
        )
        .join("\n");
      return `  ${JSON.stringify(key)}: [\n${inner}\n  ],`;
    })
    .join("\n");
}

const cbaNames = [
  "Beijing Ducks",
  "Guangdong Southern Tigers",
  "Liaoning Flying Leopards",
  "Xinjiang Flying Tigers",
  "Zhejiang Golden Bulls",
  "Zhejiang Lions",
  "Shanghai Sharks",
  "Shandong Heroes",
  "Qingdao Eagles",
  "Jilin Northeast Tigers",
  "Shenzhen Leopards",
  "Guangzhou Loong Lions",
  "Shanxi Loongs",
  "Fujian Sturgeons",
  "Jiangsu Dragons",
  "Sichuan Blue Whales",
  "Tianjin Pioneers",
  "Ningbo Rockets",
  "Nanjing Monkey Kings",
  "Beijing Royal Fighters",
];
const cbaPool = [
  ["Zhao Rui", G],
  ["Wang Zhelin", C],
  ["Wu Qian", G],
  ["Hu Jinqiu", F],
  ["Sun Minghui", G],
  ["Lin Wei", G],
  ["Chen Ying-chun", G],
  ["Zhou Qi", C],
  ["Guo Ailun", G],
  ["Zeng Lingxu", G],
  ["Fang Shuo", G],
  ["Zhai Xiaochuan", F],
  ["Ren Junfei", F],
  ["Yu Dehao", G],
  ["Tao Hanlin", C],
  ["Zhang Zhenlin", F],
  ["Xu Jie", G],
  ["Du Runwang", F],
];

const lnbNames = [
  "ASVEL Lyon-Villeurbanne",
  "AS Monaco Basket",
  "Paris Basketball",
  "JL Bourg Basket",
  "Cholet Basket",
  "JDA Dijon Basket",
  "Le Mans Sarthe Basket",
  "Limoges CSP",
  "Metropolitans 92",
  "Nanterre 92",
  "Saint-Quentin Basket-Ball",
  "SLUC Nancy Basket",
  "Strasbourg IG",
  "Champagne Basket",
  "Élan Béarnais Pau-Lacq-Orthez",
  "Elan Chalon",
  "BCM Gravelines-Dunkerque",
  "Roanne Chorale",
  "Le Portel",
];
const lnbPool = [
  ["Nando De Colo", G],
  ["Vincent Poirier", C],
  ["Thomas Heurtel", G],
  ["Amine Noua", F],
  ["Moustapha Fall", C],
  ["Élie Okobo", G],
  ["Andrew Albicy", G],
  ["Mathias Lessort", C],
  ["Timothé Luwawu-Cabarrot", G],
  ["Ismaël Kamagate", C],
  ["William Howard", F],
  ["Paul Lacombe", G],
  ["Livio Jean-Charles", F],
  ["Retin Obasohan", G],
  ["Alpha Kaba", C],
  ["Yakuba Ouattara", G],
  ["Bilal Coulibaly", G],
  ["Victor Wembanyama", F],
];

const euroNames = [
  "Real Madrid Baloncesto",
  "FC Barcelona Bàsquet",
  "Olympiacos BC",
  "Panathinaikos BC",
  "Maccabi Tel Aviv BC",
  "KK Partizan",
  "KK Crvena zvezda",
  "Virtus Segafredo Bologna",
  "Olimpia Milano",
  "FC Bayern Munich",
  "ALBA Berlin",
  "LDLC ASVEL",
  "AS Monaco Basket",
  "Fenerbahçe Beko",
  "Anadolu Efes",
  "Saski Baskonia",
  "Valencia Basket",
  "BC Žalgiris Kaunas",
];
const euroPool = [
  ["Walter Tavares", C],
  ["Sergio Llull", G],
  ["Facundo Campazzo", G],
  ["Gabriel Deck", F],
  ["Mario Hezonja", F],
  ["Nigel Williams-Goss", G],
  ["Sasha Vezenkov", F],
  ["Kostas Sloukas", G],
  ["Georgios Printezis", F],
  ["Vasilije Micić", G],
  ["Shane Larkin", G],
  ["Rodrigue Beaubois", G],
  ["Ante Žižić", C],
  ["Nikola Mirotić", F],
  ["Jan Veselý", F],
  ["Nicolò Melli", F],
  ["Devon Hall", G],
  ["Kevarrius Hayes", C],
  ["Edgaras Ulanovas", F],
  ["Ignas Brazdeikis", F],
  ["Tomas Dimša", G],
  ["Lorenzo Brown", G],
  ["Tarik Biberovic", F],
  ["Marko Gudurić", G],
];

/** @type {Record<string, [string, string][]>} normalized country key -> [name, pos][] */
const FIBA_LINEUPS = {
  angola: [
    ["Carlos Morais", G],
    ["Eduardo Mingas", F],
    ["Valdemar João", F],
    ["Silvio Sousa", C],
    ["Leonel Paulo", F],
    ["Childe Dundão", G],
    ["Jilson Bango", C],
    ["Gerson Gonçalves", G],
  ],
  argentina: [
    ["Facundo Campazzo", G],
    ["Gabriel Deck", F],
    ["Nicolás Laprovíttola", G],
    ["Patricio Garino", F],
    ["Marcos Delía", C],
    ["Leandro Bolmaro", G],
    ["Tayavek Gallizzi", F],
    ["Juan Pablo Vaulet", F],
  ],
  australia: [
    ["Patty Mills", G],
    ["Josh Giddey", G],
    ["Dante Exum", G],
    ["Jock Landale", C],
    ["Dyson Daniels", G],
    ["Joe Ingles", F],
    ["Matisse Thybulle", F],
    ["Duop Reath", C],
  ],
  brazil: [
    ["Marcelinho Huertas", G],
    ["Raul Neto", G],
    ["Cristiano Felicio", C],
    ["Lucas Mariano", F],
    ["Leo Meindl", F],
    ["Georginho De Paula", G],
    ["Yago dos Santos", G],
    ["Bruno Caboclo", F],
  ],
  canada: [
    ["Shai Gilgeous-Alexander", G],
    ["Jamal Murray", G],
    ["RJ Barrett", F],
    ["Dillon Brooks", F],
    ["Kelly Olynyk", F],
    ["Luguentz Dort", G],
    ["Andrew Nembhard", G],
    ["Dwight Powell", C],
  ],
  china: [
    ["Zhao Rui", G],
    ["Wang Zhelin", C],
    ["Zhou Qi", C],
    ["Hu Jinqiu", F],
    ["Zhang Zhenlin", F],
    ["Xu Jie", G],
    ["Wu Qian", G],
    ["Sun Minghui", G],
  ],
  croatia: [
    ["Bojan Bogdanović", F],
    ["Ivica Zubac", C],
    ["Dario Šarić", F],
    ["Mario Hezonja", F],
    ["Dominik Mavra", G],
    ["Karlo Matković", C],
    ["Jaleen Smith", G],
    ["Jaleen Smith", G],
  ],
  "dominican republic": [
    ["Karl-Anthony Towns", C],
    ["Chris Duarte", G],
    ["Lester Quiñones", G],
    ["Jean Montero", G],
    ["Ángel Delgado", C],
    ["Gelvis Solano", G],
    ["Eloy Vargas", C],
    ["Víctor Liz", G],
  ],
  egypt: [
    ["Assem Marei", C],
    ["Ehab Amin", G],
    ["Anas Mahmoud", C],
    ["Seifeldin Hendawy", G],
    ["Patrick Gardner", C],
    ["Karim Elgizawy", F],
    ["Omar Farag", G],
    ["Amr Gendy", F],
  ],
  finland: [
    ["Lauri Markkanen", F],
    ["Sasu Salin", G],
    ["Elias Valtonen", F],
    ["Edon Maxhuni", G],
    ["Mikael Jantunen", F],
    ["Alexander Madsen", C],
    ["Severi Kaukiainen", G],
    ["Petteri Koponen", G],
  ],
  france: [
    ["Rudy Gobert", C],
    ["Victor Wembanyama", F],
    ["Evan Fournier", G],
    ["Nicolas Batum", F],
    ["Matthew Strazel", G],
    ["Guerschon Yabusele", F],
    ["Frank Ntilikina", G],
    ["Thomas Heurtel", G],
  ],
  georgia: [
    ["Goga Bitadze", C],
    ["Tornike Shengelia", F],
    ["Thad McFadden", G],
    ["Joe Thomasson", G],
    ["Giorgi Shermadini", C],
    ["Luka Bulić", F],
    ["Duda Sanadze", G],
    ["Toko Shengelia", F],
  ],
  germany: [
    ["Dennis Schröder", G],
    ["Franz Wagner", F],
    ["Moritz Wagner", C],
    ["Daniel Theis", C],
    ["Isaac Bonga", G],
    ["Andreas Obst", G],
    ["Johannes Voigtmann", F],
    ["Nick Weiler-Babb", G],
  ],
  greece: [
    ["Giannis Antetokounmpo", F],
    ["Thanasis Antetokounmpo", F],
    ["Nick Calathes", G],
    ["Kostas Papanikolaou", F],
    ["Georgios Papagiannis", C],
    ["Panagiotis Kalaitzakis", F],
    ["Kostas Sloukas", G],
    ["Ioannis Papapetrou", F],
  ],
  iran: [
    ["Behnam Yakhchali", G],
    ["Mohammad Jamshidi", G],
    ["Hamed Haddadi", C],
    ["Meisam Mirzaei", F],
    ["Navid Rezaeifar", F],
    ["Sajjad Pazrofteh", G],
    ["Arsalan Kazemi", F],
    ["Mohammad Hassanzadeh", C],
  ],
  italy: [
    ["Simone Fontecchio", F],
    ["Danilo Gallinari", F],
    ["Nicolò Melli", F],
    ["Achille Polonara", F],
    ["Marco Spissu", G],
    ["Stefano Tonut", G],
    ["Giampaolo Ricci", F],
    ["Amedeo Tessitori", C],
  ],
  "ivory coast": [
    ["Solo Diabaté", G],
    ["Deon Thompson", F],
    ["Vafessa Fofana", F],
    ["Patrick Tape", C],
    ["Jean-Philippe Dally", G],
    ["Bazoumana Koné", G],
    ["Matt Costello", C],
    ["Stéphane Konaté", F],
  ],
  japan: [
    ["Yuta Watanabe", F],
    ["Rui Hachimura", F],
    ["Makoto Hiejima", G],
    ["Yuki Togashi", G],
    ["Luke Evans", F],
    ["Hirotaka Yoshii", G],
    ["Josh Hawkinson", C],
    ["Yudai Baba", G],
  ],
  latvia: [
    ["Kristaps Porziņģis", C],
    ["Dāvis Bertāns", F],
    ["Rolands Šmits", F],
    ["Artūrs Žagars", G],
    ["Andrejs Gražulis", F],
    ["Klāvs Čavars", C],
    ["Rodions Kurucs", F],
    ["Jānis Strēlnieks", G],
  ],
  lebanon: [
    ["Wael Arakji", G],
    ["Ali Haydar", F],
    ["Karim Zeinoun", G],
    ["Elie Chamoun", G],
    ["Karim Ezzeddine", F],
    ["Sergio El Darwich", G],
    ["Ater Majok", C],
    ["Omari Spellman", C],
  ],
  lithuania: [
    ["Jonas Valančiūnas", C],
    ["Domantas Sabonis", C],
    ["Mindaugas Kuzminskas", F],
    ["Rokas Jokubaitis", G],
    ["Ignas Brazdeikis", F],
    ["Tadas Sedekerskis", F],
    ["Marius Grigonis", G],
    ["Deividas Sirvydis", F],
  ],
  mexico: [
    ["Francisco Cruz", G],
    ["Gabriel Girón", G],
    ["Fabián Jaimes", F],
    ["Jorge Camacho", F],
    ["Moises Andriassi", G],
    ["Gael Bonilla", G],
    ["Daniel Amigo", C],
    ["Gustavo Ayón", C],
  ],
  montenegro: [
    ["Nikola Vučević", C],
    ["Nikola Ivanović", G],
    ["Dino Radončić", F],
    ["Vladimir Mihailović", G],
    ["Bojan Dubljević", F],
    ["Petar Popović", G],
    ["Marko Simonović", F],
    ["Nemanja Radović", F],
  ],
  "new zealand": [
    ["Steven Adams", C],
    ["Finn Delany", F],
    ["Shea Ili", G],
    ["Izayah Le'afa", G],
    ["Yanni Wetzell", C],
    ["Sam Timmins", C],
    ["Ethan Rusbatch", F],
    ["Tom Abercrombie", F],
  ],
  philippines: [
    ["Jordan Clarkson", G],
    ["June Mar Fajardo", C],
    ["Kai Sotto", C],
    ["Jamie Malonzo", F],
    ["Scottie Thompson", G],
    ["CJ Perez", G],
    ["Dwight Ramos", F],
    ["Ray Parks Jr.", G],
  ],
  "puerto rico": [
    ["José Alvarado", G],
    ["Tremont Waters", G],
    ["George Conditt IV", C],
    ["Isael Romero", F],
    ["Steven Irizarry", G],
    ["Justin Reyes", F],
    ["Gian Clavell", G],
    ["Tyler Davis", C],
  ],
  serbia: [
    ["Nikola Jokić", C],
    ["Bogdan Bogdanović", G],
    ["Nikola Jović", F],
    ["Filip Petrušev", C],
    ["Aleksej Pokuševski", F],
    ["Ognjen Dobrić", G],
    ["Vasilije Micić", G],
    ["Nemanja Bjelica", F],
  ],
  slovenia: [
    ["Luka Dončić", G],
    ["Goran Dragić", G],
    ["Jaka Blažič", G],
    ["Mike Tobey", C],
    ["Zoran Dragić", G],
    ["Gregor Hrovat", G],
    ["Vlatko Čančar", F],
    ["Klemen Prepelič", G],
  ],
  "south sudan": [
    ["Carlik Jones", G],
    ["Wenyen Gabriel", F],
    ["Marial Shayok", G],
    ["Nuni Omot", F],
    ["Bul Kuol", F],
    ["Sunday Dech", G],
    ["Deng Acuoth", C],
    ["Kur Kuath", C],
  ],
  spain: [
    ["Willy Hernangómez", C],
    ["Santi Aldama", F],
    ["Usman Garuba", F],
    ["Juan Núñez", G],
    ["Rudy Fernández", F],
    ["Alberto Díaz", G],
    ["Sergio Llull", G],
    ["Joel Parra", F],
  ],
  "united states": [
    ["LeBron James", F],
    ["Kevin Durant", F],
    ["Stephen Curry", G],
    ["Joel Embiid", C],
    ["Jayson Tatum", F],
    ["Anthony Davis", F],
    ["Devin Booker", G],
    ["Bam Adebayo", C],
  ],
  venezuela: [
    ["Greivis Vásquez", G],
    ["David Cubillán", G],
    ["Windi Graterol", F],
    ["Miguel Ruiz", C],
    ["Gregory Vargas", G],
    ["Jhornan Zamora", G],
    ["Nestor Colmenares", F],
    ["Michael Carrera", F],
  ],
};

const fibaCountries = [
  "Angola",
  "Argentina",
  "Australia",
  "Brazil",
  "Canada",
  "China",
  "Croatia",
  "Dominican Republic",
  "Egypt",
  "Finland",
  "France",
  "Georgia",
  "Germany",
  "Greece",
  "Iran",
  "Italy",
  "Ivory Coast",
  "Japan",
  "Latvia",
  "Lebanon",
  "Lithuania",
  "Mexico",
  "Montenegro",
  "New Zealand",
  "Philippines",
  "Puerto Rico",
  "Serbia",
  "Slovenia",
  "South Sudan",
  "Spain",
  "United States",
  "Venezuela",
];

function fibaBlock() {
  return fibaCountries
    .map((country) => {
      const key = normalizeTeamKey(country);
      const line = FIBA_LINEUPS[key];
      if (!line) throw new Error(`Missing FIBA lineup for ${country} -> ${key}`);
      const inner = line
        .map(
          ([n, p]) =>
            `    r(${JSON.stringify(n)}, ${JSON.stringify(p)}),`
        )
        .join("\n");
      return `  ${JSON.stringify(key)}: [\n${inner}\n  ],`;
    })
    .join("\n");
}

const cbaGenerated = blockFromNames(cbaNames, cbaPool, 8);
const lnbGenerated = blockFromNames(lnbNames, lnbPool, 8);
const euroGenerated = blockFromNames(euroNames, euroPool, 9);
const fibaGenerated = fibaBlock();

const out = `/** China CBA — league id 4442 (illustrative domestic-style names) */
const CBA_BY_KEY = {
${cbaGenerated}
};

/** French LNB — league id 4423 */
const LNB_BY_KEY = {
${lnbGenerated}
};

/** EuroLeague — league id 4546 */
const EUROLEAGUE_BY_KEY = {
${euroGenerated}
};

/** FIBA World Cup — league id 4549 (national-team oriented names) */
const FIBA_BY_KEY = {
${fibaGenerated}
};

const BY_LEAGUE_ID = {
  "4516": WNBA_BY_KEY,
  "4442": CBA_BY_KEY,
  "4423": LNB_BY_KEY,
  "4546": EUROLEAGUE_BY_KEY,
  "4549": FIBA_BY_KEY,
};

export const BASKETBALL_CURATED_LEAGUE_IDS = new Set(Object.keys(BY_LEAGUE_ID));

/**
 * @param {object} team from /lookup/team
 * @returns {{ strPlayer: string, strPosition: string }[] | null}
 */
export function getNonNbaBasketballCuratedRoster(team) {
  const lid = String(team?.idLeague ?? "").trim();
  const map = BY_LEAGUE_ID[lid];
  if (!map) return null;
  const key = normalizeTeamKey(team?.strTeam);
  if (!key) return null;
  const rows = map[key];
  return Array.isArray(rows) && rows.length ? rows : null;
}
`;

writeFileSync(join(root, "src/data/basketballCuratedRosters.rest.js"), out);
console.log("Wrote basketballCuratedRosters.rest.js");
