import { useUser, useAuthStore } from "@/hooks/use-auth";
import { useProgress, useLessons, useOpenings } from "@/hooks/use-chess";
import { Link, Redirect, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  Trophy, Flame, Book, Shield, Star, Crown, Edit3, Check, X,
  LogOut, Calendar, Target, Award, TrendingUp, Loader2, ChevronRight
} from "lucide-react";
import { useState } from "react";

export default function Profile() {
  const { data: user, isLoading: userLoading } = useUser();
  const { data: progress, isLoading: progressLoading } = useProgress();
  const { data: lessons } = useLessons();
  const { data: openings } = useOpenings();
  const logout = useAuthStore((s) => s.logout);
  const [, setLocation] = useLocation();

  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState("");

  if (userLoading || progressLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Redirect href="/login" />;

  const completedLessons = lessons?.filter((l) =>
    progress?.completedLessons?.includes(l.id)
  ) ?? [];
  const completedOpenings = openings?.filter((o) =>
    progress?.completedOpenings?.includes(o.id)
  ) ?? [];

  const totalLessons = lessons?.length ?? 1;
  const completionPct = Math.round((completedLessons.length / totalLessons) * 100);

  const avatarInitial = (user.displayName || user.username)?.[0]?.toUpperCase() ?? "?";

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  const levelColors: Record<string, string> = {
    Beginner: "text-green-400 bg-green-400/10 border-green-400/20",
    Intermediate: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    Advanced: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    Expert: "text-red-400 bg-red-400/10 border-red-400/20",
    Master: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  };

  const stats = [
    { icon: Star, label: "Total Points", value: progress?.totalPoints ?? 0, color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { icon: Flame, label: "Day Streak", value: progress?.streak ?? 0, color: "text-orange-400", bg: "bg-orange-400/10" },
    { icon: Book, label: "Lessons Done", value: completedLessons.length, color: "text-blue-400", bg: "bg-blue-400/10" },
    { icon: Shield, label: "Openings Studied", value: completedOpenings.length, color: "text-green-400", bg: "bg-green-400/10" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

      {/* Profile Header Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl border border-border bg-card overflow-hidden mb-8 shadow-xl"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-amber-500/5 pointer-events-none" />

        <div className="relative p-8 sm:p-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-amber-400 flex items-center justify-center text-4xl font-bold text-black shadow-lg ring-4 ring-primary/20">
                {avatarInitial}
              </div>
              <div className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full border text-xs font-bold ${levelColors[user.level] ?? "text-primary bg-primary/10 border-primary/20"}`}>
                {user.level}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-3 mb-1">
                {editingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      autoFocus
                      value={nameValue}
                      onChange={(e) => setNameValue(e.target.value)}
                      className="text-2xl font-bold bg-transparent border-b-2 border-primary outline-none text-foreground"
                    />
                    <button onClick={() => setEditingName(false)} className="p-1 text-green-400 hover:text-green-300">
                      <Check className="w-5 h-5" />
                    </button>
                    <button onClick={() => setEditingName(false)} className="p-1 text-muted-foreground hover:text-foreground">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold text-foreground">
                      {user.displayName || user.username}
                    </h1>
                    <button
                      onClick={() => { setNameValue(user.displayName || user.username); setEditingName(true); }}
                      className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
              <p className="text-muted-foreground mb-1">@{user.username}</p>
              <p className="text-muted-foreground text-sm flex items-center justify-center sm:justify-start gap-2">
                <Calendar className="w-4 h-4" />
                Joined {new Date(user.joinedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </p>
            </div>

            {/* Rating + Logout */}
            <div className="flex flex-col items-center gap-3 shrink-0">
              <div className="text-center px-6 py-3 rounded-2xl bg-primary/10 border border-primary/20">
                <div className="text-3xl font-bold text-primary">{user.rating}</div>
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">ELO Rating</div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors px-3 py-1.5 rounded-lg hover:bg-destructive/10"
              >
                <LogOut className="w-4 h-4" /> Log out
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-8 pt-6 border-t border-border/50">
            <div className="flex justify-between items-center mb-2 text-sm">
              <span className="text-muted-foreground font-medium">Course Progress</span>
              <span className="font-bold text-primary">{completionPct}% complete</span>
            </div>
            <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionPct}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-primary to-amber-400 rounded-full"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            key={stat.label}
            className="rounded-2xl border border-border bg-card p-5 flex flex-col items-center text-center"
          >
            <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className={`text-3xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-muted-foreground font-medium">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Completed Lessons */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
            <Book className="w-5 h-5 text-primary" />
            Completed Lessons
            <span className="ml-auto text-sm text-muted-foreground font-normal">
              {completedLessons.length} / {totalLessons}
            </span>
          </h2>
          {completedLessons.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No lessons completed yet.</p>
              <Link href="/lessons" className="text-primary text-sm font-medium hover:underline mt-1 inline-block">
                Start learning →
              </Link>
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {completedLessons.map((lesson) => (
                <Link key={lesson.id} href={`/lessons/${lesson.id}`}>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/5 border border-green-500/15 hover:border-green-500/30 transition-colors cursor-pointer group">
                    <div className="w-8 h-8 rounded-full bg-green-500/15 flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{lesson.title}</p>
                      <p className="text-xs text-muted-foreground">{lesson.category} · {lesson.difficulty}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        {/* Completed Openings */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Studied Openings
            <span className="ml-auto text-sm text-muted-foreground font-normal">
              {completedOpenings.length} / {openings?.length ?? 0}
            </span>
          </h2>
          {completedOpenings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Crown className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No openings studied yet.</p>
              <Link href="/openings" className="text-primary text-sm font-medium hover:underline mt-1 inline-block">
                Explore openings →
              </Link>
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {completedOpenings.map((opening) => (
                <Link key={opening.id} href={`/openings/${opening.id}`}>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/15 hover:border-primary/30 transition-colors cursor-pointer group">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 font-mono text-xs font-bold text-primary">
                      {opening.eco}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{opening.name}</p>
                      <p className="text-xs text-muted-foreground">{opening.difficulty}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl border border-border bg-card p-6 mt-6"
      >
        <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" /> Achievements
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: "♟", label: "First Step", desc: "Complete 1 lesson", unlocked: completedLessons.length >= 1 },
            { icon: "🎯", label: "On a Roll", desc: "Complete 3 lessons", unlocked: completedLessons.length >= 3 },
            { icon: "📖", label: "Scholar", desc: "Study 3 openings", unlocked: completedOpenings.length >= 3 },
            { icon: "🔥", label: "Streak Master", desc: "3-day streak", unlocked: (progress?.streak ?? 0) >= 3 },
            { icon: "⭐", label: "Point Collector", desc: "Earn 200 points", unlocked: (progress?.totalPoints ?? 0) >= 200 },
            { icon: "👑", label: "Halfway There", desc: "50% lessons done", unlocked: completionPct >= 50 },
            { icon: "🏆", label: "Champion", desc: "100% lessons done", unlocked: completionPct >= 100 },
            { icon: "🧠", label: "Tactician", desc: "Complete 5 lessons", unlocked: completedLessons.length >= 5 },
          ].map((ach) => (
            <div
              key={ach.label}
              className={`p-4 rounded-xl border text-center transition-all ${
                ach.unlocked
                  ? "border-primary/30 bg-primary/5"
                  : "border-border bg-secondary/30 opacity-40 grayscale"
              }`}
            >
              <div className="text-3xl mb-2">{ach.icon}</div>
              <div className={`font-bold text-sm mb-0.5 ${ach.unlocked ? "text-foreground" : "text-muted-foreground"}`}>
                {ach.label}
              </div>
              <div className="text-xs text-muted-foreground">{ach.desc}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
