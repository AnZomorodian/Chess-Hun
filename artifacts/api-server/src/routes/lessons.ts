import { Router } from "express";

const router = Router();

interface Exercise {
  id: string;
  type: string;
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: number;
  content: string;
  exercises: Exercise[];
  order: number;
}

const LESSONS: Lesson[] = [
  {
    id: "piece-values",
    title: "Understanding Piece Values",
    description: "Learn the relative values of each chess piece and how they influence your decisions.",
    category: "Fundamentals",
    difficulty: "Beginner",
    duration: 15,
    order: 1,
    content: `# Piece Values in Chess

Understanding piece values is the foundation of chess strategy. Each piece has a relative value that helps you decide whether to make exchanges.

## The Values

| Piece | Value |
|-------|-------|
| Pawn (♙) | 1 point |
| Knight (♘) | 3 points |
| Bishop (♗) | 3 points |
| Rook (♖) | 5 points |
| Queen (♕) | 9 points |
| King (♔) | Infinite (cannot be captured) |

## Why These Values?

These values represent the average strength of each piece in most positions. However, they are guidelines, not absolute rules.

### Pawns
Pawns are worth 1 point each. They are the foundation of pawn structure and can promote to powerful pieces.

### Knights and Bishops
Both are worth 3 points. Knights excel in closed positions with many pawns. Bishops excel in open positions with long diagonals.

### Rooks
Rooks are worth 5 points. They are powerful on open files and in the endgame.

### Queen
The queen is worth 9 points - the most powerful piece. It combines the power of a rook and bishop.

## Key Principle
A "good trade" is when you capture more points than you give away. For example, capturing a Rook (5) with your Bishop (3) is winning a "rook for a bishop" — you gain 2 points of material advantage.`,
    exercises: [
      {
        id: "pv-1",
        type: "multiple-choice",
        question: "You can capture a knight with your bishop. Is this a good trade?",
        options: ["Yes, because a knight is worth more than a bishop", "No, because they are equal in value", "Yes, because bishops are worth more", "It depends on the position"],
        answer: "It depends on the position",
        explanation: "Knights and bishops are both worth approximately 3 points, so it's usually an equal trade. But position matters — if the bishop is a 'good bishop' with open diagonals, it might be worth more in practice.",
      },
      {
        id: "pv-2",
        type: "multiple-choice",
        question: "Your rook is attacked by an enemy bishop. Should you move your rook?",
        options: ["No, stay — the bishop is worth more", "Yes, because the rook is worth more than the bishop", "It doesn't matter", "Always move the rook to attack"],
        answer: "Yes, because the rook is worth more than the bishop",
        explanation: "A rook (5 points) is worth more than a bishop (3 points). Losing your rook for an enemy bishop would be losing 2 points of material — a significant disadvantage!",
      },
      {
        id: "pv-3",
        type: "multiple-choice",
        question: "What is the combined value of two rooks?",
        options: ["8 points", "9 points", "10 points", "11 points"],
        answer: "10 points",
        explanation: "Two rooks = 5 + 5 = 10 points. This is actually slightly more valuable than a queen (9 points), which is why two rooks are generally considered stronger than a queen in the endgame.",
      },
    ],
  },
  {
    id: "basic-tactics",
    title: "Basic Tactics: Forks, Pins & Skewers",
    description: "Master the three most fundamental tactical weapons in chess.",
    category: "Tactics",
    difficulty: "Beginner",
    duration: 20,
    order: 2,
    content: `# Basic Chess Tactics

Tactics are short-term sequences of moves that win material or checkmate. These three are the most common.

## The Fork

A **fork** is when one piece attacks two enemy pieces simultaneously. The opponent can only save one!

**Example: Knight Fork**
A knight on e5 can attack both the king on g6 and a queen on c6 at the same time. Your opponent must move the king, and you take the queen for free!

Knights are especially dangerous forkers because of their unusual movement — their attacks are hard to predict.

## The Pin

A **pin** is when an attacking piece immobilizes an enemy piece because moving it would expose a more valuable piece behind it.

**Absolute Pin**: The pinned piece cannot legally move because it would put its own king in check.

**Relative Pin**: The pinned piece could technically move, but would expose a valuable piece behind it.

**Example**: A bishop on b5 pins a knight on c6 to the black king on e8. The knight cannot move!

## The Skewer

A **skewer** is like a reverse pin. The more valuable piece is attacked first, and when it moves, the less valuable piece behind it is captured.

**Example**: A rook attacks a queen. The queen must move, and then the rook takes the piece behind it.

## Practice Makes Perfect

Recognizing these patterns is crucial. When you see multiple enemy pieces in a line, think "Pin or Skewer!" When your knight can reach a square that attacks two pieces, think "Fork!"`,
    exercises: [
      {
        id: "bt-1",
        type: "multiple-choice",
        question: "A knight attacks both your queen and rook at the same time. What tactical weapon is this?",
        options: ["Pin", "Fork", "Skewer", "Discovery"],
        answer: "Fork",
        explanation: "A fork is when one piece attacks two (or more) enemy pieces simultaneously. The knight is the most famous forking piece because of its unusual L-shaped movement.",
      },
      {
        id: "bt-2",
        type: "multiple-choice",
        question: "Your bishop attacks an enemy knight, and behind the knight is the enemy king. The knight cannot move without putting its king in check. This is a...",
        options: ["Fork", "Skewer", "Absolute Pin", "Relative Pin"],
        answer: "Absolute Pin",
        explanation: "An absolute pin is when the pinned piece cannot legally move because doing so would expose its own king to check. The pinned piece is completely immobilized.",
      },
      {
        id: "bt-3",
        type: "multiple-choice",
        question: "Your rook attacks the enemy queen directly. Behind the queen is the enemy rook. When the queen moves, you take the rook. This is a...",
        options: ["Fork", "Pin", "Skewer", "Checkmate"],
        answer: "Skewer",
        explanation: "A skewer attacks the more valuable piece first. When it moves out of danger, the less valuable piece behind it is captured. It's the reverse of a pin!",
      },
    ],
  },
  {
    id: "king-safety",
    title: "King Safety & Castling",
    description: "Learn why king safety is paramount and how castling protects your most important piece.",
    category: "Strategy",
    difficulty: "Beginner",
    duration: 12,
    order: 3,
    content: `# King Safety in Chess

The king is your most important piece. Losing it means losing the game. Keeping it safe is often more important than winning material!

## Why Castle Early?

**Castling** serves two purposes:
1. Moves your king to safety behind a wall of pawns
2. Connects your rooks so they can work together

### When to Castle
- Castle within the first 10 moves if possible
- Don't wait until you're in danger
- Castle on the kingside (short castle) or queenside (long castle)

## How Castling Works

**Kingside Castling (O-O)**: The king moves two squares toward the rook, and the rook jumps to the other side.

**Queenside Castling (O-O-O)**: The king moves two squares toward the queenside rook, and that rook jumps over.

## Rules for Castling

You **cannot** castle if:
- The king has already moved
- The rook you're castling with has already moved
- The king is in check
- Any square the king passes through is attacked
- Any square between king and rook is occupied

## Signs of Danger

Your king is in danger when:
- Enemy pieces are aimed at your king
- Your pawn shield is broken
- Your pieces are far from your king
- You haven't castled yet in the middlegame

## Key Principle

**"Castle to safety, then attack!"** Get your king safe first, then launch your attack. A king left in the center is asking for trouble!`,
    exercises: [
      {
        id: "ks-1",
        type: "multiple-choice",
        question: "Can you castle if your king is currently in check?",
        options: ["Yes, castling is one way to escape check", "No, you cannot castle while in check", "Only queenside castle is allowed in check", "Yes, but only kingside"],
        answer: "No, you cannot castle while in check",
        explanation: "One of the fundamental rules: you cannot castle while your king is in check. You must first escape the check by another means (blocking, capturing the attacker, or moving the king).",
      },
      {
        id: "ks-2",
        type: "multiple-choice",
        question: "What are the two benefits of castling?",
        options: ["Attack the opponent and gain material", "Protect the king and connect the rooks", "Win a pawn and develop the bishop", "Open the center and gain a tempo"],
        answer: "Protect the king and connect the rooks",
        explanation: "Castling moves the king to safety behind pawns AND connects the rooks so they can support each other. This is why castling is often one of the most important moves in the opening!",
      },
    ],
  },
  {
    id: "pawn-structure",
    title: "Pawn Structure Fundamentals",
    description: "Discover how pawn structure shapes your entire strategy in chess.",
    category: "Strategy",
    difficulty: "Intermediate",
    duration: 18,
    order: 4,
    content: `# Pawn Structure in Chess

Pawns are the "soul of chess" according to the famous chess teacher Philidor. Your pawn structure determines your entire strategic plan!

## Types of Pawns

### Passed Pawn
A pawn with no enemy pawns in front of it or on adjacent files. Passed pawns are powerful because they can promote!

**Key Rule**: "Passed pawns must be pushed!"

### Doubled Pawns
Two pawns of the same color on the same file. Doubled pawns are generally weak because:
- They cannot protect each other
- They block each other's movement
- One pawn is always backward

### Isolated Pawn
A pawn with no friendly pawns on adjacent files. It cannot be protected by other pawns and must be defended by pieces.

### Backward Pawn
A pawn that cannot advance without being captured, and cannot be protected by neighboring pawns.

## Open and Closed Positions

**Open Position**: Few or no pawns in the center. Better for bishops and rooks.

**Closed Position**: Many locked pawns in the center. Better for knights who can jump over pawns.

## Pawn Breaks

A **pawn break** is when you advance a pawn to challenge enemy pawns and open the position. Pawn breaks are crucial for:
- Activating your pieces
- Creating passed pawns
- Changing the structure to suit your pieces

## Key Principle

Before every game, ask: "What does my pawn structure want me to do?" Let the pawns guide your strategy!`,
    exercises: [
      {
        id: "ps-1",
        type: "multiple-choice",
        question: "What is a 'passed pawn'?",
        options: ["A pawn that has moved past the center", "A pawn with no enemy pawns blocking its path to promotion", "A pawn that has been captured", "A pawn that is on the 7th rank"],
        answer: "A pawn with no enemy pawns blocking its path to promotion",
        explanation: "A passed pawn has no enemy pawns directly in front of it or on adjacent files. It can march to promotion without being stopped by enemy pawns — making it very powerful!",
      },
      {
        id: "ps-2",
        type: "multiple-choice",
        question: "In which type of position are knights generally stronger than bishops?",
        options: ["Open positions", "Closed positions", "Endgames", "When ahead in material"],
        answer: "Closed positions",
        explanation: "Knights can jump over pawns, making them excellent in closed positions with many pawns. Bishops need open diagonals to be strong, so they excel in open positions.",
      },
    ],
  },
  {
    id: "checkmate-patterns",
    title: "Classic Checkmate Patterns",
    description: "Learn the most common and beautiful checkmate patterns every chess player must know.",
    category: "Tactics",
    difficulty: "Intermediate",
    duration: 25,
    order: 5,
    content: `# Classic Checkmate Patterns

Every chess player must know these essential checkmate patterns. Recognizing them allows you to execute brilliant attacks!

## Back Rank Mate

The most common amateur-level checkmate. A rook or queen delivers checkmate on the opponent's back rank while their king is trapped by its own pawns!

**Pattern**: Enemy king is on the back rank, unable to move. Your rook or queen slides to that rank — checkmate!

**Defense**: Create a "luft" (escape square) by moving one of the pawns in front of your king.

## Smothered Mate

An elegant checkmate by a lone knight! The enemy king is surrounded by its own pieces and cannot escape the knight's check.

**Pattern**: Enemy king is surrounded by its own pieces. Your knight delivers check — no escape!

## Scholar's Mate (Fool's Mate)

A very fast checkmate that beginners must know to avoid.

**Sequence**: 1.e4 e5 2.Bc4 Nc6 3.Qh5 Nf6?? 4.Qxf7# 

White attacks f7 with both queen and bishop. Beginners must defend f7!

**Defense**: Play Nc6 before Nf6, or play g6 to drive away the queen.

## Two Rooks / "Lawnmower" Mate

Two rooks systematically cut off the enemy king and deliver checkmate. Very common in endgames.

**Pattern**: One rook limits the king to fewer ranks, the other delivers checkmate.

## Arabian Mate

A knight and rook combine to deliver checkmate in the corner of the board.

**Pattern**: Knight controls the king's escape squares, rook delivers check on the back rank.

## Key Principle

Always be alert for these patterns! When you see pieces aligned toward the enemy king, look for these mating ideas. Chess games are won by recognizing opportunities!`,
    exercises: [
      {
        id: "cp-1",
        type: "multiple-choice",
        question: "What is the 'back rank mate'?",
        options: ["A mate delivered by the queen on the back rank", "A rook or queen delivers checkmate on the back rank while the king is trapped by its own pawns", "A knight delivers mate from behind", "Checkmate in the opening"],
        answer: "A rook or queen delivers checkmate on the back rank while the king is trapped by its own pawns",
        explanation: "The back rank mate is one of the most common checkmates! The king is trapped on the 1st or 8th rank by its own pawns, and a rook or queen delivers check from which there is no escape.",
      },
      {
        id: "cp-2",
        type: "multiple-choice",
        question: "How do you defend against the back rank mate?",
        options: ["Move the king to the center", "Sacrifice a piece", "Create a luft (escape square) by moving a pawn", "Attack the opponent's king immediately"],
        answer: "Create a luft (escape square) by moving a pawn",
        explanation: "Moving h3, g3, or h6/g6 creates an escape square for the king. This simple move prevents back rank disasters and is a habit all experienced players develop.",
      },
    ],
  },
  {
    id: "endgame-basics",
    title: "Essential Endgame Techniques",
    description: "Master the fundamental endgames that decide most chess games.",
    category: "Endgame",
    difficulty: "Intermediate",
    duration: 22,
    order: 6,
    content: `# Chess Endgame Fundamentals

The endgame is where chess games are decided! Even a small material advantage can be enough to win if you know the right technique.

## King and Pawn Endgames

### The King Must Become Active
In the endgame, the king becomes a powerful piece! "Activate your king" is the most important endgame principle.

### The Opposition
Two kings are in "opposition" when they face each other with one square between them. The player NOT to move has the opposition — a strategic advantage!

### Key Squares
Certain squares are "key squares" — if your king reaches them, the pawn promotes. Understanding key squares is the foundation of pawn endgames.

## The Rule of the Square

To determine if a king can catch a passed pawn, draw an imaginary square from the pawn to the promotion square. If the opposing king can step into this square on its turn, it can catch the pawn!

## Rook Endgames

**Lucena Position**: A winning technique where the attacking side "builds a bridge" to escort the pawn to promotion.

**Philidor Position**: A defensive technique where the defending side uses the rook to prevent the advancing king.

### The 7th Rank
A rook on the 7th rank is extremely powerful — it attacks enemy pawns and cuts off the enemy king.

## Bishop vs Knight Endgames

- Bishops excel in open positions
- Knights excel in closed positions with fixed pawns
- A bishop can be "bad" if it's blocked by its own pawns

## Key Endgame Principles

1. **Activate your king immediately**
2. **Create passed pawns**  
3. **Rooks belong behind passed pawns**
4. **Know the key theoretical positions**`,
    exercises: [
      {
        id: "eg-1",
        type: "multiple-choice",
        question: "In a king and pawn endgame, what is the most important principle?",
        options: ["Keep the pawn safe at all costs", "Activate your king — it becomes a powerful piece", "Keep your king on the back rank", "Trade all pawns to reach a draw"],
        answer: "Activate your king — it becomes a powerful piece",
        explanation: "In the endgame, the king transforms from a hiding piece to an attacking force! You must centralize your king and use it aggressively to escort pawns and fight for key squares.",
      },
      {
        id: "eg-2",
        type: "multiple-choice",
        question: "Where should a rook be placed relative to a passed pawn?",
        options: ["In front of the pawn to protect it", "Behind the passed pawn", "On the side of the pawn", "On the opposite side of the board"],
        answer: "Behind the passed pawn",
        explanation: "Rooks belong BEHIND passed pawns — both your own and the enemy's! Your rook behind your passed pawn pushes it from behind and gains power as the pawn advances. Your rook behind the enemy passed pawn restrains it.",
      },
    ],
  },
  {
    id: "opening-principles",
    title: "The 5 Golden Opening Principles",
    description: "Master the fundamental rules that guide every strong player's opening play.",
    category: "Openings",
    difficulty: "Beginner",
    duration: 14,
    order: 7,
    content: `# The 5 Golden Opening Principles

These five principles apply to almost every chess opening. Follow them and you'll start every game with a strong foundation.

## Principle 1: Control the Center

The four central squares — **e4, d4, e5, d5** — are the most important squares on the board. Pieces control more of the board from the center, and control of the center gives you more space and mobility.

**How**: Play pawns to e4 or d4 (as White) or e5/d5/c5 (as Black) to contest the center.

## Principle 2: Develop Your Pieces

**Develop** means moving pieces from their starting squares to active positions. Every move should develop a piece or improve your position.

**Rule of thumb**: Develop knights before bishops. Don't move the same piece twice unless necessary.

> "Develop with threats wherever possible." — Reuben Fine

## Principle 3: Castle Early

Get your king to safety! The center opens up quickly, and a king stuck in the middle becomes a target.

**Target**: Castle within the first 10 moves. Kingside castling (O-O) is usually safest and quickest.

## Principle 4: Don't Move the Queen Too Early

The queen can be attacked and forced to retreat, wasting valuable moves. Wait until your minor pieces are developed before activating the queen.

**Exception**: Short tactical sequences where you gain material immediately.

## Principle 5: Connect Your Rooks

After developing pieces and castling, your rooks should be connected — able to see and support each other on the back rank. This is achieved by clearing the back rank of bishops, knights, and the queen.

## The "Don'ts" of the Opening

- ❌ Don't bring your queen out too early
- ❌ Don't move the same piece twice without reason
- ❌ Don't grab pawns at the expense of development
- ❌ Don't neglect king safety
- ❌ Don't open the game before you're developed`,
    exercises: [
      {
        id: "op-1",
        type: "multiple-choice",
        question: "Which of these is the most important reason to control the center?",
        options: ["It looks impressive", "Pieces control more squares from the center and you gain more space", "It's required by the rules", "It protects your king automatically"],
        answer: "Pieces control more squares from the center and you gain more space",
        explanation: "A piece in the center controls far more squares than a piece on the edge. A knight on e4 attacks 8 squares; a knight on a1 attacks only 2! Central control equals mobility and power.",
      },
      {
        id: "op-2",
        type: "multiple-choice",
        question: "Why shouldn't you move the queen out too early in the opening?",
        options: ["The queen is too slow", "Enemy pieces can attack it and force it to retreat, wasting moves", "It's against the rules", "The queen cannot move in the opening"],
        answer: "Enemy pieces can attack it and force it to retreat, wasting moves",
        explanation: "If you bring your queen out early, your opponent develops pieces while attacking your queen. You waste move after move retreating, while they build a strong position. Development before queen activity!",
      },
      {
        id: "op-3",
        type: "multiple-choice",
        question: "Which pieces should you develop first in the opening?",
        options: ["Rooks first, then queens", "Knights and bishops (minor pieces)", "Only pawns in the opening", "Queens then rooks"],
        answer: "Knights and bishops (minor pieces)",
        explanation: "Knights and bishops (called minor pieces) should come out first. Rooks can't move until the position opens up, and queens are better kept back initially. Knights before bishops is the classic guideline.",
      },
    ],
  },
  {
    id: "tactical-motifs",
    title: "Advanced Tactical Motifs",
    description: "Go beyond the basics and learn discovered attacks, zwischenzug, and deflection.",
    category: "Tactics",
    difficulty: "Intermediate",
    duration: 20,
    order: 8,
    content: `# Advanced Tactical Motifs

Beyond forks, pins and skewers, master players use these more subtle — and devastating — tactical weapons.

## Discovered Attack

A **discovered attack** occurs when moving one piece reveals an attack by another piece behind it.

**Example**: Your bishop is blocking your rook's line. You move the bishop to attack a piece — and simultaneously reveal the rook attacking a different piece. Your opponent cannot deal with both!

**Discovered Check** is especially powerful: moving a piece while revealing check from another piece behind it. The opponent must deal with the check first, often losing material.

## Double Check

The most powerful form of discovered attack. Both the moved piece AND the revealed piece give check simultaneously. The king **must move** — it cannot be blocked or captured.

> "A double check is always decisive." — almost always true in practice

## Zwischenzug (Intermediate Move)

A German word meaning "in-between move." Instead of the expected recapture, you insert a strong move (often a check or threat) that improves your position before completing the exchange.

**Example**: Instead of recapturing a piece immediately, you deliver a check that wins the queen — then recapture.

## Deflection

Force an enemy piece away from a key defensive duty.

**Example**: An enemy rook is defending the back rank. You sacrifice material to deflect the rook away — then deliver checkmate.

## Interference

Place a piece between two coordinating enemy pieces to disrupt their communication.

**Example**: Two rooks defending each other along a rank. You place a piece between them, disrupting their coordination.

## Overloaded Piece

When one enemy piece has too many defensive duties, it's **overloaded**. Attack it from two angles — it can only defend one.

**Example**: The enemy queen is guarding both the rook and the back rank. Attack the rook — when the queen saves it, the back rank is vulnerable.`,
    exercises: [
      {
        id: "tm-1",
        type: "multiple-choice",
        question: "What is a 'discovered attack'?",
        options: ["Finding a new attack on the board", "Moving a piece to reveal an attack by another piece behind it", "Discovering your opponent's strategy", "An attack from behind the enemy lines"],
        answer: "Moving a piece to reveal an attack by another piece behind it",
        explanation: "A discovered attack happens when you move one piece and it 'discovers' — reveals — an attack by the piece behind it. It creates two threats at once, which is incredibly powerful.",
      },
      {
        id: "tm-2",
        type: "multiple-choice",
        question: "Why is a double check so powerful?",
        options: ["It wins two pawns at once", "The king must move — it cannot block or capture both checking pieces", "It automatically wins the game", "It attacks the queen and rook simultaneously"],
        answer: "The king must move — it cannot block or capture both checking pieces",
        explanation: "In double check, both pieces give check simultaneously. You can't block both, and you can't capture both. The only option is to move the king — and often there are very few safe squares!",
      },
      {
        id: "tm-3",
        type: "multiple-choice",
        question: "What does 'zwischenzug' mean?",
        options: ["A winning endgame technique", "An in-between move inserted before the expected recapture", "A German chess opening", "Moving a piece to the center"],
        answer: "An in-between move inserted before the expected recapture",
        explanation: "Zwischenzug (German: 'in-between move') is when you insert a powerful intermediate move — often a check or major threat — before making the 'obvious' move your opponent expected. It catches them off guard!",
      },
    ],
  },
  {
    id: "strategic-planning",
    title: "Strategic Planning & Long-Term Thinking",
    description: "Learn how grandmasters create plans and execute long-term strategies.",
    category: "Strategy",
    difficulty: "Intermediate",
    duration: 22,
    order: 9,
    content: `# Strategic Planning in Chess

Tactics are about seeing specific sequences. Strategy is about creating the CONDITIONS for tactics to happen.

## What is a Plan?

A **plan** is a sequence of moves aimed at a specific goal. Plans can be:

- **Short-term**: 2–3 moves to win material
- **Long-term**: 10+ moves to improve your position, create weaknesses, or launch an attack

> "A bad plan is better than no plan at all." — Siegbert Tarrasch

## How to Find a Plan

### Ask These Questions:

1. **Where are the weaknesses?** (in both camps)
2. **Which pieces are poorly placed?** (improve them)
3. **What pawn breaks are available?**
4. **Who has more space?**
5. **Is the king safe?**

## Good vs Bad Pieces

### Good Bishop
A bishop that is **not blocked by its own pawns** and has open diagonals.

### Bad Bishop
A bishop blocked by pawns on the same color squares. Very limited mobility.

### Knight Outpost
A knight on a central square that **cannot be attacked by enemy pawns**. Knights on outposts (e5, d5, f5) are incredibly powerful.

## Imbalances

Strong players look for **imbalances** — differences between the two sides:

- Rook vs two minor pieces
- Bishop pair vs knight pair
- Space advantage vs piece activity
- Pawn majority on one side

Each imbalance suggests a strategy. Bishop pair? Open the position. Knight outpost? Keep the position closed.

## Prophylaxis

**Prophylaxis** means preventing your opponent's plan before they execute it. Ask: "What does my opponent want to do? How do I stop it?"

This is a hallmark of elite chess — not just pursuing your own plans, but disrupting theirs.`,
    exercises: [
      {
        id: "sp-1",
        type: "multiple-choice",
        question: "What is a 'knight outpost'?",
        options: ["A knight on the edge of the board", "A knight on a central square that cannot be attacked by enemy pawns", "A knight that has moved more than 3 times", "A knight defending the king"],
        answer: "A knight on a central square that cannot be attacked by enemy pawns",
        explanation: "A knight outpost is when your knight occupies a strong central square — usually e5, d5, f5 — and no enemy pawn can attack it. Knights on outposts are often the strongest pieces on the board!",
      },
      {
        id: "sp-2",
        type: "multiple-choice",
        question: "If you have the bishop pair in an open position, what is your strategy?",
        options: ["Exchange one bishop immediately", "Keep the position closed to limit the bishops", "Open the position to maximize the bishops' power", "Trade bishops for knights"],
        answer: "Open the position to maximize the bishops' power",
        explanation: "Two bishops are strongest in open positions with long diagonals. Open the center with pawn breaks! If your opponent has knights, keep the position closed — they thrive in cramped positions.",
      },
    ],
  },
  {
    id: "rook-endgames",
    title: "Rook Endgames Mastery",
    description: "Rook endgames are the most common. Master the key positions every player must know.",
    category: "Endgame",
    difficulty: "Advanced",
    duration: 28,
    order: 10,
    content: `# Rook Endgame Mastery

Over 60% of all endgames are rook endgames. These positions are notoriously difficult even for grandmasters. Master the key concepts and you'll win many more games.

## The Lucena Position — Winning Technique

The Lucena Position is the most important theoretical rook endgame to know. It demonstrates how to win when you have a rook and advanced pawn vs a lone rook.

**Key Method: "Building a Bridge"**

1. Advance the king to support the pawn
2. Use the rook to cut off the enemy king
3. "Build a bridge" by placing the rook to shield the king from checks
4. March the pawn to promotion

## The Philidor Position — Drawing Technique

The Philidor Position is the most important defensive technique. The weaker side can draw with correct play.

**Method**:
1. Place your rook on the 6th rank (3rd if defending)
2. When the opponent advances the pawn to the 6th rank, switch to the back rank
3. Give perpetual checks from behind — the king cannot escape the checks and promote the pawn

> "Rook behind the pawn — always!"

## Rook Activity

**The most important rule**: A rook must be **active**. A passive rook loses. Always seek to:

- Get behind passed pawns (yours or theirs)
- Cut off the enemy king with your rook
- Occupy open files
- Attack enemy pawns from the side (7th rank)

## The 7th Rank

A rook on the 7th rank is an absolute monster:
- It attacks all unadvanced enemy pawns
- It cuts off the enemy king
- Two rooks on the 7th rank often win by force

## Key Principles

1. **King activity** is essential — activate immediately
2. **Rook behind passed pawns** — always
3. **Keep your rook active** — never let it become passive
4. **Create passed pawns** when ahead in material
5. **Cut off the enemy king** with your rook`,
    exercises: [
      {
        id: "re-1",
        type: "multiple-choice",
        question: "What is the 'Philidor Position' used for?",
        options: ["Winning with a passed pawn", "Drawing a rook endgame when behind by a pawn", "Attacking the enemy king", "Promoting a pawn quickly"],
        answer: "Drawing a rook endgame when behind by a pawn",
        explanation: "The Philidor Position is a defensive fortress! The weaker side places their rook on the 6th rank, and when the pawn advances, switches to giving perpetual checks from behind. With correct play, it's always a draw.",
      },
      {
        id: "re-2",
        type: "multiple-choice",
        question: "What is the key rule about rook placement in endgames?",
        options: ["Rooks belong on the back rank", "Rooks belong on the edge of the board", "Rooks belong behind passed pawns — yours and the opponent's", "Rooks should stay near the king"],
        answer: "Rooks belong behind passed pawns — yours and the opponent's",
        explanation: "This is the most fundamental rook endgame rule! Your rook behind your passed pawn grows stronger as the pawn advances. Your rook behind the enemy's passed pawn restrains it. Always ask: where are the passed pawns?",
      },
      {
        id: "re-3",
        type: "multiple-choice",
        question: "Why is a rook on the 7th rank so powerful?",
        options: ["It's closer to the promotion square", "It attacks all unadvanced enemy pawns and cuts off the enemy king", "It can castle from there", "It becomes a queen automatically"],
        answer: "It attacks all unadvanced enemy pawns and cuts off the enemy king",
        explanation: "A rook on the 7th rank simultaneously attacks multiple pawns that haven't advanced, AND cuts off the enemy king to the back rank. Two rooks on the 7th rank often win by force — they're called 'pigs'!",
      },
    ],
  },
  {
    id: "attacking-chess",
    title: "The Art of the Attack",
    description: "Learn how to launch devastating kingside attacks and break through enemy defenses.",
    category: "Tactics",
    difficulty: "Advanced",
    duration: 24,
    order: 11,
    content: `# The Art of the Attack in Chess

Attacking chess is the most exciting and rewarding aspect of the game. But great attacks are built systematically, not randomly.

## Prerequisites for a Successful Attack

Before launching an attack, ensure:

1. **Your pieces are developed** — undeveloped pieces don't participate in the attack
2. **Your king is safe** — you can't attack if you're also being attacked
3. **Your opponent's king is in danger** — look for weaknesses, open files, exposed king

## Opening Lines

The first step in any attack is **opening lines** toward the enemy king:

- **Pawn storms**: Advance pawns toward the castled king (h4, g4, f4)
- **Sacrifices**: Sacrifice material to tear open the king's shelter
- **File opening**: Force open the h or g file

## The Classic Exchange Sacrifice

Giving up a rook for a minor piece (Rxf3 or Rxg3 sacrifices) to:
- Destroy the king's pawn shelter
- Create attacking files and diagonals
- Eliminate a key defensive piece

## The Greek Gift Sacrifice (Bxh7+)

One of the most famous attacking patterns:

1. Bishop takes h7 (Bxh7+), king takes (Kxh7)
2. Knight to g5+ forces king to g6 or g8
3. Queen to h5 threatens Qxf7# or Qh7#
4. White wins material or delivers checkmate

**Conditions**: You need queen on d1 or h5, knight on f3 (going to g5), and no piece defending h7.

## Piece Coordination in Attack

Your attacking pieces must work together:

- Queen and bishop on the same diagonal = devastating battery
- Rook and queen on the same file = overwhelming pressure
- Knight + bishop + queen = classic attacking trio

## When to Sacrifice

Sacrifice when:
- You can calculate a forced win or draw
- The position demands immediate action (your attack will run out of steam)
- The resulting position gives overwhelming compensation`,
    exercises: [
      {
        id: "aa-1",
        type: "multiple-choice",
        question: "What is the first prerequisite before launching a kingside attack?",
        options: ["Having more pawns than your opponent", "Having all your pieces developed and your own king safe", "Being ahead in material", "Having a passed pawn"],
        answer: "Having all your pieces developed and your own king safe",
        explanation: "You can't attack effectively with undeveloped pieces — they're not participating! And you can't afford to launch an attack if your own king is exposed. Safety first, then attack.",
      },
      {
        id: "aa-2",
        type: "multiple-choice",
        question: "What is the 'Greek Gift' sacrifice?",
        options: ["Giving up the queen for two rooks", "A bishop sacrifice on h7 to expose and attack the castled king", "Offering a pawn in the opening for initiative", "Sacrificing a rook for a minor piece"],
        answer: "A bishop sacrifice on h7 to expose and attack the castled king",
        explanation: "The Greek Gift (Bxh7+) is a classic attacking sacrifice. The king must take, then faces a devastating queen and knight attack. When the conditions are right, it's often completely winning!",
      },
    ],
  },
  {
    id: "psychology-chess",
    title: "Chess Psychology & Decision Making",
    description: "Master your mind: avoid blunders, manage time pressure, and think like a champion.",
    category: "Strategy",
    difficulty: "Intermediate",
    duration: 16,
    order: 12,
    content: `# Chess Psychology & Decision Making

Chess is not just a battle of calculation — it's a battle of nerves, patience, and psychology.

## The Most Common Cause of Blunders

Blunders don't happen because players don't know tactics. They happen because of **psychological mistakes**:

- **Laziness**: "I'll check quickly" — never works
- **Optimism**: "My opponent won't see it" — they will
- **Pattern blindness**: Assuming the position hasn't changed
- **Time pressure**: Moving too fast to avoid clock trouble

## The Candidate Moves Method

Developed by grandmaster Alexander Kotov, this method structures your thinking:

1. **Identify candidate moves** — list all plausible moves (usually 2–4)
2. **Analyze each one** — calculate the consequences
3. **Select the best** — based on your analysis, not intuition

> "Never start calculating until you know what you're calculating." — Kotov

## Blunder Prevention

The **Blunder Check**: Before making any move, ask:

1. Does my move leave any piece hanging (undefended)?
2. Does my move create a weakness in my position?
3. Am I missing an obvious opponent threat?
4. Have I verified my calculation?

## Time Management

- **Don't think too long early**: Opening moves are usually known
- **Save time for critical positions**: Complicated middlegame decisions deserve long think
- **Never play in severe time trouble without checking**: One blunder loses the game

## Handling Pressure

When your position is difficult:

- **Don't panic** — create practical problems for your opponent
- **Look for tricks** — a worse position can still have tactical resources
- **Trade into a drawable endgame** when possible

When your position is winning:

- **Don't rush** — winning positions require accurate technique
- **Simplify** — trade pieces when it converts the advantage
- **Beware of getting greedy** — don't reach for extra material if it risks the win

## The Pre-Move Ritual

Top players develop a consistent thought process they apply to every move:

1. What did my opponent just do? Any threats?
2. What are my candidate moves?
3. What is the best move?
4. Blunder check — any tactical issues?
5. Play the move with confidence`,
    exercises: [
      {
        id: "pc-1",
        type: "multiple-choice",
        question: "What is the most common psychological cause of blunders?",
        options: ["Not knowing enough tactics", "Moving too fast without checking — laziness and time pressure", "Playing too many games", "Studying the wrong openings"],
        answer: "Moving too fast without checking — laziness and time pressure",
        explanation: "Most blunders aren't caused by lack of knowledge — they happen when players rush without properly checking their moves. 'One more look' before playing can save the game!",
      },
      {
        id: "pc-2",
        type: "multiple-choice",
        question: "What should you ask yourself before every move (the blunder check)?",
        options: ["Is this the best move ever played?", "Am I leaving any pieces hanging or missing any opponent threats?", "Would Magnus Carlsen play this?", "Is this move faster than alternative moves?"],
        answer: "Am I leaving any pieces hanging or missing any opponent threats?",
        explanation: "The blunder check: before playing, ask — does my move leave a piece en prise? Does it create a weakness? Am I missing an opponent's threat? This simple habit prevents the majority of game-losing mistakes.",
      },
    ],
  },
  {
    id: "bishop-pair-advantage",
    title: "The Bishop Pair Advantage",
    description: "Understand why two bishops dominate knights in open positions and how to exploit this powerful imbalance.",
    category: "Strategy",
    difficulty: "Intermediate",
    duration: 18,
    order: 13,
    content: `# The Bishop Pair Advantage

Having both bishops — controlling both the light and dark squares — is one of the most powerful long-term advantages in chess.

## Why Two Bishops Beat Two Knights

In **open positions**:
- Bishops operate on long diagonals and control huge areas of the board
- Two bishops together cover ALL squares — light AND dark
- Rooks and bishops cooperate naturally on open files and diagonals
- Bishops improve automatically as the position opens

In **closed positions**:
- Knights can jump over pawns and access all squares
- The bishop pair advantage is reduced or eliminated
- Knights on strong outposts can equal or surpass bishops

## How to Get the Bishop Pair

1. **Force your opponent to trade bishop for knight**: Create threats that require the opponent's bishop to capture your knight
2. **Open the position**: After getting the bishop pair, open lines with pawn breaks

## How to Use the Bishop Pair

### Step 1: Prevent opponent's counterplay
Keep the position stable while you improve your bishops.

### Step 2: Open the Position
Use pawn breaks (d5, e5, f4) to open lines and activate your bishops.

### Step 3: Coordinate Your Bishops
Place bishops on adjacent diagonals that control the same area:
- Light-squared bishop on c4 + dark-squared bishop on g5 = devastating battery

### Step 4: Advance Passed Pawns
Bishops escort passed pawns to promotion in endgames far more effectively than knights.

## The "Bad" Bishop Trap

Watch out for your own bishops becoming **bad bishops** — blocked by your own pawns on the same color squares. Always think about:

- Which color are my pawns? Are my bishops blocked by them?
- Can I trade a bad bishop for a good knight or enemy good bishop?

## Key Rule

> "Always try to keep both bishops if possible. The bishop pair is worth more than 3 points in an open position — sometimes much more." — Nimzowitsch`,
    exercises: [
      {
        id: "bp-1",
        type: "multiple-choice",
        question: "In what type of position does the bishop pair shine most?",
        options: ["Closed positions with many locked pawns", "Open positions with long diagonals and few center pawns", "Endgames with only pawns", "Positions with all rooks on the board"],
        answer: "Open positions with long diagonals and few center pawns",
        explanation: "Two bishops are most powerful in open positions! Long diagonals, open files, and space give the bishops maximum mobility. In closed positions with locked pawns, knights can jump over them and become equally or more powerful.",
      },
      {
        id: "bp-2",
        type: "multiple-choice",
        question: "What is a 'bad bishop'?",
        options: ["A bishop that has been captured", "A bishop whose movement is severely restricted by its own pawns on the same color squares", "A bishop on the edge of the board", "A bishop that has moved more than 5 times"],
        answer: "A bishop whose movement is severely restricted by its own pawns on the same color squares",
        explanation: "A bad bishop is blocked by its own pawns! If your pawns are on light squares and your bishop is also light-squared, it has very few targets and squares to go to. Avoid creating bad bishops — or trade them for the opponent's good pieces.",
      },
    ],
  },
  {
    id: "calculation-visualization",
    title: "Calculation & Visualization",
    description: "Train your inner eye: learn how grandmasters calculate variations and visualize moves ahead.",
    category: "Tactics",
    difficulty: "Intermediate",
    duration: 20,
    order: 14,
    content: `# Calculation & Visualization in Chess

The ability to calculate accurately and visualize positions in your head is what separates club players from masters.

## What is Calculation?

Calculation is the process of mentally working through a sequence of moves and their consequences **without moving the pieces**. It answers the question: "If I play A, my opponent plays B, I play C... what happens?"

## The Three Pillars of Calculation

### 1. Candidate Moves
Before calculating deeply, **identify your candidate moves** — the moves worth considering. Usually 2–4 moves are candidates. Calculating every possible move is inefficient and impossible.

> "First identify, then calculate." — Dvoretsky

**How to find candidates:**
- What threats can I make (checks, captures, attacks)?
- What is the most forcing move available?
- What prophylactic moves prevent my opponent's plans?

### 2. Tree of Analysis
Think of your calculation as a **tree**: each branch is a line of play, each fork is where you choose.

- **Trunk**: Main line (most likely continuation)
- **Branches**: Alternative moves for both sides
- **Leaves**: Terminal positions where you evaluate

**Don't calculate everything** — prune branches that are clearly bad.

### 3. Evaluation
At the end of each calculated line, you must **evaluate the resulting position**:
- Who has more material?
- Who has the better king safety?
- Who has more active pieces?
- Is it a winning position, drawing, or losing?

## Visualization: The Inner Board

Visualization means seeing positions **in your mind without looking at the board**. This is the most trainable chess skill.

### Training Visualization

1. **Blindfold simple positions**: Cover the board after move 5 and continue
2. **Solve tactics without touching pieces**: Force yourself to see the solution mentally
3. **Replay master games from memory**: Try to visualize the next position before looking

### Common Visualization Errors

- **Forgetting piece positions**: Lost track of where a piece went after 4 moves
- **Phantom pieces**: Thinking a piece is still there after it was captured
- **Wrong color squares**: Misremembering which diagonal the bishop is on

## The Checks, Captures, Threats Method

When it's your turn, always scan in this order:

1. **Checks**: What checks are available? (most forcing)
2. **Captures**: What can be captured? (winning material)
3. **Threats**: What threats can be made? (positional pressure)

This ensures you never miss a tactical opportunity.

## Practical Tips

- **Concrete over abstract**: Always verify your intuition with concrete calculation
- **Check your own moves**: Before playing, verify you're not hanging material
- **One move at a time**: Don't rush — methodically work through each variation
- **Horizon effect**: Calculate beyond "quiet" positions — your instinct may be wrong about what's quiet`,
    exercises: [
      {
        id: "cv-1",
        type: "multiple-choice",
        question: "What are 'candidate moves' in chess calculation?",
        options: ["All possible legal moves in a position", "The 2-4 most promising moves worth calculating deeply", "Moves suggested by a computer engine", "Moves played in famous games"],
        answer: "The 2-4 most promising moves worth calculating deeply",
        explanation: "Candidate moves are the plausible options you identify BEFORE calculating deeply. Since you can't calculate everything, you first shortlist the most promising moves — checks, captures, and key threats — then analyze those thoroughly.",
      },
      {
        id: "cv-2",
        type: "multiple-choice",
        question: "In the 'Checks, Captures, Threats' scanning method, why do you look at checks first?",
        options: ["Checks are always winning moves", "Checks force the opponent to respond, making them the most forcing moves", "Checks are easiest to calculate", "Checks gain the most material"],
        answer: "Checks force the opponent to respond, making them the most forcing moves",
        explanation: "Checks must be answered — the opponent can't ignore them. This reduces their options dramatically, making them easier to calculate. A forcing sequence (check, check, checkmate) is the dream scenario!",
      },
      {
        id: "cv-3",
        type: "multiple-choice",
        question: "What is the 'horizon effect' in chess calculation?",
        options: ["Calculating too many moves ahead", "Stopping calculation at a deceptively quiet position that actually has more tactics", "The limit of the chessboard's horizon", "Playing moves quickly to save clock time"],
        answer: "Stopping calculation at a deceptively quiet position that actually has more tactics",
        explanation: "The horizon effect happens when you stop calculating at a position that LOOKS quiet but actually contains more tactics. For example, you calculate a sequence and evaluate the resulting position as 'equal' — but your opponent has a brilliant tactic waiting.",
      },
    ],
  },
  {
    id: "pawn-breaks",
    title: "Pawn Breaks & Structural Warfare",
    description: "Discover how pawn breaks open the game, transform structures, and decide battles before a single piece fires.",
    category: "Strategy",
    difficulty: "Intermediate",
    duration: 19,
    order: 15,
    content: `# Pawn Breaks & Structural Warfare

In chess, **pawn structure** determines the character of the game. Pawn breaks transform that structure — they are the key strategic decisions that unlock or lock positions.

## What is a Pawn Break?

A pawn break is when a pawn **advances to challenge or capture an opposing pawn**, changing the pawn structure fundamentally.

**Examples:**
- ...c5 breaking against d4 in the French Defense
- d5 in the King's Indian to undermine White's e4 pawn
- f5 in the Dragon Sicilian to open lines toward White's king

## Types of Pawn Breaks

### Central Breaks
Breaks in the center (d4, d5, e4, e5) are most powerful — they open lines for all pieces.

**Example:** In the Sicilian, Black's ...d5 break challenges White's central dominance.

### Flank Breaks
Breaks on the wings (a5, b5, f5, h5) create counterplay and attack weaknesses.

**Example:** In the King's Indian, Black's ...f5 starts a kingside attack.

### The Minority Attack
White has 2 queenside pawns vs Black's 3. White plays b4-b5-bxc6 to create a backward pawn on c6 or double pawns.

## Evaluating Pawn Breaks

Before executing a pawn break, ask:
1. **Does it open lines for my pieces or my opponent's?**
2. **Does it create weaknesses in my position?**
3. **Is the timing right?** (All pieces should be ready to exploit the opening)
4. **What are the resulting pawn structures?**

## Key Pawn Structures

### Isolated Queen's Pawn (IQP)
A pawn with no neighboring friendly pawns (e.g., d5 pawn with no c or e pawns).

**Advantages:** Open c and e files; active piece play; space in front.
**Disadvantages:** The pawn itself can become a weakness in the endgame.

### Doubled Pawns
Two pawns on the same file (e.g., c3 and c4 both White pawns).

**Disadvantages:** Cannot defend each other; endgame weakness.
**Sometimes OK:** Doubled pawns on the c-file often give open b-file for the rook.

### Passed Pawn
A pawn with no opposing pawns blocking it or on adjacent files.

> "A passed pawn is a criminal who should be kept under lock and key." — Nimzowitsch

**Strategy:** Support it with your king and rook. The opponent must dedicate material to blockade it.

### Backward Pawn
A pawn behind all neighboring friendly pawns that cannot advance without being captured.

**Why it's weak:** The square in front (e.g., d6 with no c6 or e6) becomes a permanent outpost for the opponent's pieces.

## The Art of Pawn Play

1. **Identify your pawn breaks** before the game gets complicated
2. **Prepare the break** — make sure your pieces are placed to exploit it
3. **Execute at the right moment** — timing is everything
4. **Follow up** — after the break, activate your rooks on the newly opened files`,
    exercises: [
      {
        id: "pb-1",
        type: "multiple-choice",
        question: "What is a 'passed pawn'?",
        options: ["A pawn that has already been promoted", "A pawn with no opposing pawns in front of it or on adjacent files", "A pawn that passed the center line", "A pawn that has moved twice"],
        answer: "A pawn with no opposing pawns in front of it or on adjacent files",
        explanation: "A passed pawn faces no pawn opposition on its file or the two adjacent files. It can march toward promotion with only pieces to stop it — making it enormously powerful in endgames!",
      },
      {
        id: "pb-2",
        type: "multiple-choice",
        question: "What is a 'backward pawn' and why is it weak?",
        options: ["A pawn that retreated backward", "A pawn behind all friendly neighboring pawns that cannot advance safely, leaving its square as an outpost", "A pawn that moved last in the game", "A pawn defending the king from behind"],
        answer: "A pawn behind all friendly neighboring pawns that cannot advance safely, leaving its square as an outpost",
        explanation: "A backward pawn can't advance without being captured, and the square directly in front of it becomes a permanent outpost for enemy pieces. It's a static weakness that the opponent can attack over and over.",
      },
      {
        id: "pb-3",
        type: "multiple-choice",
        question: "Before executing a pawn break, which question is MOST important to ask?",
        options: ["How many squares does the pawn advance?", "Does it open lines for my pieces or my opponent's?", "Will my opponent be surprised?", "Is it the center or a flank break?"],
        answer: "Does it open lines for my pieces or my opponent's?",
        explanation: "A pawn break always opens lines — the key is whether YOU benefit more than your opponent. Open the game when your pieces are better placed and your king is safer. Open too early and you might just be helping your opponent attack!",
      },
    ],
  },
  {
    id: "knight-maneuvers",
    title: "Knight Maneuvers & Outposts",
    description: "Master the knight's mysterious movement — learn to route it to dominant outposts that decide games.",
    category: "Strategy",
    difficulty: "Advanced",
    duration: 21,
    order: 16,
    content: `# Knight Maneuvers & Outposts

The knight is chess's most unique piece — it leaps over everything, changes color on every move, and can reach any square given enough time. Understanding how to maneuver knights is a hallmark of strategic mastery.

## Why Knights Are Special

Unlike bishops, knights can reach **every square** on the board — regardless of color. But they're slow: it takes 2–4 moves to reposition a knight meaningfully.

**Key properties:**
- **Short-range**: Dominates in closed positions where bishops struggle
- **Blockaders**: Perfect for blockading passed pawns (they can't be pushed away)
- **Octopus knights**: A knight on a central outpost attacks 8 squares simultaneously

## The Concept of an Outpost

An **outpost** is a square where a piece (especially a knight) cannot be attacked by enemy pawns. A knight on an outpost is often the strongest piece on the board.

**The ideal outpost:**
- Deep in enemy territory (d5, e5, f5, c5)
- Cannot be attacked by enemy pawns
- Supported by a friendly pawn
- Close to the center (affects more squares)

## How to Create an Outpost

1. **Trade away the enemy's pawn** that would attack the outpost square
   - Example: Force ...cxd5 to eliminate the c-pawn that would attack d4
2. **Support with your own pawn** (e.g., c4 supports d5)
3. **Route the knight** to the outpost with a multi-move maneuver

## Knight Routing Patterns

Knights often take scenic routes to reach their destination. Common maneuvers:

### The "N-e2-d4" route
Knight to e2 → d4 (central outpost) — a classic King's Indian maneuver.

### The "N-a4-c5" route
Knight from a4 to c5 — common in Caro-Kann and similar structures.

### The "N-g3-f5" route
Knight from g3 to f5 — a devastating kingside outpost.

### Retrograde maneuver
Sometimes knights go backward first to reach a better square:
- Nd5 → Ne3 → f5 (retreat to then advance to a better post)

## Closed vs. Open Positions

**Closed positions**: Knights thrive. Pawns block the bishops, but knights jump over them. A knight on d5 in a locked center is worth more than a bishop.

**Open positions**: Bishops dominate. Long diagonals give bishops superior range. Knights can lag behind as the game opens up.

## Famous Octopus Knights

The term "Octopus" describes a knight dominating from a central outpost, attacking many squares:

- **Kramnik's Nd5** in his Petroff games: A legendary blockading knight
- **Petrosian's knights**: The World Champion was famous for his knight outposts
- **Capablanca's technique**: Placing knights on perfect squares, then winning "for free"

## Blockading with Knights

Knights are the **ideal blockaders** of passed pawns. Unlike a bishop, a knight on d4 blockading a d5 pawn:
- Cannot be pushed away by the pawn
- Actively attacks 8 squares from its post
- Can hold the blockade indefinitely

> "A knight on the rim is dim" — the famous rule. Edge knights (a and h files) only attack 4 squares instead of 8.`,
    exercises: [
      {
        id: "km-1",
        type: "multiple-choice",
        question: "What makes a knight 'outpost' so powerful?",
        options: ["The knight can see the whole board from there", "No enemy pawn can attack the square, so the knight stays there permanently", "The knight controls 8 squares from the center", "The knight can promote from an outpost"],
        answer: "No enemy pawn can attack the square, so the knight stays there permanently",
        explanation: "An outpost is strong because it's PERMANENT. A piece on an outpost can sit there forever — the opponent's pawns can never chase it away. Over many moves, this knight exerts constant pressure and often becomes the most powerful piece on the board.",
      },
      {
        id: "km-2",
        type: "multiple-choice",
        question: "In which type of position are knights stronger than bishops?",
        options: ["Open positions with long diagonals", "Closed positions with locked pawn chains", "Endgames with only kings", "Positions with many open files"],
        answer: "Closed positions with locked pawn chains",
        explanation: "In closed positions, pawns block the bishops' diagonals — severely limiting their power. Knights can JUMP over pawns and access any square. A knight on a central outpost in a locked position often completely dominates a bishop.",
      },
      {
        id: "km-3",
        type: "multiple-choice",
        question: "What does 'a knight on the rim is dim' mean?",
        options: ["Edge knights are hard to see", "Knights on the a or h files only attack 4 squares instead of 8, making them much weaker", "Rim knights are stronger because they're safer", "Knights should never move to the edges"],
        answer: "Knights on the a or h files only attack 4 squares instead of 8, making them much weaker",
        explanation: "In the center, a knight attacks up to 8 squares. On the edge (a or h file), it attacks only 4. On the corner, just 2! This is why you should almost never place knights on the edge — they lose half their power.",
      },
    ],
  },
  {
    id: "art-of-defense",
    title: "The Art of Defense",
    description: "Learn to survive and counter-punch — how grandmasters defend desperate positions and turn the tables.",
    category: "Strategy",
    difficulty: "Advanced",
    duration: 22,
    order: 17,
    content: `# The Art of Defense in Chess

Attacking is exhilarating. But **defending** is the true test of chess mastery. The best players in history — Petrosian, Karpov, Carlsen — were all legendary defenders before they became champions.

## Why Defense Is an Art

Anyone can play aggressive moves. Defense requires:
- **Precise calculation** under pressure
- **Psychological calm** when the position looks desperate
- **Creative resource-finding** (unexpected defensive ideas)
- **Endgame technique** to convert difficult saves

## Core Defensive Principles

### 1. Don't Panic
In a difficult position, panic leads to bad moves. Take your time. Assess the position **objectively**:
- Which pieces are the real attackers?
- What is my opponent's concrete threat?
- Do I have time to defend or must I counterattack?

### 2. Eliminate Attackers
The most direct form of defense: **trade off your opponent's attacking pieces**.
- Exchange the most dangerous attacker (the bishop aiming at your king, the attacking rook)
- This doesn't always win material — sometimes it's purely defensive

### 3. Block and Interpose
**Block** attacking lines with your pieces:
- An interposing piece breaks a pin or stops a battery
- A bishop sacrifice on the attack's focal point can defuse the attack

### 4. Create Counterplay
The best defense is often a **counter-threat**:
- While your opponent attacks your king, threaten their queen
- Create a passed pawn that requires their attention
- Force your opponent to defend, breaking the momentum of their attack

> "The best defense is a good counter-attack." — Savielly Tartakower

### 5. Prophylaxis
**Prevent** the attack before it starts:
- Spot your opponent's plan 2–3 moves early
- Make quiet moves that stop the attack without losing tempos

## The Defensive Mindset

### Exchange to Simplify
When defending, **trade pieces** whenever profitable. Fewer pieces = fewer attacking resources = easier defense. This is why Karpov's style was so effective.

### Find Resources in Desperate Positions
Even in "lost" positions, look for:
- **Stalemate tricks** (force stalemate to draw)
- **Perpetual check** (force draw by repetition)
- **Fortress** (build a wall your opponent can't break)
- **Tactical shot** that was overlooked by the attacker

## Famous Defensive Concepts

### The Fortress
A defensive setup where the weaker side builds a wall that cannot be broken — achieving a draw with less material.

**Classic example**: Rook + bishop vs rook. With correct play, the defending side builds a fortress that's drawn.

### Zwischenzug Defense
Insert a counter-threat BEFORE defending:
- Opponent attacks your queen
- Instead of moving the queen, deliver check (zwischenzug)
- Then move the queen with tempo

### King Activation
In endgames, **an active king is the best defensive tool**. Don't let your king hide — march it toward the action.

## Petrosian's Prophylaxis

Tigran Petrosian (World Champion 1963–69) was the greatest defensive player in history. His method:
1. **Identify the opponent's plan** before they execute it
2. **Make a quiet prophylactic move** that eliminates the plan
3. The opponent is left with nothing — and slowly suffocates

Carlsen uses similar methods — he wins by **reducing** the opponent's counterplay until they have no options.`,
    exercises: [
      {
        id: "ad-1",
        type: "multiple-choice",
        question: "What is 'prophylaxis' in chess defense?",
        options: ["Attacking before being attacked", "Preventing the opponent's plan before they can execute it", "Exchanging all pieces for a draw", "Moving your king to safety"],
        answer: "Preventing the opponent's plan before they can execute it",
        explanation: "Prophylaxis means anticipating and neutralizing your opponent's plans BEFORE they happen. Instead of reacting to threats, you foresee them and stop them preemptively. It's the most elegant form of chess — making your opponent's plans impossible.",
      },
      {
        id: "ad-2",
        type: "multiple-choice",
        question: "When defending a difficult position, what is often the most effective strategy?",
        options: ["Try to trade all pieces for a draw", "Create counter-threats to distract your opponent from their attack", "Move your king to the corner", "Exchange your active pieces for passive ones"],
        answer: "Create counter-threats to distract your opponent from their attack",
        explanation: "Counter-threats are the most active and effective form of defense! If your opponent must respond to YOUR threats, they lose the initiative. This is why Tal's 'attack to defend' philosophy worked — the best defense is making your opponent defend.",
      },
      {
        id: "ad-3",
        type: "multiple-choice",
        question: "What is a 'fortress' in endgame defense?",
        options: ["A defensive setup near the king", "An impenetrable defensive position that forces a draw even with less material", "A formation with three pawns protecting the king", "The castled king position"],
        answer: "An impenetrable defensive position that forces a draw even with less material",
        explanation: "A fortress is a specific defensive configuration that cannot be broken. The defending side accepts being materially down but builds a wall — a 'fort' — that the opponent simply cannot penetrate. It's one of chess's most ingenious concepts!",
      },
    ],
  },
  {
    id: "queen-pawn-endgames",
    title: "Queen & Pawn Endgames",
    description: "Master the most complex endgames: queen vs pawn, opposition, triangulation, and the key pawn endgame techniques.",
    category: "Endgame",
    difficulty: "Advanced",
    duration: 25,
    order: 18,
    content: `# Queen & Pawn Endgames

Pawn endgames are deceptively simple-looking but require absolute precision. Queen endgames are chaotic and full of perpetual check resources. Together, they form the foundation of endgame mastery.

## Pawn Endgame Fundamentals

### The Opposition
When two kings face each other with one square between them, the player NOT to move "has the opposition."

**Importance:** The king with the opposition can advance; the opposing king must yield.

**Example:** White king on e3, Black king on e5. It's White's turn — Black has the opposition. White cannot advance directly.

### Types of Opposition

- **Direct opposition**: Kings on same file/rank, one square apart
- **Distant opposition**: Kings on same file/rank, three or five squares apart
- **Diagonal opposition**: Kings on same diagonal with one square between

### Key Pawn Endgame Rule
**King + Pawn vs King**: This is fundamental to know.

The result depends on the pawn's file and how advanced the defending king is:
- **Center pawns (d, e)**: Usually winning if your king leads the pawn by one step (Ke6 with pawn on e5)
- **Rook pawns (a, h)**: Often draw — the defending king reaches the promotion corner

### The Square of the Pawn
Draw a diagonal "square" from the pawn's current position to the promotion square. If the defending king can enter this square on its move, it catches the pawn — **draw**. If not — **lost**.

## Triangulation

**Triangulation** is a king maneuver to lose a tempo and transfer the opposition to your opponent.

**Method:** The king moves in a triangle (3 moves) instead of directly, arriving at the same square but with your opponent to move (in opposition).

**When to use:** You have the same position but need to be the one NOT to move.

## Queen vs Pawn

**Queen usually wins** — but with one major exception: **Rook pawns (a or h) on the 7th rank with the king nearby**.

### Winning Method (Queen vs Pawn)
1. Bring your king toward the pawn
2. Use the queen to give checks, gradually forcing the defending king to block its own pawn
3. Eventually win the pawn with the king's help

### The Draw Exception
**Queen vs rook/bishop pawn on 7th rank + king on 8th**: The defending king is stuck near the pawn. When the queen checks to win the pawn, the defending king is stalemated! Draw!

## Critical Pawn Endgame Positions

### Lucena's Rule
**"King in front of the pawn + one extra tempo = win"**

If your king is directly in front of your pawn with an extra tempo, you win against correct opposition play.

### Corresponding Squares
In complex king-pawn endgames, each king square "corresponds" to an enemy square — if you occupy your corresponding square, you maintain the opposition.

## Queen Endgame Principles

1. **Activity is everything** — a passive queen vs active queen loses
2. **Perpetual check awareness** — always check if your opponent has perpetual check before making a move
3. **Create passed pawns** — in queen endgames, passed pawns win games
4. **King safety** — even in endgames, the king can be checkmated!

## Key Rule

> "In pawn endgames, every tempo is a death sentence." — the precision required is absolute. One inaccuracy often flips the result from win to draw or draw to loss.`,
    exercises: [
      {
        id: "qp-1",
        type: "multiple-choice",
        question: "What is 'the opposition' in king and pawn endgames?",
        options: ["When both kings attack the same pawn", "When two kings face each other with one square between them — the player NOT to move holds the opposition", "When the defending king is ahead of the pawn", "When both kings are on the same file"],
        answer: "When two kings face each other with one square between them — the player NOT to move holds the opposition",
        explanation: "The opposition is when two kings face each other with exactly one square between them. The player who does NOT have to move 'has the opposition' and can advance their king — the other king must yield. It's a fundamental concept for king activity in endgames.",
      },
      {
        id: "qp-2",
        type: "multiple-choice",
        question: "In a queen vs pawn endgame, when is it typically a DRAW?",
        options: ["When the pawn is on the 5th rank", "When the defending king is near a rook or bishop pawn on the 7th rank, causing stalemate tricks", "When the attacking king is far away", "When the queen is on the a-file"],
        answer: "When the defending king is near a rook or bishop pawn on the 7th rank, causing stalemate tricks",
        explanation: "Rook pawns (a or h) on the 7th rank with the defending king nearby create perpetual stalemate tricks! Every time the queen tries to win the pawn with a check, the defending king steps in front of the pawn and is stalemated. It's a famous and important draw exception.",
      },
      {
        id: "qp-3",
        type: "multiple-choice",
        question: "What is 'triangulation' used for in king and pawn endgames?",
        options: ["Moving the king in a triangle pattern to lose a tempo and transfer the opposition to the opponent", "A three-pawn structure in the endgame", "Bringing all three pawns to form a triangle", "A defensive formation for the king"],
        answer: "Moving the king in a triangle pattern to lose a tempo and transfer the opposition to the opponent",
        explanation: "Triangulation is a technique where your king makes a 3-move triangle instead of going directly, arriving at the same square but after an ODD number of moves. This transfers the 'to move' to your opponent, giving you the opposition. It's used when you need your opponent to be the one to 'waste' a tempo.",
      },
    ],
  },
  {
    id: "the-initiative",
    title: "The Initiative & Tempo",
    description: "Learn what it means to have the initiative in chess, how to seize it, and how to convert it into a permanent advantage.",
    category: "Strategy",
    difficulty: "Advanced",
    duration: 20,
    order: 19,
    content: `# The Initiative & Tempo in Chess

The **initiative** is one of the most important — and most misunderstood — concepts in chess. It's not a material advantage or a positional one: it's the right to dictate the course of the game.

## What Is the Initiative?

The player with the **initiative** is the one making threats. The opponent is forced to react and defend, while the active player chooses their plan.

> "He who attacks must keep attacking." — Tarrasch

When you have the initiative, your moves are **forcing** — your opponent must respond to them. When you lose the initiative, your opponent gets to threaten and you must react.

## What Is Tempo?

A **tempo** is a single move. To "gain a tempo" means to make a useful move while forcing your opponent to waste theirs. To "lose a tempo" is to waste a move.

**Examples of gaining tempos:**
- Developing a piece while attacking an enemy piece (they must move it)
- Creating a discovered attack (opponent must respond to two threats at once)
- Delivering check (opponent must deal with it)

**Examples of losing tempos:**
- Moving the same piece twice in the opening without reason
- Making passive, non-threatening moves
- Retreating pieces that could have been placed correctly the first time

## How to Seize the Initiative

### 1. Play Forcing Moves
Checks, captures, and threats force your opponent to react. Each forcing move is a gain of initiative.

### 2. Keep Your Opponent on the Back Foot
After each forcing move, find the next one. Don't give your opponent breathing room to develop their own plan.

### 3. Control Space
More space = more moves available = easier to create threats. The side with more space naturally tends to have the initiative.

### 4. Open Lines When Ahead in Development
If you're more developed than your opponent, open the position! Open lines benefit the side whose pieces are more active.

## Converting the Initiative

The initiative is not permanent — it must be converted into something concrete:
- **Material gain**: Use forcing moves to win a pawn or piece
- **Positional advantage**: Gain a permanent structural plus (passed pawn, outpost)
- **Checkmate attack**: Turn the initiative into a direct attack on the king

## Sacrificing for the Initiative

Sometimes it's worth giving up material to seize or maintain the initiative:
- **Exchange sacrifice** (Rook for Bishop or Knight): Active rook for passive piece position
- **Pawn sacrifice**: Open a file or diagonal for active pieces
- **The Immortal Game**: Anderssen sacrificed queen and both rooks for the initiative — and won!

## Losing the Initiative

Watch out for these initiative-killers:
- **Premature piece exchanges**: Trading pieces often favors the defender
- **Unnecessary pawn moves**: Each pawn move weakens squares
- **Passive moves**: Retreating or shuffling pieces gives your opponent time to consolidate`,
    exercises: [
      {
        id: "it-1",
        type: "multiple-choice",
        question: "What does it mean to 'have the initiative' in chess?",
        options: ["Having more material on the board", "Being the player making threats, forcing the opponent to react", "Having the first move in the game", "Controlling the center with pawns"],
        answer: "Being the player making threats, forcing the opponent to react",
        explanation: "The initiative means YOU dictate the game — your opponent is reacting to YOUR threats rather than pursuing their own plans. It's about activity and forcing moves, not necessarily material or positional advantage.",
      },
      {
        id: "it-2",
        type: "multiple-choice",
        question: "When you are MORE developed than your opponent in the opening, what is the right strategy?",
        options: ["Play quietly and wait for your opponent to catch up", "Open the position immediately to activate your pieces", "Trade all pieces to simplify", "Push your king's pawn to attack"],
        answer: "Open the position immediately to activate your pieces",
        explanation: "A lead in development is temporary — your opponent will catch up if you give them time. Open the position with a pawn break or sacrifice to activate your pieces NOW, before the advantage evaporates. Open lines favor the more developed side!",
      },
      {
        id: "it-3",
        type: "multiple-choice",
        question: "What must you ultimately do with the initiative to win the game?",
        options: ["Keep making threats indefinitely", "Convert it into a concrete advantage: material, positional, or a mating attack", "Trade all pieces into a winning endgame", "Only use it in the opening"],
        answer: "Convert it into a concrete advantage: material, positional, or a mating attack",
        explanation: "The initiative is a dynamic, temporary advantage — it must be converted before it evaporates. You either win material, gain a permanent positional plus (passed pawn, weak squares), or launch a decisive attack. An initiative that leads to nothing concrete is wasted.",
      },
    ],
  },
  {
    id: "positional-sacrifices",
    title: "Positional Sacrifices & Long-Term Compensation",
    description: "Discover the art of giving up material for lasting positional advantages — the hallmark of elite strategic chess.",
    category: "Strategy",
    difficulty: "Advanced",
    duration: 23,
    order: 20,
    content: `# Positional Sacrifices in Chess

A **positional sacrifice** is giving up material (a pawn, exchange, or even a piece) not for an immediate tactical refund, but for **long-term positional advantages** that gradually build into a winning edge.

This is among the most advanced and beautiful chess concepts — it separates grandmasters from club players.

## Types of Positional Sacrifices

### The Exchange Sacrifice
Giving a rook for a bishop or knight in exchange for:
- A dominant knight on an outpost
- Open files for the opponent that you can control better
- Elimination of a key defensive piece
- A passed pawn that becomes unstoppable

**Example**: Petrosian's exchange sacrifices — he routinely gave up rooks for knights to create unassailable positions.

### The Pawn Sacrifice
Giving a pawn for:
- Open files or diagonals for your pieces
- Eliminating a strong enemy piece (like Nimzo-Indian: ...Bxc3 doubling White's pawns)
- Seizing a tempo advantage (gambits in the opening)
- Creating a permanent structural weakness in the opponent's camp

### The Piece Sacrifice
Giving a knight or bishop for:
- A devastating attack on the king (Tal-style sacrifices)
- Three pawns and a mobile pawn mass
- Permanent initiative that proves sufficient compensation

## Evaluating Compensation

The hardest part of positional sacrifices: **how do you know if the compensation is enough?**

Ask these questions:
1. **Will my active pieces compensate for the lost material?**
2. **Is the positional advantage permanent or temporary?**
3. **Can the opponent consolidate and neutralize my initiative?**
4. **Will this lead to a better endgame despite being down material?**

## Famous Positional Sacrifices

### Mikhail Tal — The Magician from Riga
Tal would sacrifice pieces with no immediate refutation, creating positions so complex that even perfect play couldn't find the defense. His 1960 World Championship match vs Botvinnik is full of examples.

### Tigran Petrosian — Exchange Sacrifices
Petrosian (World Champion 1963–69) was a master of exchange sacrifices. He'd give a rook for a knight whenever it created a dominant, unbreakable position.

### Robert James Fischer
Fischer's "exchange sacrifice" in the famous game vs Spassky (Game 6, 1972) — Bh6 and Nxe5 — stands as one of the most famous games ever played.

## When to Sacrifice Positionally

The right conditions for a positional sacrifice:
- **Your pieces will be far more active** after the sacrifice
- **The opponent's pieces are passive or restricted**
- **A permanent weakness** (outpost, passed pawn, weak king) is created
- **The endgame favors you** despite material deficit
- **Your intuition and calculation agree** — rare, but when they do, trust it

## The "Intangibles"

Some sacrifices are based on intangible factors:
- **Activity**: Your two bishops and open position vs their rook and restricted pieces
- **Initiative**: Your attack is so strong that material is irrelevant
- **Structural**: Passed pawn that queens before they can exploit the extra material
- **King safety**: Their king is exposed — the sacrifice opens the position at the right moment`,
    exercises: [
      {
        id: "ps-ex-1",
        type: "multiple-choice",
        question: "What is an 'exchange sacrifice' in chess?",
        options: ["Sacrificing the queen for two rooks", "Giving a rook for a bishop or knight in exchange for lasting positional compensation", "Swapping all pieces to reach a drawn endgame", "Offering a pawn in the opening"],
        answer: "Giving a rook for a bishop or knight in exchange for lasting positional compensation",
        explanation: "An exchange sacrifice means deliberately giving up a rook (worth ~5 pts) for a bishop or knight (worth ~3 pts) to gain positional advantages — a dominant outpost, active pieces, or structural compensation — that make the material deficit worthwhile in the long run.",
      },
      {
        id: "ps-ex-2",
        type: "multiple-choice",
        question: "Which World Champion was famous for exchange sacrifices to create unbreakable positions?",
        options: ["Garry Kasparov", "Mikhail Tal", "Tigran Petrosian", "Bobby Fischer"],
        answer: "Tigran Petrosian",
        explanation: "Petrosian (World Champion 1963–69) was the undisputed master of the exchange sacrifice. He'd give a rook for a knight whenever it created a completely dominant, unassailable position. His style was so positionally profound that his opponents rarely realized they were being ground down.",
      },
      {
        id: "ps-ex-3",
        type: "multiple-choice",
        question: "What is the MOST important question to ask before making a positional sacrifice?",
        options: ["How many points of material am I giving up?", "Will my active pieces and positional advantages outweigh the lost material in the long run?", "Will my opponent be surprised?", "Is there an immediate tactical refutation?"],
        answer: "Will my active pieces and positional advantages outweigh the lost material in the long run?",
        explanation: "Material is just a number — what matters is whether your compensation is REAL and LASTING. Concrete compensation: a dominant piece that can never be dislodged, a permanent structural weakness, or a passed pawn. If the positional factors are strong enough, material is irrelevant.",
      },
    ],
  },
];

router.get("/", (_req, res) => {
  res.json(LESSONS);
});

router.get("/:id", (req, res) => {
  const lesson = LESSONS.find((l) => l.id === req.params.id);
  if (!lesson) {
    res.status(404).json({ error: "Lesson not found" });
    return;
  }
  res.json(lesson);
});

export default router;
