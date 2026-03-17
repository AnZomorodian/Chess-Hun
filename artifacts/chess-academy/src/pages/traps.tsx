import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Loader2, AlertTriangle, ChevronRight, Swords } from "lucide-react";

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
}

const DIFFICULTY_STYLE = {
  Beginner: { label: "Beginner", cls: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30" },
  Intermediate: { cls: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30", label: "Intermediate" },
  Advanced: { cls: "text-red-400 bg-red-400/10 border-red-400/30", label: "Advanced" },
};

const SIDE_STYLE = {
  White: { cls: "text-slate-100 bg-slate-100/10 border-slate-100/20", icon: "♔" },
  Black: { cls: "text-slate-400 bg-slate-400/10 border-slate-400/20", icon: "♚" },
};

export default function Traps() {
  const { data: traps, isLoading } = useQuery({
    queryKey: ["/api/traps"],
    queryFn: async () => {
      const res = await fetch("/api/traps");
      if (!res.ok) throw new Error("Failed to fetch traps");
      return res.json() as Promise<Trap[]>;
    },
  });

  const byDifficulty = {
    Beginner: (traps ?? []).filter((t) => t.difficulty === "Beginner"),
    Intermediate: (traps ?? []).filter((t) => t.difficulty === "Intermediate"),
    Advanced: (traps ?? []).filter((t) => t.difficulty === "Advanced"),
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel mb-5 border border-red-500/20">
          <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
          <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">Tactical Traps</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
          Chess <span className="gold-gradient-text">Traps</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Master these deadly traps to catch your opponents off guard. Each trap exploits a common mistake — learn both how to spring them and how to avoid falling in.
        </p>
        <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 glass-panel px-4 py-2 rounded-full border border-border/50">
            <Swords className="w-4 h-4 text-primary" />
            <span><strong className="text-foreground">{traps?.length ?? 10}</strong> Traps</span>
          </div>
          {Object.entries(byDifficulty).map(([diff, arr]) => (
            <div key={diff} className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium ${DIFFICULTY_STYLE[diff as keyof typeof DIFFICULTY_STYLE]?.cls}`}>
              {diff}: {arr.length}
            </div>
          ))}
        </div>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-12">
          {(["Beginner", "Intermediate", "Advanced"] as const).map((diff) => (
            byDifficulty[diff].length > 0 && (
              <div key={diff}>
                <div className="flex items-center gap-3 mb-5">
                  <div className={`px-3 py-1 rounded-full text-xs font-bold border ${DIFFICULTY_STYLE[diff].cls}`}>{diff}</div>
                  <div className="h-px flex-1 bg-border/50" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {byDifficulty[diff].map((trap, i) => (
                    <motion.div key={trap.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                      <Link href={`/traps/${trap.id}`}>
                        <div className="group glass-panel rounded-2xl p-5 border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer premium-hover">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${DIFFICULTY_STYLE[diff].cls}`}>
                                {diff}
                              </span>
                              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${SIDE_STYLE[trap.side].cls}`}>
                                {SIDE_STYLE[trap.side].icon} {trap.side} plays
                              </span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0 mt-0.5" />
                          </div>
                          <h3 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors mb-1">
                            {trap.name}
                          </h3>
                          <p className="text-xs text-primary/70 font-medium mb-2">{trap.opening}</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">{trap.description}</p>
                          <div className="mt-4 pt-3 border-t border-border/40 flex items-center gap-2">
                            <div className="flex gap-1 flex-wrap">
                              {trap.moves.slice(0, 3).map((m, mi) => (
                                <span key={mi} className="text-xs font-mono bg-secondary/60 text-muted-foreground px-1.5 py-0.5 rounded">
                                  {m.split(" ")[0]}
                                </span>
                              ))}
                              {trap.moves.length > 3 && (
                                <span className="text-xs text-muted-foreground/60">+{trap.moves.length - 3} more</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
}
