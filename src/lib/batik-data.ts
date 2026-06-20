import parangImg from "@/Gambar Batik/batik-parang.jpg";
import kawungImg from "@/Gambar Batik/batik-kawung.jpg";
import megamendungImg from "@/Gambar Batik/batik-mega-mendung.png";
import sekarjagadImg from "@/Gambar Batik/batik-sekar-jagad.jpg";
import truntumImg from "@/Gambar Batik/batik-truntum.jpg";
import lasemImg from "@/Gambar Batik/batik-lasem.jpg";

export type Bilingual = { en: string; id: string };

export type Batik = {
  id: string;
  name: string;
  region: Bilingual;
  origin: Bilingual;
  era: string;
  colors: string[]; // hex
  motif: "parang" | "kawung" | "megamendung" | "sekarjagad" | "truntum" | "lasem";
  tagline: Bilingual;
  philosophy: Bilingual;
  history: Bilingual;
  symbolism: Bilingual[];
  documentaryId: string; // youtube id
  heroImage: string;
};

export const BATIKS: Batik[] = [
  {
    id: "parang",
    name: "Batik Parang",
    region: { en: "Yogyakarta & Surakarta", id: "Yogyakarta & Surakarta" },
    origin: { en: "Central Java", id: "Jawa Tengah" },
    era: "16th c. — Mataram",
    colors: ["#3a2418", "#c9a14a", "#f5e9d0"],
    motif: "parang",
    tagline: {
      en: "The diagonal river of courage — once worn only by kings.",
      id: "Sungai diagonal keberanian — dahulu hanya dikenakan para raja.",
    },
    philosophy: {
      en: "Parang means 'cliff'. Its unbroken diagonal lines represent the continuous flow of life, persistence against the tides, and the moral duty of a leader to never surrender. Forbidden to commoners under the Mataram court.",
      id: "Parang berarti 'tebing'. Garis diagonal tak terputus melambangkan aliran hidup yang berkelanjutan, ketekunan melawan ombak, dan kewajiban moral seorang pemimpin untuk tidak menyerah. Dilarang bagi rakyat biasa di Keraton Mataram.",
    },
    history: {
      en: "Created by Sultan Agung of Mataram while meditating on the southern coast, watching waves crash against cliffs. The motif spread across Javanese royal courts and is now a UNESCO-recognized intangible heritage.",
      id: "Diciptakan Sultan Agung dari Mataram saat bermeditasi di pesisir selatan, menyaksikan ombak memecah tebing. Motif ini menyebar ke seluruh keraton Jawa dan kini diakui UNESCO sebagai warisan tak benda.",
    },
    symbolism: [
      { en: "Leadership", id: "Kepemimpinan" },
      { en: "Courage", id: "Keberanian" },
      { en: "Persistence", id: "Ketekunan" },
    ],
    documentaryId: "s94JDFvxSsQ",
    heroImage: parangImg,
  },
  {
    id: "kawung",
    name: "Batik Kawung",
    region: { en: "Yogyakarta", id: "Yogyakarta" },
    origin: { en: "Central Java", id: "Jawa Tengah" },
    era: "13th c. — Majapahit",
    colors: ["#2c1810", "#b8893f", "#e8d4a0"],
    motif: "kawung",
    tagline: {
      en: "Four petals of inner purity, geometry of the soul.",
      id: "Empat kelopak kesucian jiwa, geometri batin.",
    },
    philosophy: {
      en: "Kawung depicts the sugar palm fruit arranged in fours, symbolizing the four cardinal points and the four sources of human energy. It teaches inner control, wisdom, and remembering one's origin.",
      id: "Kawung menggambarkan buah aren yang tersusun empat, melambangkan empat penjuru mata angin dan empat sumber energi manusia. Mengajarkan pengendalian diri, kebijaksanaan, dan mengingat asal-usul.",
    },
    history: {
      en: "Found on temple reliefs at Prambanan, Kawung is among the oldest documented batik motifs, dating to the Majapahit era. It was reserved for the inner royal family.",
      id: "Ditemukan pada relief Candi Prambanan, Kawung termasuk motif batik tertua yang tercatat, berasal dari era Majapahit. Dahulu khusus keluarga inti kerajaan.",
    },
    symbolism: [
      { en: "Purity", id: "Kesucian" },
      { en: "Wisdom", id: "Kebijaksanaan" },
      { en: "Self-control", id: "Pengendalian diri" },
    ],
    documentaryId: "s94JDFvxSsQ",
    heroImage: kawungImg,
  },
  {
    id: "megamendung",
    name: "Batik Mega Mendung",
    region: { en: "Cirebon, West Java", id: "Cirebon, Jawa Barat" },
    origin: { en: "West Java", id: "Jawa Barat" },
    era: "17th c. — Sino-Javanese",
    colors: ["#1e3a5f", "#5a8fc4", "#b8d4e8"],
    motif: "megamendung",
    tagline: {
      en: "Seven layers of cloud — patience as a way of being.",
      id: "Tujuh lapis awan — kesabaran sebagai jalan hidup.",
    },
    philosophy: {
      en: "Mega Mendung means 'cloudy sky'. Its seven cloud layers represent the seven heavens, and the gradient teaches that a calm exterior holds depth. Born from the marriage of Sunan Gunung Jati with a Chinese princess — a love between cultures.",
      id: "Mega Mendung berarti 'langit mendung'. Tujuh lapis awan melambangkan tujuh lapis langit, gradasinya mengajarkan ketenangan menyimpan kedalaman. Lahir dari pernikahan Sunan Gunung Jati dengan putri Tiongkok — cinta antar budaya.",
    },
    history: {
      en: "A fusion of Islamic Cirebon court tradition and Ming dynasty Chinese cloud motifs, brought by Princess Ong Tien in the 1500s. Today it is Cirebon's cultural emblem.",
      id: "Perpaduan tradisi keraton Cirebon Islam dan motif awan Dinasti Ming Tiongkok, dibawa Putri Ong Tien tahun 1500-an. Kini menjadi lambang budaya Cirebon.",
    },
    symbolism: [
      { en: "Patience", id: "Kesabaran" },
      { en: "Calmness", id: "Ketenangan" },
      { en: "Cross-cultural love", id: "Cinta lintas budaya" },
    ],
    documentaryId: "s94JDFvxSsQ",
    heroImage: megamendungImg,
  },
  {
    id: "sekarjagad",
    name: "Batik Sekar Jagad",
    region: { en: "Solo & Yogyakarta", id: "Solo & Yogyakarta" },
    origin: { en: "Central Java", id: "Jawa Tengah" },
    era: "18th c.",
    colors: ["#4a2818", "#c98a3f", "#e8c089", "#8b3a2e"],
    motif: "sekarjagad",
    tagline: {
      en: "A map of the world's flowers — diversity in one cloth.",
      id: "Peta bunga-bunga dunia — keberagaman dalam satu kain.",
    },
    philosophy: {
      en: "Sekar Jagad means 'map of the world' (sekar = flower/map, jagad = world). Each enclosed island contains a different motif — a celebration of beauty and diversity. Worn at weddings to bless a union of differences.",
      id: "Sekar Jagad berarti 'peta dunia' (sekar = bunga/peta, jagad = dunia). Tiap pulau berisi motif berbeda — perayaan keindahan dan keberagaman. Dikenakan di pernikahan untuk memberkati persatuan perbedaan.",
    },
    history: {
      en: "Developed in the Surakarta court as a wedding cloth, it visually embodies the Javanese philosophy of 'bhinneka tunggal ika' — unity in diversity.",
      id: "Dikembangkan di Keraton Surakarta sebagai kain pernikahan, secara visual mewujudkan filosofi Jawa 'bhinneka tunggal ika' — berbeda-beda tetapi tetap satu.",
    },
    symbolism: [
      { en: "Diversity", id: "Keberagaman" },
      { en: "Beauty", id: "Keindahan" },
      { en: "Unity", id: "Persatuan" },
    ],
    documentaryId: "s94JDFvxSsQ",
    heroImage: sekarjagadImg,
  },
  {
    id: "truntum",
    name: "Batik Truntum",
    region: { en: "Surakarta", id: "Surakarta" },
    origin: { en: "Central Java", id: "Jawa Tengah" },
    era: "18th c.",
    colors: ["#2a1a10", "#a87838", "#f0d89c"],
    motif: "truntum",
    tagline: {
      en: "Tiny stars rekindling love — the cloth of returning hearts.",
      id: "Bintang-bintang kecil yang menyalakan cinta — kain pulangnya hati.",
    },
    philosophy: {
      en: "Created by Queen Kencana of Surakarta during a season of loneliness, the small star motif represents love that rekindles — quietly, patiently, always returning.",
      id: "Diciptakan Ratu Kencana dari Surakarta saat masa kesepian, motif bintang kecil melambangkan cinta yang menyala kembali — diam-diam, sabar, selalu kembali.",
    },
    history: {
      en: "Traditionally worn by the parents of the bride and groom during Javanese weddings — a wish that the love between the new couple may grow as Truntum stars: ever-blooming.",
      id: "Tradisional dikenakan orang tua pengantin dalam pernikahan Jawa — doa agar cinta pasangan baru tumbuh bagai bintang Truntum: tak henti bersemi.",
    },
    symbolism: [
      { en: "Rekindled love", id: "Cinta yang bersemi kembali" },
      { en: "Loyalty", id: "Kesetiaan" },
      { en: "Sincerity", id: "Ketulusan" },
    ],
    documentaryId: "s94JDFvxSsQ",
    heroImage: truntumImg,
  },
  {
    id: "lasem",
    name: "Batik Lasem",
    region: { en: "Lasem, Central Java", id: "Lasem, Jawa Tengah" },
    origin: { en: "North Coast Java", id: "Pesisir Utara Jawa" },
    era: "15th c.",
    colors: ["#b22222", "#1e3a5f", "#f0e0c0", "#2a8a3a"],
    motif: "lasem",
    tagline: {
      en: "The blood-red of Lasem — where two civilizations met.",
      id: "Merah darah Lasem — pertemuan dua peradaban.",
    },
    philosophy: {
      en: "Lasem is famous for its 'abang getih pithik' (chicken-blood red), a hue impossible to replicate elsewhere. It marks the coastal meeting of Chinese settlers and Javanese artisans — a living dialogue in dye.",
      id: "Lasem terkenal dengan 'abang getih pithik' (merah darah ayam), warna yang mustahil ditiru di tempat lain. Menandai pertemuan pesisir antara perantau Tionghoa dan pengrajin Jawa — dialog hidup dalam pewarna.",
    },
    history: {
      en: "Lasem became a major batik port in the 15th century when Admiral Cheng Ho's fleets settled here. Today the workshops, run by Peranakan families for generations, remain among Indonesia's most treasured.",
      id: "Lasem menjadi pelabuhan batik utama abad ke-15 saat armada Laksamana Cheng Ho menetap. Kini lokakaryanya, dikelola keluarga Peranakan turun-temurun, termasuk yang paling berharga di Indonesia.",
    },
    symbolism: [
      { en: "Cultural fusion", id: "Perpaduan budaya" },
      { en: "Endurance", id: "Ketahanan" },
      { en: "Coastal pride", id: "Kebanggaan pesisir" },
    ],
    documentaryId: "s94JDFvxSsQ",
    heroImage: lasemImg,
  },
];

export type Province = {
  id: string;
  name: string;
  // % position on a stylized Indonesia map (0–100)
  x: number;
  y: number;
  batikIds: string[];
  blurb: Bilingual;
};

export const PROVINCES: Province[] = [
  { id: "jateng", name: "Central Java", x: 32.54, y: 77.8, batikIds: ["parang", "kawung", "truntum", "lasem"],
    blurb: { en: "The royal heartland — Yogyakarta, Solo, Lasem.", id: "Jantung kerajaan — Yogyakarta, Solo, Lasem." } },
  { id: "jabar", name: "West Java", x: 27.04, y: 75.13, batikIds: ["megamendung"],
    blurb: { en: "Cirebon's cloudy heavens and coastal court traditions.", id: "Langit berawan Cirebon dan tradisi keraton pesisir." } },
  { id: "jatim", name: "East Java", x: 39.69, y: 77.44, batikIds: ["sekarjagad"],
    blurb: { en: "Madura's bold reds and Tuban's wild flora.", id: "Merah berani Madura dan flora liar Tuban." } },
  { id: "yogya", name: "Yogyakarta", x: 33.19, y: 81.18, batikIds: ["parang", "kawung"],
    blurb: { en: "Court city, cradle of classical batik.", id: "Kota keraton, sumber batik klasik." } },
];

export type TimelineEvent = {
  year: string;
  title: Bilingual;
  description: Bilingual;
};

export const TIMELINE: TimelineEvent[] = [
  { year: "4th c.",
    title: { en: "Ancient Java", id: "Jawa Kuno" },
    description: { en: "Wax-resist textiles appear on temple reliefs across Java.", id: "Tekstil dengan teknik perintang lilin muncul di relief candi-candi Jawa." } },
  { year: "13th c.",
    title: { en: "Majapahit Empire", id: "Kerajaan Majapahit" },
    description: { en: "Kawung and geometric motifs flourish in royal courts.", id: "Kawung dan motif geometris berkembang di keraton." } },
  { year: "16th c.",
    title: { en: "Mataram Era", id: "Era Mataram" },
    description: { en: "Sultan Agung formalizes Parang and forbidden royal motifs.", id: "Sultan Agung membakukan Parang dan motif terlarang kerajaan." } },
  { year: "17th c.",
    title: { en: "Coastal Fusion", id: "Perpaduan Pesisir" },
    description: { en: "Chinese, Arab, Indian and Dutch motifs enter Cirebon, Lasem, Pekalongan.", id: "Motif Tionghoa, Arab, India dan Belanda masuk ke Cirebon, Lasem, Pekalongan." } },
  { year: "1800s",
    title: { en: "Colonial Industrialization", id: "Industrialisasi Kolonial" },
    description: { en: "Cap (stamp) batik invented — democratizing the craft.", id: "Batik cap ditemukan — mendemokratisasi seni ini." } },
  { year: "1945",
    title: { en: "Independence", id: "Kemerdekaan" },
    description: { en: "Batik becomes a symbol of Indonesian national identity.", id: "Batik menjadi simbol identitas nasional Indonesia." } },
  { year: "2009",
    title: { en: "UNESCO Recognition", id: "Pengakuan UNESCO" },
    description: { en: "Indonesian Batik inscribed as Masterpiece of Intangible Heritage.", id: "Batik Indonesia ditetapkan sebagai Mahakarya Warisan Tak Benda." } },
  { year: "Today",
    title: { en: "Modern Renaissance", id: "Renaisans Modern" },
    description: { en: "New designers reinterpret batik for fashion, art, and digital culture.", id: "Desainer baru menafsirkan ulang batik untuk mode, seni, dan budaya digital." } },
];

export type QuizQ = {
  q: Bilingual;
  options: Bilingual[];
  answer: number;
  explain: Bilingual;
};

export const QUIZZES: QuizQ[] = [
  {
    q: { en: "Which motif symbolizes perseverance and leadership?", id: "Motif mana yang melambangkan ketekunan dan kepemimpinan?" },
    options: [
      { en: "Kawung", id: "Kawung" },
      { en: "Parang", id: "Parang" },
      { en: "Mega Mendung", id: "Mega Mendung" },
      { en: "Truntum", id: "Truntum" },
    ],
    answer: 1,
    explain: { en: "Parang's unbroken diagonal lines symbolize the leader's endurance against life's waves.", id: "Garis diagonal Parang yang tak terputus melambangkan ketahanan pemimpin melawan gelombang hidup." },
  },
  {
    q: { en: "Which batik was born from a cross-cultural royal marriage in Cirebon?", id: "Batik mana yang lahir dari pernikahan lintas budaya di Cirebon?" },
    options: [
      { en: "Sekar Jagad", id: "Sekar Jagad" },
      { en: "Lasem", id: "Lasem" },
      { en: "Mega Mendung", id: "Mega Mendung" },
      { en: "Parang", id: "Parang" },
    ],
    answer: 2,
    explain: { en: "Mega Mendung fuses Chinese cloud motifs with Cirebonese Islamic court style.", id: "Mega Mendung memadukan motif awan Tionghoa dengan gaya keraton Islam Cirebon." },
  },
  {
    q: { en: "In what year did UNESCO recognize Indonesian Batik?", id: "Tahun berapa UNESCO mengakui Batik Indonesia?" },
    options: [
      { en: "1999", id: "1999" },
      { en: "2005", id: "2005" },
      { en: "2009", id: "2009" },
      { en: "2014", id: "2014" },
    ],
    answer: 2,
    explain: { en: "October 2, 2009 — celebrated as National Batik Day.", id: "2 Oktober 2009 — diperingati sebagai Hari Batik Nasional." },
  },
  {
    q: { en: "Truntum is traditionally worn by whom at a Javanese wedding?", id: "Truntum tradisional dikenakan oleh siapa di pernikahan Jawa?" },
    options: [
      { en: "The bride", id: "Pengantin wanita" },
      { en: "Parents of the couple", id: "Orang tua mempelai" },
      { en: "The shaman", id: "Dukun" },
      { en: "Guests only", id: "Hanya tamu" },
    ],
    answer: 1,
    explain: { en: "Parents wear Truntum so their love 'rekindles' as guidance for the new couple.", id: "Orang tua memakai Truntum agar cinta mereka 'bersemi kembali' menjadi panduan pasangan baru." },
  },
  {
    q: { en: "Kawung's four petals represent…", id: "Empat kelopak Kawung melambangkan…" },
    options: [
      { en: "Four seasons", id: "Empat musim" },
      { en: "Four cardinal points and inner energies", id: "Empat penjuru dan energi batin" },
      { en: "Four kings", id: "Empat raja" },
      { en: "Four oceans", id: "Empat samudra" },
    ],
    answer: 1,
    explain: { en: "A meditation on cosmic balance and the self.", id: "Meditasi tentang keseimbangan kosmis dan diri." },
  },
];

export const ACHIEVEMENTS = [
  { id: "explorer", name: { en: "Batik Explorer", id: "Penjelajah Batik" }, desc: { en: "Visit your first province", id: "Kunjungi provinsi pertamamu" } },
  { id: "philosopher", name: { en: "Philosophy Master", id: "Ahli Filosofi" }, desc: { en: "Read 3 motif philosophies", id: "Baca 3 filosofi motif" } },
  { id: "collector", name: { en: "Motif Collector", id: "Kolektor Motif" }, desc: { en: "Discover all 6 batik styles", id: "Temukan 6 gaya batik" } },
  { id: "guardian", name: { en: "Cultural Guardian", id: "Penjaga Budaya" }, desc: { en: "Pass the quiz with 80%+", id: "Lulus kuis dengan ≥80%" } },
  { id: "artisan", name: { en: "Master Artisan", id: "Pengrajin Ulung" }, desc: { en: "Create your first batik in the Lab", id: "Ciptakan batik pertamamu di Lab" } },
];
