import { Router } from "express";
import { readDb, writeDb } from "../lib/jsonDb.js";

const router = Router();

interface Opening {
  id: string;
  name: string;
  eco: string;
  description: string;
  moves: string[];
  category: string;
  difficulty: string;
  keyIdeas: string[];
  popularity: number;
}

const DEFAULT_OPENINGS: Opening[] = [
  // ── BEGINNER ──────────────────────────────────────────────────────────────
  {
    id: "italian-game",
    name: "Italian Game",
    eco: "C50",
    description: "One of the oldest openings in chess history, dating to the 15th century. White develops rapidly to f4 and aims for quick central control. Perfect for beginners to learn core development principles — control the center, develop your pieces, castle early.",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bc4"],
    category: "King's Pawn Opening",
    difficulty: "Beginner",
    keyIdeas: [
      "Control the center with e4 and later d4",
      "Develop knights before bishops (Nf3, Nc6)",
      "Aim the Bc4 at the vulnerable f7 pawn",
      "Castle kingside early for king safety",
      "Build toward the Italian center with c3 and d4"
    ],
    popularity: 90,
  },
  {
    id: "queens-gambit",
    name: "Queen's Gambit",
    eco: "D06",
    description: "A classical queen's pawn opening where White offers a wing pawn to seize the center. The Queen's Gambit is not truly a gambit since the pawn can almost always be recovered. It remains one of the most popular openings at all levels from club play to World Championship.",
    moves: ["d4", "d5", "c4"],
    category: "Queen's Pawn Opening",
    difficulty: "Beginner",
    keyIdeas: [
      "Offer the c4 pawn to draw Black's d5 pawn away from the center",
      "Build a dominant center with pawns on d4 and e4",
      "Develop the light-squared bishop actively before closing it in",
      "Control key central squares d4 and e4",
      "QGA: recapture and play for equality; QGD: hold the center"
    ],
    popularity: 92,
  },
  {
    id: "french-defense",
    name: "French Defense",
    eco: "C00",
    description: "A solid and reliable defense for Black. After 1.e4 e6, Black prepares to challenge White's center with d5. The French creates closed, strategic positions where piece maneuvering and pawn breaks are key. Highly popular among players who prefer positional over tactical play.",
    moves: ["e4", "e6", "d4", "d5"],
    category: "King's Pawn Opening",
    difficulty: "Beginner",
    keyIdeas: [
      "Challenge White's e4 with d5 on the second move",
      "Build a solid pawn structure on light squares",
      "Break with c5 to undermine White's center",
      "Activate the problematic light-squared bishop via a6 or b6",
      "Winawer, Classical, and Advance are main variations"
    ],
    popularity: 78,
  },
  {
    id: "caro-kann",
    name: "Caro-Kann Defense",
    eco: "B10",
    description: "Black's most solid response to 1.e4. By playing 1...c6, Black prepares to challenge White's center with d5 while keeping the queen's bishop free — unlike the French Defense. The Caro-Kann is renowned for its structural soundness and endgame advantages.",
    moves: ["e4", "c6", "d4", "d5"],
    category: "King's Pawn Opening",
    difficulty: "Beginner",
    keyIdeas: [
      "Solid pawn structure without the French's bad bishop",
      "The c6 pawn supports d5 while keeping Bc8 active",
      "Counterplay with c5 breaks in the middlegame",
      "Endgame advantages due to structural solidity",
      "Classical, Advance, and Exchange are key variations"
    ],
    popularity: 75,
  },
  {
    id: "london-system",
    name: "London System",
    eco: "D02",
    description: "A solid, reliable weapon for White that has surged in popularity in the 2010s and 2020s. White builds a stable pawn triangle on d4, e3, and c3, develops the dark-squared bishop to f4, and creates a fortress-like position. Magnus Carlsen, Fabiano Caruana, and many elite players use it regularly.",
    moves: ["d4", "d5", "Nf3", "Nf6", "Bf4", "e6", "e3"],
    category: "Queen's Pawn Opening",
    difficulty: "Beginner",
    keyIdeas: [
      "Build a pawn triangle: d4, e3, c3 for maximum stability",
      "Develop the dark-squared bishop to f4 before playing e3",
      "Control the center quietly and avoid early confrontations",
      "Simple development leads to pleasant, pressure-free positions",
      "Ideal for club players who prefer systems over memorized lines"
    ],
    popularity: 82,
  },
  {
    id: "kings-pawn-open",
    name: "King's Pawn Game (1.e4 e5)",
    eco: "C20",
    description: "The open game resulting from 1.e4 e5 is the most classical of all chess battlegrounds. Both sides fight immediately for the center. These positions teach core principles of rapid development, piece activity, and king safety better than any other opening.",
    moves: ["e4", "e5"],
    category: "King's Pawn Opening",
    difficulty: "Beginner",
    keyIdeas: [
      "Immediate central control and pawn confrontation",
      "Rapid development is rewarded — lagging leads to attacks",
      "White's goal: exploit e5 weakness and open lines",
      "Black's goal: equalize and look for counterplay",
      "Foundation for Italian, Spanish, Scotch, and more"
    ],
    popularity: 95,
  },

  // ── INTERMEDIATE ──────────────────────────────────────────────────────────
  {
    id: "ruy-lopez",
    name: "Ruy López (Spanish Opening)",
    eco: "C60",
    description: "One of the oldest and most classical of all chess openings, analyzed since the 16th century. White pins Black's knight to pressure the e5 pawn indirectly. The Ruy López is the backbone of classical chess and has been played at every World Championship.",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bb5"],
    category: "King's Pawn Opening",
    difficulty: "Intermediate",
    keyIdeas: [
      "Pin the Nc6 indirectly, threatening to win the e5 pawn later",
      "Build a classical pawn center with d4 after preparation",
      "Main lines: Morphy Defense (a6), Marshall Attack, Berlin",
      "Long maneuvering games that reward positional understanding",
      "The Berlin endgame is considered objectively very solid for Black"
    ],
    popularity: 95,
  },
  {
    id: "scotch-game",
    name: "Scotch Game",
    eco: "C44",
    description: "An aggressive opening popularized at the World Championship level by Garry Kasparov. White immediately strikes at the center with d4, creating open lines and piece activity. The Scotch is sharper than the Italian or Ruy López and leads to exciting complications.",
    moves: ["e4", "e5", "Nf3", "Nc6", "d4", "exd4", "Nxd4"],
    category: "King's Pawn Opening",
    difficulty: "Intermediate",
    keyIdeas: [
      "Strike the center immediately with d4 — no slow preparation",
      "Open central files for rooks and active piece play",
      "The Nd4 becomes a strong central outpost",
      "Four Knights Scotch and Mieses are common Black responses",
      "Kasparov's choice: sharp, unbalanced, great winning chances"
    ],
    popularity: 76,
  },
  {
    id: "english-opening",
    name: "English Opening",
    eco: "A10",
    description: "A flexible hypermodern opening where White controls the center from the flank with c4. The English transposes into many different structures and gives White strategic flexibility. Extremely popular at grandmaster level for the rich variety of resulting positions.",
    moves: ["c4"],
    category: "Flank Opening",
    difficulty: "Intermediate",
    keyIdeas: [
      "Control the d5 square from the flank rather than occupying the center",
      "Extremely flexible — transposes to QG, King's Indian, and more",
      "Symmetrical English (1...c5) leads to mirror-image battles",
      "Allows White to choose strategic direction in the middlegame",
      "Favored by Karpov, Kasparov, and Carlsen"
    ],
    popularity: 72,
  },
  {
    id: "nimzo-indian",
    name: "Nimzo-Indian Defense",
    eco: "E20",
    description: "One of the most respected chess defenses, developed by Aron Nimzowitsch. Black immediately pins White's knight with Bb4, fighting for the center without a direct pawn confrontation. The Nimzo-Indian creates rich strategic imbalances and is a favorite of world champions.",
    moves: ["d4", "Nf6", "c4", "e6", "Nc3", "Bb4"],
    category: "Indian Defense",
    difficulty: "Intermediate",
    keyIdeas: [
      "Pin the Nc3 with Bb4 to create long-term pressure",
      "Exchange on c3 to give White doubled pawns (structural imbalance)",
      "Control the e4 square without occupying it with a pawn",
      "Rich strategic play — Black fights for central squares",
      "Samisch, Rubinstein, and Classical are major variations"
    ],
    popularity: 84,
  },
  {
    id: "sicilian-defense",
    name: "Sicilian Defense (Open)",
    eco: "B20",
    description: "The most popular chess opening at all levels. After 1.e4 c5, Black fights for the d4 square asymmetrically, creating rich counterplay possibilities. White typically plays 2.Nf3 and 3.d4 to open the center. The resulting positions are among the sharpest and most complex in all of chess.",
    moves: ["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4"],
    category: "King's Pawn Opening",
    difficulty: "Intermediate",
    keyIdeas: [
      "Fight for the d4 square without giving White a symmetric center",
      "Queenside pawn majority after ...cxd4 gives Black long-term chances",
      "Rich tactical and strategic complexity rewards deep study",
      "White typically attacks on the kingside; Black counterattacks queenside",
      "Many major variations: Najdorf, Dragon, Scheveningen, Classical"
    ],
    popularity: 99,
  },

  // ── ADVANCED ──────────────────────────────────────────────────────────────
  {
    id: "sicilian-najdorf",
    name: "Sicilian Najdorf (B90)",
    eco: "B90",
    description: "The most popular and controversial chess opening in history. Named after Miguel Najdorf, it was Bobby Fischer's and Garry Kasparov's weapon of choice. Black plays 5...a6 — a mysterious move that prevents Bb5+ and prepares queenside expansion. The resulting positions are double-edged masterpieces of theoretical complexity.",
    moves: ["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3", "a6"],
    category: "Sicilian Defense",
    difficulty: "Advanced",
    keyIdeas: [
      "5...a6 prevents Bb5+ and prepares ...b5 queenside expansion",
      "English Attack (f3, Be3, g4) is White's sharpest reply",
      "Black counterattacks with ...b5, ...Bb7, and queenside play",
      "Scheveningen move order is a key transpositional idea",
      "Deep theoretical complexity — lines go 25+ moves deep",
      "Fischer vs Geller games are essential Najdorf studies"
    ],
    popularity: 97,
  },
  {
    id: "sicilian-dragon",
    name: "Sicilian Dragon (B70)",
    eco: "B70",
    description: "One of the sharpest and most dramatic openings in chess. Black fianchettoes the bishop to g7, creating a powerful 'dragon' diagonal. The Yugoslav Attack (White plays h4, castles queenside) leads to opposite-side castling and spectacular mutual attacks. Often described as 'either you crush or get crushed.'",
    moves: ["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3", "g6"],
    category: "Sicilian Defense",
    difficulty: "Advanced",
    keyIdeas: [
      "Fianchetto the Bg7 on the long diagonal — the 'dragon'",
      "Yugoslav Attack: h4, Be3, Qd2, O-O-O creates opposite-side attacks",
      "Black's ...Rxc3 sacrifice is a thematic tactical idea",
      "The h-file battle (h4-h5-h6) is White's typical attacking plan",
      "Chinese Dragon: Black delays castling to keep options open",
      "Dragon bishop on g7 often becomes a game-deciding piece"
    ],
    popularity: 85,
  },
  {
    id: "sicilian-scheveningen",
    name: "Sicilian Scheveningen (B80)",
    eco: "B80",
    description: "A solid and flexible Sicilian variation where Black builds a 'small center' with pawns on d6 and e6. Named after the Dutch city where it was first popularized, the Scheveningen is a favorite of Kasparov and many elite players. It avoids the sharpest Dragon lines while maintaining dynamic counterplay.",
    moves: ["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3", "e6"],
    category: "Sicilian Defense",
    difficulty: "Advanced",
    keyIdeas: [
      "Build a 'small center' with ...d6 and ...e6 — solid and flexible",
      "The e6 pawn avoids the weaknesses of ...g6 Dragon setups",
      "Keres Attack (g4): White attacks before Black can complete development",
      "English Attack (f3-Be3-Qd2) is the main modern try",
      "Black's plan: ...a6, ...b5, counterplay on the queenside",
      "Kasparov used it to win many crucial World Championship games"
    ],
    popularity: 80,
  },
  {
    id: "sicilian-kan",
    name: "Sicilian Kan / Paulsen (B40)",
    eco: "B40",
    description: "The Kan (also called the Paulsen) is a remarkably flexible and elastic Sicilian system. After 1.e4 c5 2.Nf3 e6 3.d4 cxd4 4.Nxd4 a6, Black keeps maximum flexibility before committing to a specific structure. It can transpose to Scheveningen, Taimanov, or Najdorf setups.",
    moves: ["e4", "c5", "Nf3", "e6", "d4", "cxd4", "Nxd4", "a6"],
    category: "Sicilian Defense",
    difficulty: "Advanced",
    keyIdeas: [
      "Maximum flexibility — Black doesn't commit the structure early",
      "...a6 prevents Bb5 pins and prepares ...b5 expansion",
      "Can transpose to Scheveningen, Najdorf, or Taimanov",
      "Solid structure avoids the sharpest theoretical lines",
      "Black aims for ...Qc7, ...Bc5 or ...Be7 depending on White's setup",
      "A chameleon defense — White never knows quite what to prepare for"
    ],
    popularity: 68,
  },
  {
    id: "sicilian-accelerated-dragon",
    name: "Sicilian Accelerated Dragon (B34)",
    eco: "B34",
    description: "The Accelerated Dragon combines the Dragon's fianchetto idea with the speed of skipping d6. By playing ...g6 before ...d6, Black sidesteps the Yugoslav Attack and creates fresh problems for White. The Maróczy Bind (c4) is White's most challenging reply.",
    moves: ["e4", "c5", "Nf3", "Nc6", "d4", "cxd4", "Nxd4", "g6"],
    category: "Sicilian Defense",
    difficulty: "Advanced",
    keyIdeas: [
      "Fianchetto g7 without committing d6 — more flexibility than Dragon",
      "Avoids the Yugoslav Attack (White can't play Be3-Qd2-O-O-O vs g6+Nc6)",
      "Maróczy Bind: White plays c4 to squeeze Black's queenside space",
      "Black challenges the bind with ...d5 pawn break at the right moment",
      "Hyper-Accelerated Dragon: 2...g6 instead of 2...Nc6 — even rarer",
      "Rich strategic play with clear pawn structure imbalances"
    ],
    popularity: 60,
  },
  {
    id: "kings-indian",
    name: "King's Indian Defense",
    eco: "E60",
    description: "A hypermodern defense where Black allows White to build a large pawn center and then attacks it from the flanks. The King's Indian is one of the most dynamic and rich openings in chess, used by Fischer, Kasparov, Bronstein, and Geller. Black's kingside attack often clashes violently with White's queenside advance.",
    moves: ["d4", "Nf6", "c4", "g6", "Nc3", "Bg7", "e4", "d6", "Nf3", "O-O"],
    category: "Indian Defense",
    difficulty: "Advanced",
    keyIdeas: [
      "Allow White to build a center (d4-e4-c4), then attack it hypermodernly",
      "The Bg7 fianchetto controls the long diagonal d4-a7",
      "Classic main line: ...e5 vs White's d4 pawn — mutual pawn breaks",
      "Sämisch (f3): White's most aggressive, Black responds with ...c5 or ...e5",
      "Yugoslav: White plays g3 and targets the d6 pawn",
      "Black's kingside attack (f5-f4) races against White's queenside (c5-b6)"
    ],
    popularity: 87,
  },
  {
    id: "dutch-defense",
    name: "Dutch Defense",
    eco: "A80",
    description: "An aggressive, uncompromising defense where Black immediately fights for kingside space with f5. The Dutch is rich and complex — the Stonewall creates a fortress while the Leningrad System leads to fianchetto attacks. Black accepts a slightly weakened kingside in exchange for dynamic counterplay.",
    moves: ["d4", "f5"],
    category: "Queen's Pawn Opening",
    difficulty: "Advanced",
    keyIdeas: [
      "Control e4 from the very first move with f5",
      "Stonewall Dutch: fixed pawn chain d5-e6-f5, blockade strategy",
      "Leningrad Dutch: ...g6 fianchetto for dynamic kingside play",
      "Classical Dutch: ...e6 with flexible ...Nf6-d7 maneuvers",
      "Weak e5 square is Black's structural concession",
      "Rich attacking possibilities compensate for the weakened king"
    ],
    popularity: 55,
  },
  {
    id: "grünfeld-defense",
    name: "Grünfeld Defense",
    eco: "D70",
    description: "A hypermodern defense where Black invites White to build an imposing center with d4-c4-e4, then immediately attacks it with ...d5. The Grünfeld creates sharp, principled positions where the center battle is decisive. It was Bobby Fischer's preferred weapon against d4.",
    moves: ["d4", "Nf6", "c4", "g6", "Nc3", "d5"],
    category: "Indian Defense",
    difficulty: "Advanced",
    keyIdeas: [
      "Invite White to build a huge center, then undermine it with ...d5",
      "The Bg7 exerts massive pressure on White's d4 pawn",
      "Exchange Variation: White grabs the center, Black counterattacks",
      "Russian System (Nf3, Qb3): White avoids early simplification",
      "Black accepts structural concessions for dynamic piece activity",
      "The ...c5 and ...cxd4 pawn breaks are thematic ideas"
    ],
    popularity: 80,
  },
  {
    id: "queens-indian",
    name: "Queen's Indian Defense",
    eco: "E12",
    description: "A solid, classical defense where Black fianchettoes the queen's bishop to fight for the e4 square. The Queen's Indian is one of the most reliable defenses against d4 and Nf3, avoiding the sharp Nimzo-Indian while maintaining active piece play. Favored by Petrosian, Karpov, and Kramnik.",
    moves: ["d4", "Nf6", "c4", "e6", "Nf3", "b6"],
    category: "Indian Defense",
    difficulty: "Advanced",
    keyIdeas: [
      "Fianchetto the queen's bishop to b7 to fight for e4 square",
      "Avoid the Nimzo-Indian while keeping active piece play",
      "Petrosian System (a3): White prevents ...Bb4 pin ideas",
      "Modern Main Line: ...Bb7, ...Be7, ...O-O solid setup",
      "Black's strategy: control e4, play ...c5 or ...d5 breaks",
      "Structural solidity makes it a favorite for endgame specialists"
    ],
    popularity: 72,
  },
  {
    id: "vienna-game",
    name: "Vienna Game",
    eco: "C25",
    description: "A classical and somewhat underestimated opening where White develops the queen's knight to c3 before Nf3. The Vienna Game is rich with tactical possibilities — the Vienna Gambit (f4) leads to sharp attacking play, while quieter lines transpose to solid Italian or Bishop's Opening structures.",
    moves: ["e4", "e5", "Nc3"],
    category: "King's Pawn Opening",
    difficulty: "Intermediate",
    keyIdeas: [
      "Develop Nc3 to support e4 and prepare f4 or Nf3",
      "Vienna Gambit (f4): aggressive play aiming for f5 pawn storms",
      "Quiet Vienna (Bc4): transpose to Classical Italian setups",
      "King's Gambit connection: 2.Nc3 avoids many King's Gambit refutations",
      "Black's best: ...Nf6 and ...Nc6 with active piece play",
      "Steinitz Gambit (4.g3): unusual but rich with tactical ideas"
    ],
    popularity: 55,
  },
  {
    id: "pirc-defense",
    name: "Pirc Defense",
    eco: "B07",
    description: "A hypermodern defense where Black invites White to build a big center, then attacks it from the sides. Named after Yugoslav grandmaster Vasja Pirc, it's characterized by ...d6, ...Nf6, and a kingside fianchetto (g6, Bg7). The Pirc is rich, flexible, and full of dynamic potential.",
    moves: ["e4", "d6", "d4", "Nf6", "Nc3", "g6"],
    category: "King's Pawn Opening",
    difficulty: "Advanced",
    keyIdeas: [
      "Invite White to build a center with d4-e4, then undermine it",
      "Fianchetto Bg7 for pressure along the long diagonal",
      "Austrian Attack (f4-f5): White's most aggressive reply",
      "Classical System (Be2-Nf3): solid, positional squeeze",
      "Black's plan: ...c5 or ...e5 to challenge White's center",
      "Flexible — can become King's Indian-like structures"
    ],
    popularity: 58,
  },
  {
    id: "trompowsky-attack",
    name: "Trompowsky Attack",
    eco: "A45",
    description: "An aggressive and somewhat offbeat weapon against the King's Indian setup. White immediately attacks Black's Nf6 with Bg5 before establishing the usual d4 structure. The Trompowsky avoids massive theory and leads to fresh, unexplored positions — a favorite weapon of Julian Hodgson and Magnus Carlsen.",
    moves: ["d4", "Nf6", "Bg5"],
    category: "Queen's Pawn Opening",
    difficulty: "Intermediate",
    keyIdeas: [
      "Attack the Nf6 immediately with Bg5 — no standard theory",
      "If ...Ne4: Bf4 and White has solid, easy development",
      "If ...e6: transpose to a Torre Attack-like position",
      "If ...c5: sharp gambit play with e4 advance",
      "Avoids huge amounts of King's Indian / Grünfeld theory",
      "Carlsen uses it to reach fresh, untheorized positions"
    ],
    popularity: 52,
  },
  {
    id: "catalan-opening",
    name: "Catalan Opening",
    eco: "E00",
    description: "One of the most refined openings in chess. White combines the Queen's Gambit idea of central control with a fianchetto on g2, creating a powerful long diagonal that puts permanent pressure on Black's queenside. The Catalan is elegant, deep, and favored by many World Champions including Karpov and Kramnik.",
    moves: ["d4", "Nf6", "c4", "e6", "g3", "d5", "Bg2"],
    category: "Queen's Pawn Opening",
    difficulty: "Advanced",
    keyIdeas: [
      "Combine d4-c4 central pressure with the Bg2 long diagonal",
      "Open Catalan (dxc4): Black takes the pawn — White gets e4",
      "Closed Catalan: solid structure, White pressures c5 and b6",
      "The Bg2 exerts long-term pressure on the queenside pawns",
      "White's rooks coordinate naturally on c1 and d1",
      "Deep positional play — not for tactical slugfests"
    ],
    popularity: 74,
  },
  {
    id: "benko-gambit",
    name: "Benko Gambit",
    eco: "A57",
    description: "One of the most ambitious gambits in all of chess. Black sacrifices a pawn on b5 (and sometimes c5) to gain long-term queenside pressure and open files for the rooks. The compensation is positional rather than tactical — Black gets the a and b files and a permanent initiative that lasts into the endgame.",
    moves: ["d4", "Nf6", "c4", "c5", "d5", "b5"],
    category: "Queen's Pawn Opening",
    difficulty: "Advanced",
    keyIdeas: [
      "Sacrifice the b5 pawn for open a and b files (long-term initiative)",
      "The compensation is positional, not tactical — files and diagonals",
      "Black's Bg7 aims down the long diagonal toward White's queenside",
      "Rooks operate on the open a and b files after ...axb5 cxb5",
      "White often accepts (cxb5) or declines (various systems)",
      "Initiative lasts well into the endgame — not just a quick attack"
    ],
    popularity: 50,
  },
];

function getOpeningsDb(): Opening[] {
  const stored = readDb<{ openings?: Opening[]; progress?: unknown[] }>("DATABASE.JSON", {});
  const storedOpenings = stored.openings ?? [];

  if (storedOpenings.length === 0) {
    writeDb("DATABASE.JSON", { ...stored, openings: DEFAULT_OPENINGS });
    return DEFAULT_OPENINGS;
  }

  // Merge: add any DEFAULT_OPENINGS that aren't in stored list yet
  const storedIds = new Set(storedOpenings.map((o) => o.id));
  const newOnes = DEFAULT_OPENINGS.filter((o) => !storedIds.has(o.id));

  if (newOnes.length > 0) {
    const merged = [...storedOpenings, ...newOnes];
    writeDb("DATABASE.JSON", { ...stored, openings: merged });
    return merged;
  }

  return storedOpenings;
}

router.get("/", (_req, res) => {
  const openings = getOpeningsDb();
  res.json(openings);
});

router.get("/:id", (req, res) => {
  const openings = getOpeningsDb();
  const opening = openings.find((o) => o.id === req.params.id);
  if (!opening) {
    res.status(404).json({ error: "Opening not found" });
    return;
  }
  res.json(opening);
});

export default router;
