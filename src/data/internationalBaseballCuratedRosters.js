import { normalizeTeamKey } from "./normalizeTeamKey.js";

const NPB_LEAGUE_ID = "4591";
const KBO_LEAGUE_ID = "4465";

const NPB_BY_TEAM = {
  "chiba lotte marines": ["Roki Sasaki", "Kazuya Ojima", "Koki Yamaguchi", "Yudai Fujioka", "Sosuke Genda", "Atsuki Taneichi", "Shogo Nakamura", "Gregory Polanco"],
  "chunichi dragons": ["Hiroto Takahashi", "Yudai Ohno", "Shinnosuke Ogasawara", "Yuki Okabayashi", "Seiya Hosokawa", "Akira Neo", "Ryuku Tsuchida", "Dayan Viciedo"],
  "fukuoka softbank hawks": ["Yuki Yanagita", "Kensuke Kondoh", "Kotaro Kurihara", "Livan Moinelo", "Hiroki Kokubo", "Takuya Kai", "Naoyuki Uwasawa", "Richard Sunagawa"],
  "hanshin tigers": ["Koji Chikamoto", "Shoki Murakami", "Shota Morishita", "Yusuke Oyama", "Takumu Nakano", "Teruaki Sato", "Koyo Aoyagi", "Daichi Ishii"],
  "hiroshima toyo carp": ["Shogo Akiyama", "Ryoma Nishikawa", "Daichi Osera", "Masato Morishita", "Takayoshi Noma", "Shogo Sakakura", "Kaito Kozono", "Hiroki Tokoda"],
  "hokkaido nippon ham fighters": ["Kotaro Kiyomiya", "Hiromi Ito", "Naoki Uwasawa", "Daigo Kawakami", "Yuki Nomura", "Chusei Mannami", "Takumi Kitayama", "Go Matsumoto"],
  "orix buffaloes": ["Yoshinobu Yamamoto", "Masataka Yoshida", "Yuma Mune", "Hiroya Miyagi", "Ryo Ohta", "Kotaro Kurebayashi", "Yutaro Sugimoto", "Taisuke Yamaoka"],
  "saitama seibu lions": ["Hotaka Yamakawa", "Sosuke Genda", "Kona Takahashi", "Shuta Tonosaki", "Shohei Suzuki", "Tomoya Mori", "Kaima Taira", "Natsuo Takizawa"],
  "tohoku rakuten golden eagles": ["Kazuki Tanaka", "Hideto Asamura", "Masahiro Tanaka", "Takahiro Norimoto", "Daichi Suzuki", "Yuki Watanabe", "Ryota Takinaka", "Hiroaki Shimauchi"],
  "tokyo yakult swallows": ["Munetaka Murakami", "Tetsuto Yamada", "Yasuhiro Ogawa", "Jose Osuna", "Domingo Santana", "Yuta Shiomi", "Keiji Takahashi", "Taichi Ishiyama"],
  "yokohama dena baystars": ["Shota Imanaga", "Shugo Maki", "Keita Sano", "Trevor Bauer", "Toshiro Miyazaki", "Yota Kyoda", "Katsuki Azuma", "Neftalí Soto"],
  "yomiuri giants": ["Kazuma Okamoto", "Hayato Sakamoto", "Tomoyuki Sugano", "Yoshihiro Maru", "Takumi Oshiro", "Sho Nakata", "Naoki Yoshikawa", "Takumi Ohshiro"],
};

const KBO_BY_TEAM = {
  "doosan bears": ["Yang Eui-ji", "Kim Jae-hwan", "Jung Soo-bin", "Raul Alcantara", "Kwak Bin", "Hur Kyung-min", "Yang Chan-yeol", "Kim Jae-ho"],
  "hanwha eagles": ["Ryu Hyun-jin", "Noh Si-hwan", "Chae Eun-seong", "Moon Dong-ju", "Jang Jin-hyuk", "Roh Si-hwan", "Kim Tae-yeon", "Park Sang-won"],
  "kia tigers": ["Na Sung-bum", "Kim Do-young", "Yang Hyeon-jong", "Socrates Brito", "Choi Hyoung-woo", "Lee Woo-sung", "Jeon Sang-hyeon", "Yoon Young-chul"],
  "kiwoom heroes": ["Lee Jung-hoo", "Ahn Woo-jin", "Kim Hye-sung", "Song Sung-mun", "Kim Hwi-jip", "Ha Seong-jin", "Kim Dong-heon", "Lim Byung-wook"],
  "kt wiz": ["Kang Baek-ho", "Ko Young-pyo", "William Cuevas", "Park Byung-ho", "Jang Sung-woo", "Bae Jeong-dae", "Moon Sang-cheol", "Kim Min-hyeok"],
  "lg twins": ["Kim Hyun-soo", "Oh Ji-hwan", "Park Hae-min", "Casey Kelly", "Ko Woo-suk", "Moon Bo-kyung", "Hong Chang-ki", "Jung Woo-young"],
  "lotte giants": ["Jeon Jun-woo", "Yoon Dong-hee", "Na Kyun-an", "Ahn Chi-hong", "Son Ho-young", "Han Hyun-hee", "Park Se-woong", "Kim Min-seok"],
  "nc dinos": ["Park Min-woo", "Son Ah-seop", "Jason Martin", "Shin Min-hyuk", "Koo Chang-mo", "Seo Ho-cheol", "Kim Joo-won", "Kim Hyung-jun"],
  "samsung lions": ["Koo Ja-wook", "David Buchanan", "Won Tae-in", "Oh Jae-il", "Kim Ji-chan", "Lee Jae-hyun", "Kim Tae-gun", "Yang Chang-seop"],
  "ssg landers": ["Choi Jeong", "Kim Kwang-hyun", "Guillermo Heredia", "Han Yoo-seom", "Roenis Elías", "Choi Ji-hoon", "Park Sung-han", "Seo Jin-yong"],
};

const BY_LEAGUE_ID = {
  [NPB_LEAGUE_ID]: NPB_BY_TEAM,
  [KBO_LEAGUE_ID]: KBO_BY_TEAM,
};

export function getInternationalBaseballCuratedRoster(team) {
  const lid = String(team?.idLeague ?? "").trim();
  const map = BY_LEAGUE_ID[lid];
  if (!map) return null;
  const key = normalizeTeamKey(team?.strTeam);
  if (!key) return null;
  const rows = map[key];
  if (!Array.isArray(rows) || rows.length === 0) return null;
  return rows.map((name) => ({ strPlayer: name, strPosition: "—" }));
}
