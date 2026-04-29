import { normalizeTeamKey } from "./normalizeTeamKey.js";

const LEAGUE_PREMIER = "4328";
const LEAGUE_LALIGA = "4335";
const LEAGUE_BUNDESLIGA = "4331";
const LEAGUE_SERIE_A = "4332";
const LEAGUE_LIGUE_1 = "4334";
const LEAGUE_MLS = "4346";

const PREMIER_BY_TEAM = {
  "arsenal": ["Bukayo Saka", "Martin Ødegaard", "Declan Rice", "William Saliba", "Kai Havertz", "Gabriel Magalhães", "Gabriel Martinelli", "David Raya"],
  "aston villa": ["Ollie Watkins", "Douglas Luiz", "Emiliano Martínez", "Moussa Diaby", "John McGinn", "Pau Torres", "Leon Bailey", "Ezri Konsa"],
  "afc bournemouth": ["Dominic Solanke", "Antoine Semenyo", "Justin Kluivert", "Marcos Senesi", "Milos Kerkez", "Illia Zabarnyi", "Philip Billing", "Lewis Cook"],
  "brentford": ["Ivan Toney", "Bryan Mbeumo", "Yoane Wissa", "Christian Nørgaard", "Ethan Pinnock", "Mads Roerslev", "Mark Flekken", "Nathan Collins"],
  "brighton and hove albion": ["Kaoru Mitoma", "João Pedro", "Pervis Estupiñán", "Lewis Dunk", "Pascal Groß", "Billy Gilmour", "Bart Verbruggen", "Danny Welbeck"],
  "burnley": ["Josh Brownhill", "Luca Koleosho", "Sander Berge", "Lyle Foster", "Dara O'Shea", "Jordan Beyer", "James Trafford", "Zeki Amdouni"],
  "chelsea": ["Cole Palmer", "Enzo Fernández", "Moisés Caicedo", "Reece James", "Nicolas Jackson", "Christopher Nkunku", "Levi Colwill", "Malo Gusto"],
  "crystal palace": ["Eberechi Eze", "Michael Olise", "Marc Guéhi", "Jean-Philippe Mateta", "Adam Wharton", "Tyrick Mitchell", "Joachim Andersen", "Dean Henderson"],
  "everton": ["Dominic Calvert-Lewin", "Jordan Pickford", "James Tarkowski", "Jarrad Branthwaite", "Amadou Onana", "Dwight McNeil", "Ashley Young", "Idrissa Gueye"],
  "fulham": ["João Palhinha", "Raúl Jiménez", "Andreas Pereira", "Alex Iwobi", "Antonee Robinson", "Bernd Leno", "Calvin Bassey", "Willian"],
  "leeds united": ["Crysencio Summerville", "Georginio Rutter", "Ethan Ampadu", "Pascal Struijk", "Dan James", "Wilfried Gnonto", "Ilia Gruev", "Joe Rodon"],
  "leicester city": ["Jamie Vardy", "Kiernan Dewsbury-Hall", "Mads Hermansen", "James Justin", "Wout Faes", "Stephy Mavididi", "Kasey McAteer", "Ricardo Pereira"],
  "liverpool": ["Mohamed Salah", "Virgil van Dijk", "Alisson Becker", "Trent Alexander-Arnold", "Dominik Szoboszlai", "Luis Díaz", "Alexis Mac Allister", "Darwin Núñez"],
  "manchester city": ["Erling Haaland", "Kevin De Bruyne", "Phil Foden", "Rodri", "Bernardo Silva", "Rúben Dias", "Ederson", "Jérémy Doku"],
  "manchester united": ["Bruno Fernandes", "Marcus Rashford", "Rasmus Højlund", "Lisandro Martínez", "André Onana", "Alejandro Garnacho", "Kobbie Mainoo", "Diogo Dalot"],
  "newcastle united": ["Alexander Isak", "Bruno Guimarães", "Anthony Gordon", "Kieran Trippier", "Sven Botman", "Joelinton", "Nick Pope", "Harvey Barnes"],
  "nottingham forest": ["Morgan Gibbs-White", "Taiwo Awoniyi", "Murillo", "Neco Williams", "Danilo", "Callum Hudson-Odoi", "Chris Wood", "Matz Sels"],
  "sunderland": ["Jack Clarke", "Jobe Bellingham", "Dan Neil", "Trai Hume", "Luke O'Nien", "Anthony Patterson", "Patrick Roberts", "Chris Rigg"],
  "tottenham hotspur": ["Son Heung-min", "James Maddison", "Cristian Romero", "Micky van de Ven", "Dejan Kulusevski", "Pedro Porro", "Guglielmo Vicario", "Brennan Johnson"],
  "west ham united": ["Jarrod Bowen", "Lucas Paquetá", "Mohammed Kudus", "Tomáš Souček", "Edson Álvarez", "Nayef Aguerd", "Alphonse Areola", "Kurt Zouma"],
  "wolverhampton wanderers": ["Matheus Cunha", "Pedro Neto", "Hwang Hee-chan", "Rayan Aït-Nouri", "Max Kilman", "João Gomes", "José Sá", "Craig Dawson"],
};

const LALIGA_BY_TEAM = {
  "deportivo alaves": ["Luis Rioja", "Kike García", "Antonio Sivera", "Ander Guevara", "Rubén Duarte", "Abdel Abqar", "Jon Guridi", "Nahuel Tenaglia"],
  "athletic bilbao": ["Nico Williams", "Iñaki Williams", "Oihan Sancet", "Unai Simón", "Dani Vivian", "Yeray Álvarez", "Mikel Vesga", "Óscar de Marcos"],
  "atletico madrid": ["Antoine Griezmann", "Álvaro Morata", "Jan Oblak", "Rodrigo De Paul", "Koke", "Nahuel Molina", "José María Giménez", "Marcos Llorente"],
  "ca osasuna": ["Ante Budimir", "Aimar Oroz", "David García", "Sergio Herrera", "Rubén Peña", "Lucas Torró", "Moi Gómez", "Unai García"],
  "celta de vigo": ["Iago Aspas", "Jørgen Strand Larsen", "Fran Beltrán", "Unai Núñez", "Óscar Mingueza", "Iván Villar", "Jonathan Bamba", "Carles Pérez"],
  "elche cf": ["Nicolás Fernández", "Tete Morente", "Pedro Bigas", "Edgar Badía", "Fidel", "Mario Gaspar", "Raúl Guti", "Óscar Plano"],
  "fc barcelona": ["Robert Lewandowski", "Pedri", "Gavi", "Frenkie de Jong", "Lamine Yamal", "Jules Koundé", "Marc-André ter Stegen", "Ronald Araújo"],
  "getafe cf": ["Borja Mayoral", "Mauro Arambarri", "Damián Suárez", "David Soria", "Domingos Duarte", "Nemanja Maksimović", "Juan Iglesias", "Jaime Mata"],
  "girona fc": ["Artem Dovbyk", "Aleix García", "Miguel Gutiérrez", "Yan Couto", "Paulo Gazzaniga", "Daley Blind", "Viktor Tsygankov", "Yangel Herrera"],
  "levante ud": ["Dani Gómez", "José Campaña", "Jorge de Frutos", "Pablo Martínez", "Andrés Fernández", "Álex Muñoz", "Róber Pier", "Cantero"],
  "rcd espanyol de barcelona": ["Javi Puado", "Martin Braithwaite", "Fernando Calero", "Leandro Cabrera", "Nico Melamed", "Pol Lozano", "Joan García", "Edu Expósito"],
  "rcd mallorca": ["Vedat Muriqi", "Dani Rodríguez", "Antonio Raíllo", "Predrag Rajković", "Pablo Maffeo", "Sergi Darder", "Samú Costa", "Abdón Prats"],
  "rayo vallecano": ["Isi Palazón", "Álvaro García", "Óscar Trejo", "Stole Dimitrievski", "Florian Lejeune", "Pathé Ciss", "Unai López", "Iván Balliu"],
  "real betis": ["Isco", "Ayoze Pérez", "Guido Rodríguez", "Nabil Fekir", "Germán Pezzella", "Marc Bartra", "Rui Silva", "Willian José"],
  "real madrid": ["Jude Bellingham", "Vinícius Júnior", "Rodrygo", "Federico Valverde", "Eduardo Camavinga", "Antonio Rüdiger", "Thibaut Courtois", "Aurélien Tchouaméni"],
  "real oviedo": ["Santi Cazorla", "Borja Bastón", "Luismi Sánchez", "Dani Calvo", "Abel Bretones", "Sergio Enrich", "Santi Mier", "Leo Román"],
  "real sociedad": ["Mikel Oyarzabal", "Takefusa Kubo", "Martín Zubimendi", "Brais Méndez", "Robin Le Normand", "Álex Remiro", "Ander Barrenetxea", "Mikel Merino"],
  "sevilla fc": ["Youssef En-Nesyri", "Sergio Ramos", "Jesús Navas", "Lucas Ocampos", "Óliver Torres", "Loïc Badé", "Marko Dmitrović", "Djibril Sow"],
  "valencia cf": ["Hugo Duro", "Pepelu", "José Gayà", "Mouctar Diakhaby", "Javi Guerra", "Giorgi Mamardashvili", "Fran Pérez", "Diego López"],
  "villarreal cf": ["Gerard Moreno", "Álex Baena", "Dani Parejo", "Yeremy Pino", "Raúl Albiol", "Juan Foyth", "Filip Jörgensen", "Santi Comesaña"],
};

const BUNDESLIGA_BY_TEAM = {
  "1 fc heidenheim 1846": ["Tim Kleindienst", "Jan-Niklas Beste", "Kevin Müller", "Patrick Mainka", "Eren Dinkçi", "Adrian Beck", "Benedikt Gimber", "Marvin Pieringer"],
  "1 fc union berlin": ["Robin Gosens", "Kevin Volland", "Danilho Doekhi", "Rani Khedira", "Lucas Tousart", "Frederik Rønnow", "Jerome Roussillon", "Brenden Aaronson"],
  "1 fsv mainz 05": ["Jonathan Burkardt", "Leandro Barreiro", "Ludovic Ajorque", "Brajan Gruda", "Silvan Widmer", "Robin Zentner", "Andreas Hanche-Olsen", "Sepp van den Berg"],
  "bayer 04 leverkusen": ["Florian Wirtz", "Victor Boniface", "Granit Xhaka", "Jeremie Frimpong", "Alejandro Grimaldo", "Jonathan Tah", "Edmond Tapsoba", "Lukas Hrádecký"],
  "fc bayern munich": ["Harry Kane", "Jamal Musiala", "Joshua Kimmich", "Leroy Sané", "Alphonso Davies", "Manuel Neuer", "Dayot Upamecano", "Kingsley Coman"],
  "borussia dortmund": ["Julian Brandt", "Karim Adeyemi", "Niclas Füllkrug", "Emre Can", "Gregor Kobel", "Mats Hummels", "Donyell Malen", "Nico Schlotterbeck"],
  "borussia monchengladbach": ["Alassane Pléa", "Julian Weigl", "Ko Itakura", "Florian Neuhaus", "Jonas Omlin", "Joe Scally", "Rocco Reitz", "Tomas Cvancara"],
  "eintracht frankfurt": ["Omar Marmoush", "Mario Götze", "Robin Koch", "Kevin Trapp", "Ansgar Knauff", "Hugo Larsson", "Niels Nkounkou", "Ellyes Skhiri"],
  "fc augsburg": ["Ermedin Demirović", "Mergim Berisha", "Arne Maier", "Jeffrey Gouweleeuw", "Finn Dahmen", "Elvis Rexhbecaj", "Fredrik Jensen", "Phillip Tietz"],
  "fc st pauli": ["Marcel Hartel", "Jackson Irvine", "Elias Saad", "Eric Smith", "Nikola Vasilj", "Dapo Afolayan", "Manolis Saliakas", "Connor Metcalfe"],
  "holstein kiel": ["Benedikt Pichler", "Steven Skrzybski", "Lewis Holtby", "Philipp Sander", "Timon Weiner", "Timo Becker", "Finn Porath", "Shuto Machino"],
  "rb leipzig": ["Dani Olmo", "Xavi Simons", "Loïs Openda", "Benjamin Šeško", "David Raum", "Willi Orbán", "Péter Gulácsi", "Castello Lukeba"],
  "sc freiburg": ["Vincenzo Grifo", "Michael Gregoritsch", "Matthias Ginter", "Nicolas Höfler", "Noah Atubolu", "Ritsu Dōan", "Roland Sallai", "Lucas Höler"],
  "sv werder bremen": ["Marvin Ducksch", "Mitchell Weiser", "Romano Schmid", "Jens Stage", "Miloš Veljković", "Michael Zetterer", "Justin Njinmah", "Leonardo Bittencourt"],
  "tsg 1899 hoffenheim": ["Andrej Kramarić", "Ihlas Bebou", "Grischa Prömel", "Oliver Baumann", "Ozan Kabak", "Pavel Kadeřábek", "Anton Stach", "Marius Bülter"],
  "vfl bochum": ["Takuma Asano", "Kevin Stöger", "Bernardo", "Manuel Riemann", "Philipp Hofmann", "Anthony Losilla", "Christopher Antwi-Adjei", "Matúš Bero"],
  "vfb stuttgart": ["Serhou Guirassy", "Deniz Undav", "Chris Führich", "Waldemar Anton", "Alexander Nübel", "Atakan Karazor", "Angelo Stiller", "Hiroki Ito"],
  "vfl wolfsburg": ["Maximilian Arnold", "Jonas Wind", "Lovro Majer", "Koen Casteels", "Joakim Mæhle", "Sebastiaan Bornauw", "Tiago Tomás", "Patrick Wimmer"],
};

const SERIE_A_BY_TEAM = {
  "ac milan": ["Rafael Leão", "Theo Hernández", "Mike Maignan", "Christian Pulisic", "Fikayo Tomori", "Tijjani Reijnders", "Ruben Loftus-Cheek", "Olivier Giroud"],
  "ac monza": ["Andrea Colpani", "Matteo Pessina", "Michele Di Gregorio", "Dany Mota", "Luca Caldirola", "Pablo Marí", "Samuele Birindelli", "Valentin Carboni"],
  "as roma": ["Paulo Dybala", "Lorenzo Pellegrini", "Leandro Paredes", "Romelu Lukaku", "Gianluca Mancini", "Bryan Cristante", "Mile Svilar", "Stephan El Shaarawy"],
  "atalanta bc": ["Teun Koopmeiners", "Ademola Lookman", "Gianluca Scamacca", "Éderson", "Marten de Roon", "Berat Djimsiti", "Marco Carnesecchi", "Charles De Ketelaere"],
  "bologna fc 1909": ["Joshua Zirkzee", "Riccardo Orsolini", "Lewis Ferguson", "Remo Freuler", "Sam Beukema", "Lukasz Skorupski", "Dan Ndoye", "Stefan Posch"],
  "cagliari calcio": ["Gianluca Lapadula", "Nicolò Barella", "Alessandro Deiola", "Nadir Zortea", "Yerry Mina", "Simone Scuffet", "Zito Luvumbo", "Antoine Makoumbou"],
  "como 1907": ["Patrick Cutrone", "Alberto Cerri", "Nicolás Paz", "Sergi Roberto", "Edoardo Goldaniga", "Pepe Reina", "Alberto Moreno", "Tommaso Arrigoni"],
  "cremonese": ["Daniel Ciofani", "Michele Castagnetti", "Paolo Ghiglione", "Luca Ravanelli", "Franco Vázquez", "Mouhamadou Sarr", "Charles Pickel", "Dennis Johnsen"],
  "fiorentina": ["Nicolás González", "Giacomo Bonaventura", "Lucas Beltrán", "Arthur", "Cristiano Biraghi", "Pietro Terracciano", "Nikola Milenković", "Rolando Mandragora"],
  "genoa cfc": ["Albert Guðmundsson", "Mateo Retegui", "Morten Frendrup", "Ruslan Malinovskyi", "Koni De Winter", "Josep Martínez", "Milan Badelj", "Radu Drăgușin"],
  "hellas verona": ["Milan Đurić", "Ondrej Duda", "Darko Lazović", "Lorenzo Montipò", "Diego Coppola", "Tijjani Noslin", "Federico Bonazzoli", "Suat Serdar"],
  "inter milan": ["Lautaro Martínez", "Nicolò Barella", "Hakan Çalhanoğlu", "Marcus Thuram", "Alessandro Bastoni", "Federico Dimarco", "Yann Sommer", "Benjamin Pavard"],
  "juventus": ["Dušan Vlahović", "Federico Chiesa", "Adrien Rabiot", "Manuel Locatelli", "Bremer", "Danilo", "Wojciech Szczęsny", "Weston McKennie"],
  "ss lazio": ["Ciro Immobile", "Mattia Zaccagni", "Luis Alberto", "Felipe Anderson", "Alessio Romagnoli", "Ivan Provedel", "Nicolò Casale", "Daichi Kamada"],
  "us lecce": ["Nikola Krstović", "Rémi Oudin", "Lameck Banda", "Morten Hjulmand", "Federico Baschirotto", "Wladimiro Falcone", "Antonino Gallo", "Pontus Almqvist"],
  "ssc napoli": ["Victor Osimhen", "Khvicha Kvaratskhelia", "Stanislav Lobotka", "Giovanni Di Lorenzo", "Matteo Politano", "Amir Rrahmani", "Alex Meret", "Piotr Zieliński"],
  "parma calcio 1913": ["Adrián Benedyczak", "Dennis Man", "Ange-Yoan Bonny", "Hernani", "Valentin Mihăilă", "Leandro Chichizola", "Nahuel Estévez", "Enrico Del Prato"],
  "pisa sc": ["Matteo Tramoni", "Stefano Moreo", "Marius Marin", "Tommaso Barbieri", "Nicolas", "Emanuel Vignato", "Alessandro De Vitis", "Artur Ionita"],
  "torino fc": ["Duván Zapata", "Antonio Sanabria", "Nikola Vlašić", "Samuele Ricci", "Alessandro Buongiorno", "Raoul Bellanova", "Vanja Milinković-Savić", "Perr Schuurs"],
  "udinese calcio": ["Lazar Samardžić", "Florian Thauvin", "Roberto Pereyra", "Walace", "Jaka Bijol", "Maduka Okoye", "Nehuén Pérez", "Lorenzo Lucca"],
  "venezia fc": ["Joel Pohjanpalo", "Tanner Tessmann", "Gianluca Busio", "Nicholas Pierini", "Jay Idzes", "Filip Stanković", "Mikael Ellertsson", "Domen Črnigoj"],
};

const LIGUE1_BY_TEAM = {
  "as monaco": ["Wissam Ben Yedder", "Aleksandr Golovin", "Youssouf Fofana", "Takumi Minamino", "Guillermo Maripán", "Mohamed Camara", "Philipp Köhn", "Maghnes Akliouche"],
  "aj auxerre": ["Gaëtan Perrin", "Gideon Mensah", "Rayan Raveloson", "Jubal", "Theo Pellenard", "Donovan Léon", "Ado Onaiwu", "Lassine Sinayoko"],
  "stade brestois 29": ["Romain Del Castillo", "Pierre Lees-Melou", "Steve Mounié", "Brendan Chardonnet", "Marco Bizot", "Kenny Lala", "Mahdi Camara", "Kamory Doumbia"],
  "le havre ac": ["Emmanuel Sabbi", "André Ayew", "Arouna Sangante", "Nabil Alioui", "Loïc Nego", "Arthur Desmas", "Yassine Kechta", "Daler Kuzyaev"],
  "rc lens": ["Elye Wahi", "Florian Sotoca", "Brice Samba", "Kevin Danso", "Facundo Medina", "Przemysław Frankowski", "Adrien Thomasson", "Neil El Aynaoui"],
  "lille osc": ["Jonathan David", "Edon Zhegrova", "Benjamin André", "Angel Gomes", "Bafodé Diakité", "Lucas Chevalier", "Rémy Cabella", "Tiago Santos"],
  "fc lorient": ["Eli Junior Kroupi", "Romain Faivre", "Tiémoué Bakayoko", "Montassar Talbi", "Yvon Mvogo", "Laurent Abergel", "Aiyegun Tosin", "Gedeon Kalulu"],
  "olympique lyonnais": ["Alexandre Lacazette", "Rayan Cherki", "Maxence Caqueret", "Corentin Tolisso", "Nicolás Tagliafico", "Anthony Lopes", "Jake O'Brien", "Saïd Benrahma"],
  "olympique de marseille": ["Pierre-Emerick Aubameyang", "Amine Harit", "Jordan Veretout", "Leonardo Balerdi", "Jonathan Clauss", "Pau López", "Chancel Mbemba", "Ismaïla Sarr"],
  "fc metz": ["Georges Mikautadze", "Lamine Camara", "Matthieu Udol", "Ismaël Traoré", "Alexandre Oukidja", "Papa Diallo", "Ablie Jallow", "Cheikh Sabaly"],
  "montpellier hsc": ["Téji Savanier", "Akor Adams", "Arnaud Nordin", "Joris Chotard", "Mousa Al-Taamari", "Benjamin Lecomte", "Kiki Kouyaté", "Falaye Sacko"],
  "fc nantes": ["Mostafa Mohamed", "Moses Simon", "Pedro Chirivella", "Nicolas Pallois", "Alban Lafont", "Douglas Augusto", "Florent Mollet", "Jean-Charles Castelletto"],
  "ogc nice": ["Terem Moffi", "Gaëtan Laborde", "Khéphren Thuram", "Hicham Boudaoui", "Todibo", "Marcin Bułka", "Dante", "Melvin Bard"],
  "paris saint germain": ["Kylian Mbappé", "Ousmane Dembélé", "Vitinha", "Warren Zaïre-Emery", "Marquinhos", "Gianluigi Donnarumma", "Achraf Hakimi", "Nuno Mendes"],
  "stade de reims": ["Junya Ito", "Teddy Teuma", "Yunis Abdelhamid", "Marshall Munetsi", "Yevhann Diouf", "Amir Richardson", "Keito Nakamura", "Thomas Foket"],
  "stade rennais fc": ["Benjamin Bourigeaud", "Amine Gouiri", "Arnaud Kalimuendo", "Ludovic Blas", "Adrien Truffert", "Steve Mandanda", "Arthur Theate", "Désiré Doué"],
  "rc strasbourg alsace": ["Emanuel Emegha", "Dilane Bakwa", "Habib Diarra", "Lucas Perrin", "Matz Sels", "Thomas Delaine", "Andrey Santos", "Frédéric Guilbert"],
  "toulouse fc": ["Thijs Dallinga", "Vincent Sierro", "Gabriel Suazo", "Logan Costa", "Guillaume Restes", "Zakaria Aboukhlal", "Cristian Cásseres Jr.", "Rasmus Nicolaisen"],
};

const MLS_BY_TEAM = {
  "atlanta united fc": ["Thiago Almada", "Giorgos Giakoumakis", "Brooks Lennon", "Brad Guzan", "Saba Lobjanidze", "Tristan Muyumba", "Stian Gregersen", "Caleb Wiley"],
  "austin fc": ["Sebastián Driussi", "Diego Rubio", "Owen Wolff", "Brad Stuver", "Julio Cascante", "Dani Pereira", "Alexander Ring", "Jon Gallagher"],
  "charlotte fc": ["Karol Świderski", "Ashley Westwood", "Kristijan Kahlina", "Adilson Malanda", "Kerwin Vargas", "Enzo Copetti", "Brandt Bronico", "Nathan Byrne"],
  "chicago fire fc": ["Xherdan Shaqiri", "Hugo Cuypers", "Maren Haile-Selassie", "Chris Brady", "Rafael Czichos", "Brian Gutiérrez", "Federico Navarro", "Arnaud Souquet"],
  "fc cincinnati": ["Luciano Acosta", "Brandon Vazquez", "Matt Miazga", "Roman Celentano", "Obinna Nwobodo", "Yuya Kubo", "Álvaro Barreal", "Miles Robinson"],
  "colorado rapids": ["Cole Bassett", "Djordje Mihailovic", "Rafael Navarro", "Andreas Maxsø", "Zack Steffen", "Kevin Cabral", "Connor Ronan", "Sam Vines"],
  "columbus crew": ["Cucho Hernández", "Diego Rossi", "Aidan Morris", "Darlington Nagbe", "Steven Moreira", "Patrick Schulte", "Yaw Yeboah", "Alexandru Mățan"],
  "d c united": ["Christian Benteke", "Mateusz Klich", "Pedro Santos", "Tyler Miller", "Aaron Herrera", "Gabriel Pirani", "Martín Rodríguez", "Christopher McVey"],
  "fc dallas": ["Jesús Ferreira", "Alan Velasco", "Paul Arriola", "Maarten Paes", "Nkosi Tafari", "Asier Illarramendi", "Bernard Kamungo", "Sebastien Ibeagha"],
  "houston dynamo fc": ["Héctor Herrera", "Amine Bassi", "Coco Carrasquilla", "Steve Clark", "Griffin Dorsey", "Artur", "Ibrahim Aliyu", "Micael"],
  "inter miami cf": ["Lionel Messi", "Luis Suárez", "Sergio Busquets", "Jordi Alba", "Drake Callender", "Diego Gómez", "Robert Taylor", "Federico Redondo"],
  "la galaxy": ["Riqui Puig", "Joseph Paintsil", "Dejan Joveljić", "Maya Yoshida", "John McCarthy", "Mark Delgado", "Gabriel Pec", "Jalen Neal"],
  "los angeles football club": ["Denis Bouanga", "Carlos Vela", "Mateusz Bogusz", "Ilie Sánchez", "Hugo Lloris", "Timothy Tillman", "Ryan Hollingshead", "Jesús Murillo"],
  "minnesota united fc": ["Emanuel Reynoso", "Bongokuhle Hlongwane", "Robin Lod", "Dayne St. Clair", "Michael Boxall", "Tani Oluwaseyi", "Wil Trapp", "Kervin Arriaga"],
  "cf montreal": ["Mathieu Choinière", "Samuel Piette", "Joel Waterman", "Jonathan Sirois", "Lassi Lappalainen", "Ahmed Hamdi", "George Campbell", "Kwadwo Opoku"],
  "nashville sc": ["Hany Mukhtar", "Walker Zimmerman", "Joe Willis", "Sam Surridge", "Aníbal Godoy", "Shaq Moore", "Alex Muyl", "Jacob Shaffelburg"],
  "new england revolution": ["Carles Gil", "Giacomo Vrioni", "Matt Polster", "Tomás Chancalay", "Henrich Ravas", "Brandon Bye", "Dave Romney", "Noel Buck"],
  "new york city fc": ["Santiago Rodríguez", "Alonso Martínez", "James Sands", "Thiago Martins", "Matt Freese", "Keaton Parks", "Talles Magno", "Birk Risa"],
  "new york red bulls": ["Lewis Morgan", "Dante Vanzeir", "Emil Forsberg", "Carlos Coronel", "Sean Nealis", "John Tolkin", "Daniel Edelman", "Elias Manoel"],
  "orlando city sc": ["Facundo Torres", "Martín Ojeda", "Pedro Gallese", "Robin Jansson", "César Araújo", "Dagur Dan Thórhallsson", "Iván Angulo", "Duncan McGuire"],
  "philadelphia union": ["Dániel Gazdag", "Julián Carranza", "Kai Wagner", "Andre Blake", "Alejandro Bedoya", "Jack McGlynn", "Mikael Uhre", "Jakob Glesnes"],
  "portland timbers": ["Evander", "Felipe Mora", "Santiago Moreno", "Maxime Crépeau", "Dario Župarić", "Diego Chará", "Jonathan Rodríguez", "Claudio Bravo"],
  "real salt lake": ["Cristian Arango", "Diego Luna", "Andrés Gómez", "Zac MacMath", "Justen Glad", "Braian Ojeda", "Nelson Palacio", "Alex Katranis"],
  "san diego fc": ["Hirving Lozano", "Luca de la Torre", "Aníbal Godoy", "Paddy McNair", "CJ dos Santos", "Tomás Ángel", "Onni Valakari", "Milan Iloski"],
  "san jose earthquakes": ["Cristian Espinoza", "Jeremy Ebobisse", "Hernán López", "Daniel", "Jackson Yueill", "Vítor Costa", "Carlos Gruezo", "Rodrigues"],
  "seattle sounders fc": ["Jordan Morris", "Nicolás Lodeiro", "Stefan Frei", "João Paulo", "Yeimar Gómez Andrade", "Raúl Ruidíaz", "Albert Rusnák", "Cristian Roldan"],
  "sporting kansas city": ["Johnny Russell", "Alan Pulido", "Dániel Sallói", "Tim Melia", "Erik Thommy", "Rémi Walter", "Jake Davis", "Andreu Fontàs"],
  "st louis city sc": ["Eduard Löwen", "João Klauss", "Roman Bürki", "Indiana Vassilev", "Célio Pompeu", "Tomáš Ostrák", "Tim Parker", "Nökkvi Þeyr Þórisson"],
  "toronto fc": ["Lorenzo Insigne", "Federico Bernardeschi", "Jonathan Osorio", "Sean Johnson", "Richie Laryea", "Deandre Kerr", "Kobe Franklin", "Brandon Servania"],
  "vancouver whitecaps fc": ["Ryan Gauld", "Brian White", "Yohei Takaoka", "Ranko Veselinović", "Andrés Cubas", "Mathías Laborda", "Fafà Picault", "Sam Adekugbe"],
};

const BY_LEAGUE_ID = {
  [LEAGUE_PREMIER]: PREMIER_BY_TEAM,
  [LEAGUE_LALIGA]: LALIGA_BY_TEAM,
  [LEAGUE_BUNDESLIGA]: BUNDESLIGA_BY_TEAM,
  [LEAGUE_SERIE_A]: SERIE_A_BY_TEAM,
  [LEAGUE_LIGUE_1]: LIGUE1_BY_TEAM,
  [LEAGUE_MLS]: MLS_BY_TEAM,
};

export function getSoccerCuratedRoster(team) {
  const lid = String(team?.idLeague ?? "").trim();
  const map = BY_LEAGUE_ID[lid];
  if (!map) return null;
  const key = normalizeTeamKey(team?.strTeam);
  if (!key) return null;
  const rows = map[key];
  if (!Array.isArray(rows) || rows.length === 0) return null;
  return rows.map((name) => ({ strPlayer: name, strPosition: "—" }));
}
