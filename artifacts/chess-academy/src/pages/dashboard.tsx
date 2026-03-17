import { useUser } from "@/hooks/use-auth";
import { useProgress, useLessons, useOpenings } from "@/hooks/use-chess";
import { Link, Redirect } from "wouter";
import { motion } from "framer-motion";
import {
  Trophy, Flame, Book, Shield, Activity, Star, ChevronRight,
  Target, Award, PlayCircle, Loader2, TrendingUp, Crown, Lightbulb,
} from "lucide-react";

const AVATAR_COLORS: Record<string, { from: string; to: string }> = {
  gold: { from: "from-yellow-500", to: "to-amber-400" },
  royal: { from: "from-violet-600", to: "to-purple-500" },
  emerald: { from: "from-emerald-500", to: "to-teal-400" },
  crimson: { from: "from-rose-600", to: "to-red-500" },
  ocean: { from: "from-blue-600", to: "to-cyan-500" },
  midnight: { from: "from-slate-700", to: "to-slate-500" },
};

const CHESS_TIPS = [
  "Control the center with pawns or pieces early in the game.",
  "Develop your knights and bishops before moving the queen.",
  "Castle early to keep your king safe and connect your rooks.",
  "Before every move, ask yourself: Is my piece hanging?",
  "A knight on the rim is dim — keep knights near the center.",
  "Rooks belong on open files. Double them if possible.",
  "Trade pieces when you're ahead, keep them when behind.",
  "The pin is one of chess's most powerful tactical motifs.",
  "Always check why your opponent made their last move.",
  "Study endgames — most games are decided there.",
];

const DIFFICULTY_XP: Record<string, number> = {
  Beginner: 50,
  Intermediate: 80,
  Advanced: 120,
};

export default function Dashboard() {
  const { data: user, isLoading: userLoading } = useUser();
  const { data: progress, isLoading: progressLoading } = useProgress();
  const { data: lessons, isLoading: lessonsLoading } = useLessons();
  const { data: openings } = useOpenings();

  if (userLoading || progressLoading || lessonsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) return <Redirect href="/login" />;

  const completedIds = new Set(progress?.completedLessons ?? []);
  const completedOpeningIds = new Set(progress?.completedOpenings ?? []);
  const sortedLessons = lessons ? [...lessons].sort((a, b) => a.order - b.order) : [];
  const completedLessons = sortedLessons.filter((l) => completedIds.has(l.id));
  const nextLesson = sortedLessons.find((l) => !completedIds.has(l.id));
  const totalLessons = sortedLessons.length;
  const completionPct = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;
  const totalXP = completedLessons.reduce((s, l) => s + (DIFFICULTY_XP[l.difficulty] ?? 50), 0);

  const avatarColor = (user as any).avatarColor ?? "gold";
  const colors = AVATAR_COLORS[avatarColor] ?? AVATAR_COLORS["gold"];
  const avatarInitial = (user.displayName || user.username)[0]?.toUpperCase();

  const tipOfDay = CHESS_TIPS[new Date().getDate() % CHESS_TIPS.length];

  const recentLessons = completedLessons.slice(-3).reverse();

  const stats = [
    { icon: Star, label: "Total XP", value: totalXP, color: "text-primary", bg: "bg-primary/10 border-primary/20", suffix: "" },
    { icon: Flame, label: "Day Streak", value: progress?.streak ?? 0, color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/20", suffix: "d" },
    { icon: Book, label: "Lessons", value: `${completedLessons.length}/${totalLessons}`, color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20", suffix: "" },
    { icon: Shield, label: "Openings", value: completedOpeningIds.size, color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20", suffix: "" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Welcome Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl border border-border bg-card overflow-hidden mb-8 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-amber-500/5 pointer-events-none" />
        <div className="relative p-7 sm:p-9">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${colors.from} ${colors.to} flex items-center justify-center text-3xl font-bold text-white shadow-xl ring-4 ring-white/10 shrink-0`}>
              {avatarInitial}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="text-sm text-muted-foreground mb-1">Welcome back,</div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold gold-gradient-text mb-1">{user.displayName || user.username}</h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm text-muted-foreground">
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold">{user.level}</span>
                <span>{user.rating} ELO</span>
                <span>·</span>
                <Link href="/leaderboard" className="text-primary hover:underline flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5" /> View Leaderboard
                </Link>
              </div>
            </div>
            <div className="flex gap-3 shrink-0">
              {nextLesson ? (
                <Link href={`/lessons/${nextLesson.id}`}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">
                  <PlayCircle className="w-4 h-4" /> Continue
                </Link>
              ) : (
                <Link href="/lessons"
                  className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">
                  <Book className="w-4 h-4" /> Lessons
                </Link>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-6 pt-5 border-t border-border/40">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Course Progress</span>
              <span className="font-bold text-primary">{completionPct}% complete</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${completionPct}%` }} transition={{ duration: 1.2, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-primary to-amber-400 rounded-full" />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {completedLessons.length} of {totalLessons} lessons complete
              {nextLesson && <span className="text-primary ml-2">· Next up: {nextLesson.title}</span>}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className={`glass-panel p-5 rounded-2xl border ${s.bg} flex flex-col items-center text-center`}>
            <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}{s.suffix}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left col: Next Lesson + Recent */}
        <div className="lg:col-span-2 space-y-5">

          {/* Next Lesson Card */}
          {nextLesson ? (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
              <Link href={`/lessons/${nextLesson.id}`}>
                <div className="glass-panel rounded-2xl border border-primary/20 p-6 hover:border-primary/40 transition-all group cursor-pointer bg-gradient-to-br from-primary/5 to-transparent">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center shrink-0 group-hover:bg-primary/25 transition-colors">
                      <PlayCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Continue Where You Left Off</div>
                      <h3 className="font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">{nextLesson.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{nextLesson.description}</p>
                      <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                        <span className="px-2 py-0.5 rounded-full bg-secondary font-medium">{nextLesson.category}</span>
                        <span className="px-2 py-0.5 rounded-full bg-secondary font-medium">{nextLesson.difficulty}</span>
                        <span className="text-primary font-bold">+{DIFFICULTY_XP[nextLesson.difficulty] ?? 50} XP</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground/40 group-hover:text-primary transition-colors mt-1 shrink-0" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel rounded-2xl border border-emerald-500/20 p-6 bg-emerald-500/5 text-center">
              <Trophy className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
              <h3 className="font-bold text-lg mb-1">All Lessons Completed!</h3>
              <p className="text-sm text-muted-foreground">You've mastered the entire curriculum. Explore openings next.</p>
              <Link href="/openings" className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-emerald-500/15 text-emerald-400 font-semibold text-sm hover:bg-emerald-500/25 transition-colors">
                <Crown className="w-4 h-4" /> Explore Openings
              </Link>
            </motion.div>
          )}

          {/* Recommended Lessons */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="glass-panel rounded-2xl border border-border/50 p-6">
            <h2 className="font-bold text-base flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" /> Up Next
              <Link href="/lessons" className="ml-auto text-xs text-primary hover:underline font-normal flex items-center gap-1">
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </h2>
            <div className="space-y-2">
              {sortedLessons.filter((l) => !completedIds.has(l.id)).slice(0, 4).map((lesson, i) => (
                <Link key={lesson.id} href={`/lessons/${lesson.id}`}>
                  <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 border border-transparent hover:border-primary/20 transition-all group cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">{lesson.order}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{lesson.title}</p>
                      <p className="text-xs text-muted-foreground">{lesson.category} · {lesson.difficulty}</p>
                    </div>
                    <span className="text-xs font-bold text-primary shrink-0">+{DIFFICULTY_XP[lesson.difficulty] ?? 50} XP</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" />
                  </div>
                </Link>
              ))}
              {sortedLessons.filter((l) => !completedIds.has(l.id)).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">All lessons complete! 🎉</p>
              )}
            </div>
          </motion.div>

          {/* Recent Completions */}
          {recentLessons.length > 0 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}
              className="glass-panel rounded-2xl border border-border/50 p-6">
              <h2 className="font-bold text-base flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-primary" /> Recently Completed
              </h2>
              <div className="space-y-2">
                {recentLessons.map((lesson) => (
                  <Link key={lesson.id} href={`/lessons/${lesson.id}`}>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15 hover:border-emerald-500/30 transition-colors cursor-pointer group">
                      <div className="w-7 h-7 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
                        <span className="text-emerald-400 text-sm">✓</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{lesson.title}</p>
                        <p className="text-xs text-muted-foreground">{lesson.category}</p>
                      </div>
                      <span className="text-xs text-emerald-400 font-bold">+{DIFFICULTY_XP[lesson.difficulty] ?? 50} XP</span>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Right col: Tips + Achievements + Openings */}
        <div className="space-y-5">

          {/* Chess Tip */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="glass-panel rounded-2xl border border-amber-500/20 p-5 bg-amber-500/3">
            <h2 className="font-bold text-sm flex items-center gap-2 mb-3 text-amber-400">
              <Lightbulb className="w-4 h-4" /> Tip of the Day
            </h2>
            <p className="text-sm text-foreground/80 leading-relaxed italic">"{tipOfDay}"</p>
          </motion.div>

          {/* Mini Achievements */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}
            className="glass-panel rounded-2xl border border-border/50 p-5">
            <h2 className="font-bold text-sm flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-primary" /> Achievements
              <Link href="/profile" className="ml-auto text-xs text-primary hover:underline font-normal">View all</Link>
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: "♟", label: "First Step", unlocked: completedLessons.length >= 1 },
                { icon: "🎯", label: "On a Roll", unlocked: completedLessons.length >= 3 },
                { icon: "📖", label: "Scholar", unlocked: completedOpeningIds.size >= 3 },
                { icon: "🔥", label: "Streak", unlocked: (progress?.streak ?? 0) >= 3 },
                { icon: "⭐", label: "Points", unlocked: totalXP >= 200 },
                { icon: "👑", label: "Halfway", unlocked: completionPct >= 50 },
              ].map((a) => (
                <div key={a.label} className={`p-2.5 rounded-xl border text-center ${a.unlocked ? "border-primary/20 bg-primary/5" : "border-border bg-secondary/20 opacity-40 grayscale"}`}>
                  <div className="text-xl mb-0.5">{a.icon}</div>
                  <div className="text-xs text-muted-foreground leading-tight">{a.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick links */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
            className="glass-panel rounded-2xl border border-border/50 p-5">
            <h2 className="font-bold text-sm flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-primary" /> Quick Access
            </h2>
            <div className="space-y-2">
              {[
                { href: "/openings", label: "Browse Openings", icon: Crown, count: openings?.length ?? 0, unit: "openings" },
                { href: "/traps", label: "Learn Traps", icon: Trophy, count: 10, unit: "traps" },
                { href: "/leaderboard", label: "Leaderboard", icon: Star, count: null, unit: "" },
                { href: "/profile", label: "Your Profile", icon: Activity, count: null, unit: "" },
              ].map((item) => (
                <Link key={item.href} href={item.href}>
                  <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/60 border border-transparent hover:border-primary/20 transition-all group cursor-pointer">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <item.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium flex-1">{item.label}</span>
                    {item.count !== null && (
                      <span className="text-xs text-muted-foreground">{item.count} {item.unit}</span>
                    )}
                    <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
