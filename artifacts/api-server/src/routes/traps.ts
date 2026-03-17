import { Router } from "express";

const router = Router();

interface Trap {
  id: string;
  name: string;
  opening: string;
  description: string;
  side: "White" | "Black";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  moves: string[];
  trapMove: string;
  keyIdea: string;
  avoidance: string;
  fen: string;
}

const TRAPS: Trap[] = [
  {
    id: "scholars-mate",
    name: "Scholar's Mate",
    opening: "King's Pawn Opening",
    description: "The fastest possible checkmate in chess — delivered in just 4 moves. It targets f7, the weakest square near the enemy king before castling.",
    side: "White",
    difficulty: "Beginner",
    moves: ["1. e4 e5", "2. Bc4 Nc6", "3. Qh5 Nf6?", "4. Qxf7#"],
    trapMove: "4. Qxf7#",
    keyIdea: "Attack f7 simultaneously with your queen and bishop. The square is only defended by the king, and once your queen lands there — it's checkmate.",
    avoidance: "Play 3...g6 to push the queen back. Never leave f7 undefended in the opening with your queen side undeveloped.",
    fen: "r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4",
  },
  {
    id: "fools-mate",
    name: "Fool's Mate",
    opening: "King's Pawn / Bird's Opening",
    description: "The shortest possible game — only 2 moves. White weakens their own king's defenses and Black delivers checkmate instantly.",
    side: "Black",
    difficulty: "Beginner",
    moves: ["1. f3 e5", "2. g4?? Qh4#"],
    trapMove: "2...Qh4#",
    keyIdea: "If White irresponsibly opens the diagonal to their king with f3 and g4, Black's queen slides to h4 for instant checkmate.",
    avoidance: "Never play both f3 and g4 in the opening. Protect your king's diagonal at all times.",
    fen: "rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3",
  },
  {
    id: "legal-trap",
    name: "Légal's Trap",
    opening: "Philidor Defense",
    description: "A beautiful queen sacrifice that leads to smothered checkmate. White sacrifices the queen to deliver mate with minor pieces.",
    side: "White",
    difficulty: "Intermediate",
    moves: ["1. e4 e5", "2. Nf3 d6", "3. Bc4 Bg4", "4. Nc3 g6?", "5. Nxe5! Bxd1?", "6. Bxf7+ Ke7", "7. Nd5#"],
    trapMove: "5. Nxe5!",
    keyIdea: "After Black's bishop pins the knight, sacrifice your queen! If Black takes the queen, Bxf7+ forks the king, then Nd5 is smothered mate.",
    avoidance: "When you pin a piece, make sure the opponent can't profitably sacrifice through it. Always check for tactical responses.",
    fen: "rn1q1bnr/ppBbkNpp/8/3Np3/4P3/8/PPPP1PPP/R1BQK2R b KQ - 2 7",
  },
  {
    id: "blackburne-shilling",
    name: "Blackburne Shilling Gambit",
    opening: "Italian Game",
    description: "Black lures White into a greedy pawn grab, then launches a devastating counter-attack. Named because Blackburne allegedly won shillings from amateurs with this trick.",
    side: "Black",
    difficulty: "Intermediate",
    moves: ["1. e4 e5", "2. Nf3 Nc6", "3. Bc4 Nd4?!", "4. Nxe5? Qg5!", "5. Nxf7? Qxg2", "6. Rf1 Qxe4+", "7. Be2 Nf3#"],
    trapMove: "4...Qg5!",
    keyIdea: "After White greedily takes on e5, Black's queen forks the knight on e5 and the pawn on g2. White falls into a losing sequence.",
    avoidance: "After 3...Nd4, play 4. Nxd4 or 4. c3 instead of taking the pawn. Never be greedy in the opening.",
    fen: "r1b1kb1r/pppp1Npp/8/6q1/4n3/8/PPPPBPQP/RNB1KR2 w Qkq - 0 8",
  },
  {
    id: "elephant-trap",
    name: "Elephant Trap",
    opening: "Queen's Gambit Declined",
    description: "A classic trap in the QGD where White's bishop gets caught after an overly aggressive excursion. The bishop has no escape.",
    side: "Black",
    difficulty: "Intermediate",
    moves: ["1. d4 d5", "2. c4 e6", "3. Nc3 Nf6", "4. Bg5 Nbd7", "5. cxd5 exd5", "6. Nxd5? Nxd5!", "7. Bxd8? Bb4+", "8. Qd2 Bxd2+", "9. Kxd2 Kxd8"],
    trapMove: "6. Nxd5?",
    keyIdea: "White takes the pawn thinking the queen is hanging, but after Nxd5, if White takes the queen with Bxd8, Black plays Bb4+ winning back more than the queen.",
    avoidance: "Don't take on d5 if it allows Black's knight to jump in with tempo. Always calculate forcing sequences before capturing.",
    fen: "r1bk1b1r/pppn1ppp/8/3np3/1b6/8/PP1KPPPP/R3KBNR w KQ - 0 10",
  },
  {
    id: "noahs-ark-trap",
    name: "Noah's Ark Trap",
    opening: "Ruy López",
    description: "One of the oldest chess traps. Black's pawns advance to trap White's bishop — just as animals were trapped in the ark. The bishop has no escape.",
    side: "Black",
    difficulty: "Intermediate",
    moves: ["1. e4 e5", "2. Nf3 Nc6", "3. Bb5 a6", "4. Ba4 d6", "5. d4 b5", "6. Bb3 Nxd4", "7. Nxd4 exd4", "8. Qxd4? c5!", "9. Qd5 Be6", "10. Qc6+ Bd7", "11. Qd5 c4"],
    trapMove: "8...c5!",
    keyIdea: "After c5, the bishop on b3 is trapped by the advancing pawns. c4 will follow, and the bishop has nowhere to go.",
    avoidance: "In the Ruy Lopez, retreat your bishop to a safe square before Black can advance their queenside pawns to trap it.",
    fen: "r2qkb1r/3b1ppp/p2Q1n2/1pp5/2pp4/1B6/PPP2PPP/RNB1K2R w KQkq - 0 12",
  },
  {
    id: "lasker-trap",
    name: "Lasker Trap",
    opening: "Albin Counter-Gambit",
    description: "World Champion Emanuel Lasker's contribution. Black sacrifices material for a devastating attack, ending with a spectacular underpromotion to a knight!",
    side: "Black",
    difficulty: "Advanced",
    moves: ["1. d4 d5", "2. c4 e5", "3. dxe5 d4", "4. e3? Bb4+", "5. Bd2 dxe3!", "6. Bxb4?? exf2+!", "7. Ke2 fxg1=N+!", "8. Rxg1 Bh3"],
    trapMove: "7...fxg1=N+!",
    keyIdea: "Instead of promoting to a queen, promote to a KNIGHT! The knight forks king and rook, and Black wins material with a lasting attack.",
    avoidance: "In the Albin Counter-Gambit, avoid 4. e3 as it allows the d4 pawn to advance with tempo. Play 4. Nf3 instead.",
    fen: "rnbqk2r/ppp2ppp/7b/4P3/1B6/8/PP2K1PP/RNRN4 w kq - 0 9",
  },
  {
    id: "fishing-pole-trap",
    name: "Fishing Pole Trap",
    opening: "Ruy López / Berlin Defense",
    description: "Black dangles their knight like bait on a fishing pole, tempting White to take it — and walking into a devastating attack against the kingside.",
    side: "Black",
    difficulty: "Advanced",
    moves: ["1. e4 e5", "2. Nf3 Nc6", "3. Bb5 Nf6", "4. 0-0 Ng4!", "5. h3? h5!", "6. hxg4? hxg4", "7. Ne1 Qh4", "8. f3 g3", "9. Rf2 gxf2+", "10. Kxf2 Qh2+"],
    trapMove: "4...Ng4!",
    keyIdea: "The knight on g4 tempts White to push h3. After h3, Black plays h5! and if White takes the knight, the h-file opens for a devastating attack.",
    avoidance: "After 4...Ng4, don't push h3. Instead play d4 or Re1 to maintain control. Never open lines toward your own king.",
    fen: "r1bqkb1r/pppp1pp1/2n5/4p3/4P2Q/5n2/PPPP1rPP/RNBK1BNR w kq - 0 11",
  },
  {
    id: "budapest-gambit-trap",
    name: "Budapest Gambit Trap",
    opening: "Budapest Gambit",
    description: "Black sacrifices a pawn to develop rapidly and spring a devastating attack on White's queen-side structure before White can consolidate.",
    side: "Black",
    difficulty: "Intermediate",
    moves: ["1. d4 Nf6", "2. c4 e5", "3. dxe5 Ng4", "4. Nf3 Bc5", "5. e3 Nc6", "6. Be2? Ngxe5", "7. Nxe5? Nxe5", "8. 0-0? Bxe3!"],
    trapMove: "8...Bxe3!",
    keyIdea: "After White castles too early, the bishop sacrifice on e3 blows open the position. White's king is fatally exposed after fxe3 Qh4+.",
    avoidance: "Against the Budapest Gambit, avoid castling before securing e3 with pieces. Develop solidly with 6. Bf4 or Bg5 to maintain the extra pawn.",
    fen: "r1bqk2r/pppp1ppp/2n5/4n3/2P5/4bN2/PP2BPPP/RNBQ1RK1 w kq - 0 9",
  },
  {
    id: "fried-liver-attack",
    name: "Fried Liver Attack",
    opening: "Two Knights Defense",
    description: "White sacrifices a knight on f7 to drag the Black king into the center and deliver a brutal attack. One of the most aggressive opening traps in chess.",
    side: "White",
    difficulty: "Advanced",
    moves: ["1. e4 e5", "2. Nf3 Nc6", "3. Bc4 Nf6", "4. Ng5 d5", "5. exd5 Nxd5?", "6. Nxf7! Kxf7", "7. Qf3+ Ke6", "8. Nc3 Nce7", "9. d4! c6", "10. Bg5"],
    trapMove: "6. Nxf7!",
    keyIdea: "The knight sacrifice on f7 forces the king out. White then pours all pieces into the attack — Qf3+, Nc3, d4 — while Black's king wanders helplessly.",
    avoidance: "After 4. Ng5 d5, play 5...Na5 instead of 5...Nxd5 to avoid the Fried Liver. The knight can retreat to b3 without dropping the bishop.",
    fen: "r1bq1b1r/ppppNnpp/4k3/4P1B1/2BP4/2N5/PPP2PPP/R2QK2R b KQ - 2 10",
  },
];

router.get("/", (_req, res) => {
  res.json(TRAPS);
});

router.get("/:id", (req, res) => {
  const trap = TRAPS.find((t) => t.id === req.params["id"]);
  if (!trap) {
    res.status(404).json({ error: "Trap not found" });
    return;
  }
  res.json(trap);
});

export default router;
