import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, AlertTriangle, Lightbulb, Shield, ChevronRight, Swords } from "lucide-react";

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

const DIFFICULTY_STYLE = {
  Beginner: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  Intermediate: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  Advanced: "text-red-400 bg-red-400/10 border-red-400/30",
};

export default function TrapDetail() {
  const { id } = useParams();

  const { data: trap, isLoading } = useQuery({
    queryKey: ["/api/traps", id],
    queryFn: async () => {
      const res = await fetch(`/api/traps/${id}`);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch trap");
      return res.json() as Promise<Trap>;
    },
    enabled: !!id,
  });

  const { data: allTraps } = useQuery({
    queryKey: ["/api/traps"],
    queryFn: async () => {
      const res = await fetch("/api/traps");
      if (!res.ok) throw new Error("Failed to fetch traps");
      return res.json() as Promise<Trap[]>;
    },
  });

  if (isLoading) return (
    <div className="flex justify-center items-center py-32">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  if (!trap) return (
    <div className="text-center py-20 text-xl text-muted-foreground">Trap not found.</div>
  );

  const currentIdx = allTraps?.findIndex((t) => t.id === trap.id) ?? -1;
  const nextTrap = allTraps?.[currentIdx + 1] ?? null;
  const prevTrap = allTraps?.[currentIdx - 1] ?? null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/traps" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors font-medium text-sm">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Traps
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

        {/* Header Card */}
        <div className="glass-panel rounded-3xl p-8 border border-border/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${DIFFICULTY_STYLE[trap.difficulty]}`}>{trap.difficulty}</span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${trap.side === "White" ? "text-slate-100 bg-slate-100/10 border-slate-100/20" : "text-slate-400 bg-slate-400/10 border-slate-400/20"}`}>
              {trap.side === "White" ? "♔" : "♚"} {trap.side} plays
            </span>
            <span className="text-xs font-medium px-3 py-1 rounded-full border border-primary/20 text-primary/70">{trap.opening}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">{trap.name}</h1>
          <p className="text-muted-foreground leading-relaxed">{trap.description}</p>
        </div>

        {/* Move Sequence */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-panel rounded-2xl p-6 border border-border/50">
          <div className="flex items-center gap-2 mb-5">
            <Swords className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">Move Sequence</h2>
          </div>
          <div className="space-y-2">
            {trap.moves.map((move, i) => {
              const isTrap = move.includes(trap.trapMove.split("!")[0].trim()) || move === trap.trapMove;
              return (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.05 }}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-colors
                    ${isTrap ? "bg-primary/10 border border-primary/30" : "bg-secondary/30 border border-transparent"}`}>
                  <span className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">{i + 1}</span>
                  <span className={`font-mono font-medium text-sm ${isTrap ? "text-primary" : "text-foreground"}`}>{move}</span>
                  {isTrap && (
                    <span className="ml-auto text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> The Trap!
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Key Idea */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass-panel rounded-2xl p-6 border border-primary/20 bg-primary/5">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">Key Idea</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">{trap.keyIdea}</p>
        </motion.div>

        {/* How to Avoid */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="glass-panel rounded-2xl p-6 border border-emerald-500/20 bg-emerald-500/5">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h2 className="font-semibold text-foreground">How to Avoid This Trap</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">{trap.avoidance}</p>
        </motion.div>

        {/* Navigation */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="flex gap-4 pt-2">
          {prevTrap && (
            <Link href={`/traps/${prevTrap.id}`} className="flex-1">
              <div className="glass-panel rounded-2xl p-4 border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer text-left">
                <p className="text-xs text-muted-foreground mb-1">← Previous</p>
                <p className="font-semibold text-sm text-foreground">{prevTrap.name}</p>
              </div>
            </Link>
          )}
          {nextTrap && (
            <Link href={`/traps/${nextTrap.id}`} className="flex-1">
              <div className="glass-panel rounded-2xl p-4 border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer text-right">
                <p className="text-xs text-muted-foreground mb-1">Next →</p>
                <p className="font-semibold text-sm text-foreground">{nextTrap.name}</p>
              </div>
            </Link>
          )}
        </motion.div>

      </motion.div>
    </div>
  );
}
