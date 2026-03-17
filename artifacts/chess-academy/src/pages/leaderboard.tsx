import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/hooks/use-auth";
import { getAuthHeaders } from "@/hooks/use-auth";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Trophy, Crown, Flame, Book, Star, Shield, Loader2, Medal } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  id: string;
  username: string;
  displayName: string;
  level: string;
  rating: number;
  avatarColor: string;
  lessonsCompleted: number;
  openingsStudied: number;
  totalPoints: number;
  streak: number;
  isCurrentUser: boolean;
}

const COLOR_MAP: Record<string, { from: string; to: string }> = {
  gold: { from: "from-yellow-500", to: "to-amber-400" },
  royal: { from: "from-violet-600", to: "to-purple-500" },
  emerald: { from: "from-emerald-500", to: "to-teal-400" },
  crimson: { from: "from-rose-600", to: "to-red-500" },
  ocean: { from: "from-blue-600", to: "to-cyan-500" },
  midnight: { from: "from-slate-700", to: "to-slate-500" },
};

const LEVEL_COLORS: Record<string, string> = {
  Beginner: "text-emerald-400 bg-emerald-400/10",
  Intermediate: "text-yellow-400 bg-yellow-400/10",
  Advanced: "text-orange-400 bg-orange-400/10",
  Expert: "text-red-400 bg-red-400/10",
  Master: "text-purple-400 bg-purple-400/10",
};

const RANK_STYLES = [
  { bg: "bg-gradient-to-r from-yellow-500/20 to-amber-400/10 border-yellow-500/30", icon: <Trophy className="w-5 h-5 text-yellow-400" />, label: "🥇" },
  { bg: "bg-gradient-to-r from-slate-400/20 to-slate-300/10 border-slate-400/30", icon: <Medal className="w-5 h-5 text-slate-300" />, label: "🥈" },
  { bg: "bg-gradient-to-r from-amber-700/20 to-amber-600/10 border-amber-700/30", icon: <Medal className="w-5 h-5 text-amber-600" />, label: "🥉" },
];

function useLeaderboard() {
  return useQuery({
    queryKey: ["/api/leaderboard"],
    queryFn: async () => {
      const res = await fetch("/api/leaderboard", { headers: getAuthHeaders() });
      if (!res.ok) throw new Error("Failed to fetch leaderboard");
      return res.json() as Promise<{ leaderboard: LeaderboardEntry[] }>;
    },
    staleTime: 30000,
  });
}

export default function Leaderboard() {
  const { data: user } = useUser();
  const { data, isLoading } = useLeaderboard();

  const entries = data?.leaderboard ?? [];
  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);
  const userRank = entries.findIndex((e) => e.isCurrentUser) + 1;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const Avatar = ({ entry, size = "md" }: { entry: LeaderboardEntry; size?: "sm" | "md" | "lg" }) => {
    const c = COLOR_MAP[entry.avatarColor] ?? COLOR_MAP["gold"];
    const sz = size === "lg" ? "w-16 h-16 text-2xl" : size === "md" ? "w-10 h-10 text-base" : "w-8 h-8 text-sm";
    return (
      <div className={`rounded-full bg-gradient-to-br ${c.from} ${c.to} flex items-center justify-center font-bold text-white shrink-0 ${sz}`}>
        {entry.displayName[0]?.toUpperCase()}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-primary/20 mb-4">
          <Trophy className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-primary">Global Rankings</span>
        </div>
        <h1 className="text-4xl font-display font-bold mb-2">
          <span className="gold-gradient-text">Leaderboard</span>
        </h1>
        <p className="text-muted-foreground">Top players ranked by ELO rating</p>
        {user && userRank > 0 && (
          <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold text-sm">
            <Star className="w-4 h-4" /> You are ranked #{userRank}
          </div>
        )}
      </motion.div>

      {/* Top 3 Podium */}
      {top3.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8">
          {[top3[1], top3[0], top3[2]].map((entry, podiumIdx) => {
            if (!entry) return <div key={podiumIdx} />;
            const realIdx = podiumIdx === 0 ? 1 : podiumIdx === 1 ? 0 : 2;
            const heights = ["h-28", "h-36", "h-24"];
            const c = COLOR_MAP[entry.avatarColor] ?? COLOR_MAP["gold"];
            return (
              <div key={entry.id} className="flex flex-col items-center gap-2">
                <div className={cn("w-16 h-16 rounded-full bg-gradient-to-br flex items-center justify-center font-bold text-white text-xl shadow-lg",
                  c.from, c.to, entry.isCurrentUser && "ring-2 ring-white ring-offset-2 ring-offset-background")}>
                  {entry.displayName[0]?.toUpperCase()}
                </div>
                <div className="text-sm font-bold text-center truncate max-w-full px-1">{entry.displayName}</div>
                <div className="text-xs text-primary font-bold">{entry.rating} ELO</div>
                <div className={cn("w-full rounded-t-2xl flex items-center justify-center text-2xl border border-t-0",
                  heights[podiumIdx], RANK_STYLES[realIdx].bg)}>
                  {RANK_STYLES[realIdx].label}
                </div>
              </div>
            );
          })}
        </motion.div>
      )}

      {/* Full Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass-panel rounded-2xl border border-border/50 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[2rem_auto_1fr_repeat(3,_5rem)] gap-3 px-5 py-3 border-b border-border/40 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
          <span>#</span>
          <span className="col-span-1">Player</span>
          <span></span>
          <span className="text-center">ELO</span>
          <span className="text-center hidden sm:block">Lessons</span>
          <span className="text-center hidden sm:block">XP</span>
        </div>

        {/* Top 3 in table */}
        {entries.slice(0, 3).map((entry, i) => (
          <div key={entry.id}
            className={cn("grid grid-cols-[2rem_auto_1fr_repeat(3,_5rem)] gap-3 px-5 py-3 items-center border-b border-border/20 last:border-0 transition-colors",
              entry.isCurrentUser ? "bg-primary/8 hover:bg-primary/12" : "hover:bg-secondary/30",
              i === 0 && "bg-yellow-500/5")}>
            <span className="text-base">{["🥇", "🥈", "🥉"][i]}</span>
            <Avatar entry={entry} size="sm" />
            <div className="min-w-0">
              <div className={cn("font-semibold text-sm truncate", entry.isCurrentUser && "text-primary")}>
                {entry.displayName} {entry.isCurrentUser && <span className="text-xs font-normal text-primary/70">(you)</span>}
              </div>
              <div className="text-xs text-muted-foreground">{entry.level}</div>
            </div>
            <div className="text-center font-bold text-primary text-sm">{entry.rating}</div>
            <div className="text-center text-sm text-muted-foreground hidden sm:block">{entry.lessonsCompleted}</div>
            <div className="text-center text-sm text-muted-foreground hidden sm:block">{entry.totalPoints}</div>
          </div>
        ))}

        {/* Rest */}
        {rest.map((entry, i) => (
          <div key={entry.id}
            className={cn("grid grid-cols-[2rem_auto_1fr_repeat(3,_5rem)] gap-3 px-5 py-3 items-center border-b border-border/20 last:border-0 transition-colors",
              entry.isCurrentUser ? "bg-primary/8 hover:bg-primary/12" : "hover:bg-secondary/30")}>
            <span className="text-sm text-muted-foreground font-mono">{i + 4}</span>
            <Avatar entry={entry} size="sm" />
            <div className="min-w-0">
              <div className={cn("font-semibold text-sm truncate", entry.isCurrentUser && "text-primary")}>
                {entry.displayName} {entry.isCurrentUser && <span className="text-xs font-normal text-primary/70">(you)</span>}
              </div>
              <div className="text-xs text-muted-foreground">{entry.level}</div>
            </div>
            <div className="text-center font-bold text-sm">{entry.rating}</div>
            <div className="text-center text-sm text-muted-foreground hidden sm:block">{entry.lessonsCompleted}</div>
            <div className="text-center text-sm text-muted-foreground hidden sm:block">{entry.totalPoints}</div>
          </div>
        ))}

        {entries.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Crown className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No players yet. Be the first to register!</p>
            <Link href="/register" className="text-primary font-medium hover:underline mt-2 inline-block">Create account →</Link>
          </div>
        )}
      </motion.div>

      {!user && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="text-center mt-8 glass-panel rounded-2xl border border-primary/20 p-6">
          <p className="text-muted-foreground mb-3">Join Chess Academy to compete on the leaderboard</p>
          <Link href="/register"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all">
            <Trophy className="w-4 h-4" /> Start Competing
          </Link>
        </motion.div>
      )}
    </div>
  );
}
