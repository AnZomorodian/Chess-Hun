import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { getAuthHeaders } from "@/hooks/use-auth";
import {
  Trophy, Book, Shield, Star, Flame, Crown, Loader2, Globe,
  ExternalLink, ArrowLeft, Calendar, Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

const COLOR_MAP: Record<string, { from: string; to: string }> = {
  gold: { from: "from-yellow-500", to: "to-amber-400" },
  royal: { from: "from-violet-600", to: "to-purple-500" },
  emerald: { from: "from-emerald-500", to: "to-teal-400" },
  crimson: { from: "from-rose-600", to: "to-red-500" },
  ocean: { from: "from-blue-600", to: "to-cyan-500" },
  midnight: { from: "from-slate-700", to: "to-slate-500" },
};

const LEVEL_COLORS: Record<string, string> = {
  Beginner: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  Intermediate: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  Advanced: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  Expert: "text-red-400 bg-red-400/10 border-red-400/20",
  Master: "text-purple-400 bg-purple-400/10 border-purple-400/20",
};

interface PublicUser {
  id: string;
  username: string;
  displayName: string;
  level: string;
  rating: number;
  avatarColor: string;
  joinedAt: string;
  bio: string;
  country: string;
  favoriteOpening: string;
  preferredSide: string;
  chessAccounts: { platform: string; username: string }[];
  lessonsCompleted: number;
  openingsStudied: number;
  totalPoints: number;
  streak: number;
  isSelf: boolean;
}

export default function PublicProfile() {
  const [, params] = useRoute("/users/:id");
  const userId = params?.id;

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["/api/users", userId],
    queryFn: async () => {
      const res = await fetch(`/api/users/${userId}`, { headers: getAuthHeaders() });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to fetch profile");
      }
      return res.json() as Promise<PublicUser>;
    },
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold mb-2">Profile Not Available</h1>
        <p className="text-muted-foreground mb-6">
          {error?.message === "This user's profile is private"
            ? "This player has set their profile to private."
            : "This player could not be found."}
        </p>
        <Link href="/leaderboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Leaderboard
        </Link>
      </div>
    );
  }

  const avatarColors = COLOR_MAP[profile.avatarColor] ?? COLOR_MAP["gold"];

  const platformUrls: Record<string, string> = {
    "Chess.com": `https://www.chess.com/member/${profile.username}`,
    "Lichess": `https://lichess.org/@/${profile.username}`,
    "ChessKid": `https://www.chesskid.com/member/${profile.username}`,
    "FIDE": `https://ratings.fide.com/search.phtml?search=${profile.username}`,
  };
  const platformColors: Record<string, string> = {
    "Chess.com": "bg-green-500/10 border-green-500/20 text-green-400",
    "Lichess": "bg-blue-500/10 border-blue-500/20 text-blue-400",
    "ChessKid": "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
    "FIDE": "bg-orange-500/10 border-orange-500/20 text-orange-400",
  };

  const stats = [
    { icon: Trophy, label: "ELO Rating", value: profile.rating, color: "text-primary", bg: "bg-primary/10 border-primary/20" },
    { icon: Star, label: "Total XP", value: profile.totalPoints, color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20" },
    { icon: Flame, label: "Day Streak", value: profile.streak, color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/20" },
    { icon: Book, label: "Lessons Done", value: profile.lessonsCompleted, color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
    { icon: Shield, label: "Openings", value: profile.openingsStudied, color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-6 py-8 sm:py-10">
      <Link href="/leaderboard"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Leaderboard
      </Link>

      {profile.isSelf && (
        <div className="mb-4 px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-medium flex items-center gap-2">
          <Crown className="w-4 h-4" /> This is your own profile.
          <Link href="/profile" className="underline ml-1">Edit it here →</Link>
        </div>
      )}

      {/* Header Card */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl border border-border bg-card overflow-hidden mb-6 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-amber-500/5 pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="relative shrink-0">
              <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br ${avatarColors.from} ${avatarColors.to} flex items-center justify-center text-3xl sm:text-4xl font-bold text-white shadow-xl ring-4 ring-white/10`}>
                {profile.displayName[0]?.toUpperCase()}
              </div>
              <div className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full border text-xs font-bold ${LEVEL_COLORS[profile.level] ?? "text-primary bg-primary/10 border-primary/20"}`}>
                {profile.level}
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left min-w-0">
              <h1 className="text-2xl sm:text-3xl font-display font-bold mb-1 bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
                {profile.displayName}
              </h1>
              <p className="text-sm text-muted-foreground mb-3">@{profile.username}</p>

              {profile.bio && (
                <p className="text-sm text-muted-foreground leading-relaxed mb-3 max-w-md">{profile.bio}</p>
              )}

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
                {profile.country && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary border border-border text-muted-foreground">
                    <Globe className="w-3 h-3" /> {profile.country}
                  </span>
                )}
                {profile.favoriteOpening && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">
                    ♞ {profile.favoriteOpening}
                  </span>
                )}
                {profile.preferredSide && profile.preferredSide !== "Both" && (
                  <span className="px-2.5 py-1 rounded-full bg-secondary border border-border text-muted-foreground">
                    {profile.preferredSide === "White" ? "♔ White" : "♚ Black"}
                  </span>
                )}
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary border border-border text-muted-foreground">
                  <Calendar className="w-3 h-3" /> Joined {new Date(profile.joinedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className={`glass-panel p-3 sm:p-4 rounded-2xl border ${s.bg} text-center`}>
            <s.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${s.color} mx-auto mb-1`} />
            <div className={`text-xl sm:text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-muted-foreground leading-tight">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Chess Accounts */}
      {profile.chessAccounts.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-panel rounded-2xl border border-border/50 p-5 sm:p-6 mb-6">
          <h2 className="text-base font-bold mb-4 flex items-center gap-2">♟ Chess Platform Accounts</h2>
          <div className="flex flex-wrap gap-3">
            {profile.chessAccounts.map((acc, i) => {
              const url = (platformUrls[acc.platform] || "#").replace(profile.username, acc.username);
              const colorClass = platformColors[acc.platform] || "bg-secondary/40 border-border text-muted-foreground";
              return (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium text-sm transition-all hover:scale-105 ${colorClass}`}>
                  <span className="font-bold text-xs opacity-70">{acc.platform}</span>
                  <span className="font-mono">{acc.username}</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* No accounts placeholder */}
      {profile.chessAccounts.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="glass-panel rounded-2xl border border-border/50 p-6 text-center text-muted-foreground mb-6">
          <Target className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No chess platform accounts linked yet.</p>
        </motion.div>
      )}
    </div>
  );
}
