import { useLessons, useProgress } from "@/hooks/use-chess";
import { useUser } from "@/hooks/use-auth";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, PlayCircle, CheckCircle2, ChevronRight, Loader2, BookOpen, Filter, Trophy, Star } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const DIFFICULTY_STYLE = {
  Beginner: { cls: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30", dot: "bg-emerald-400" },
  Intermediate: { cls: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30", dot: "bg-yellow-400" },
  Advanced: { cls: "text-red-400 bg-red-400/10 border-red-400/30", dot: "bg-red-400" },
};

const XP_MAP: Record<string, number> = {
  Beginner: 50,
  Intermediate: 80,
  Advanced: 120,
};

type FilterType = "All" | "Beginner" | "Intermediate" | "Advanced" | "Completed" | "In Progress";

export default function Lessons() {
  const { data: lessons, isLoading } = useLessons();
  const { data: user } = useUser();
  const { data: progress } = useProgress();
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");

  const completedIds = new Set(progress?.completedLessons ?? []);
  const sorted = lessons ? [...lessons].sort((a, b) => a.order - b.order) : [];
  const nextLesson = sorted.find((l) => !completedIds.has(l.id));

  const filtered = sorted.filter((l) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Completed") return completedIds.has(l.id);
    if (activeFilter === "In Progress") return !completedIds.has(l.id);
    return l.difficulty === activeFilter;
  });

  const categories = [...new Set(sorted.map((l) => l.category))];
  const totalXP = sorted.filter((l) => completedIds.has(l.id)).reduce((sum, l) => sum + (XP_MAP[l.difficulty] ?? 50), 0);
  const filters: FilterType[] = ["All", "Beginner", "Intermediate", "Advanced", "Completed", "In Progress"];

  const groupedByCategory = categories.map((cat) => ({
    category: cat,
    lessons: filtered.filter((l) => l.category === cat),
  })).filter((g) => g.lessons.length > 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel mb-5 border border-primary/20">
          <BookOpen className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">Masterclasses</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-3">
          Chess <span className="gold-gradient-text">Lessons</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Structured learning paths from fundamental rules to grandmaster concepts.
        </p>

        {/* Stats Grid */}
        {user && (
          <div className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: Trophy, label: "Completed", value: `${completedIds.size}/${sorted.length}`, color: "text-primary" },
              { icon: Star, label: "Total XP", value: totalXP, color: "text-accent" },
              { icon: BookOpen, label: "Remaining", value: sorted.length - completedIds.size, color: "text-blue-400" },
              { icon: Clock, label: "Total Time", value: `${sorted.reduce((s, l) => s + l.duration, 0)}m`, color: "text-purple-400" },
            ].map((stat) => (
              <div key={stat.label} className="glass-panel rounded-2xl p-4 border border-border/50">
                <stat.icon className={`w-4 h-4 ${stat.color} mb-2`} />
                <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Progress Bar */}
        {user && progress && (
          <div className="mt-5 space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Overall Progress</span>
              <span className="font-semibold text-primary">{Math.round((completedIds.size / Math.max(sorted.length, 1)) * 100)}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.round((completedIds.size / Math.max(sorted.length, 1)) * 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-primary to-amber-400 rounded-full"
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="flex items-center gap-2 flex-wrap mb-8">
        <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
        {filters.map((f) => {
          const count = f === "All" ? sorted.length
            : f === "Completed" ? completedIds.size
            : f === "In Progress" ? sorted.length - completedIds.size
            : sorted.filter((l) => l.difficulty === f).length;
          return (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all",
                activeFilter === f
                  ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                  : "bg-secondary/50 text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
              )}>
              {f} {count > 0 && <span className={activeFilter === f ? "opacity-70" : "opacity-50"}>({count})</span>}
            </button>
          );
        })}
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No lessons match this filter.</p>
        </div>
      ) : (
        <div className="space-y-10">
          <AnimatePresence mode="wait">
            {groupedByCategory.map((group, gi) => (
              <motion.div key={group.category} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: gi * 0.08 }}>
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-lg text-foreground">{group.category}</h2>
                    <p className="text-xs text-muted-foreground">{group.lessons.length} lesson{group.lessons.length !== 1 ? "s" : ""}</p>
                  </div>
                  <div className="h-px flex-1 bg-border/50 ml-2" />
                </div>

                {/* Lesson Cards */}
                <div className="space-y-3">
                  {group.lessons.map((lesson, i) => {
                    const isCompleted = completedIds.has(lesson.id);
                    const isNext = lesson.id === nextLesson?.id;
                    const xp = XP_MAP[lesson.difficulty] ?? 50;
                    const diffStyle = DIFFICULTY_STYLE[lesson.difficulty as keyof typeof DIFFICULTY_STYLE];

                    return (
                      <motion.div key={lesson.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: gi * 0.08 + i * 0.04 }}>
                        <Link href={`/lessons/${lesson.id}`}>
                          <div className={cn(
                            "relative flex items-center gap-4 p-5 rounded-2xl border transition-all cursor-pointer group",
                            isCompleted
                              ? "border-green-500/20 bg-green-500/5 hover:border-green-500/40"
                              : isNext
                              ? "border-primary/40 bg-primary/5 hover:border-primary/70 ring-1 ring-primary/15"
                              : "border-border bg-card/60 hover:border-primary/30 hover:bg-card/80"
                          )}>
                            {/* Status Badge */}
                            <div className={cn(
                              "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border-2 font-bold text-base transition-all",
                              isCompleted ? "border-green-500 bg-green-500/15 text-green-500"
                                : isNext ? "border-primary bg-primary/15 text-primary"
                                : "border-border bg-secondary text-muted-foreground group-hover:border-primary/40"
                            )}>
                              {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : lesson.order}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full border flex items-center gap-1", diffStyle?.cls)}>
                                  <span className={cn("inline-block w-1.5 h-1.5 rounded-full", diffStyle?.dot)} />
                                  {lesson.difficulty}
                                </span>
                                {isNext && !isCompleted && (
                                  <span className="text-xs font-bold bg-primary/15 text-primary border border-primary/30 px-2 py-0.5 rounded-full">▶ Up Next</span>
                                )}
                                {isCompleted && (
                                  <span className="text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-0.5 rounded-full">✓ Done</span>
                                )}
                              </div>
                              <h2 className={cn("text-base font-bold truncate transition-colors",
                                isCompleted ? "text-foreground/70" : "text-foreground group-hover:text-primary")}>
                                {lesson.title}
                              </h2>
                              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{lesson.description}</p>
                            </div>

                            {/* Right side */}
                            <div className="shrink-0 flex flex-col items-end gap-2">
                              <div className="flex items-center text-muted-foreground text-xs">
                                <Clock className="w-3.5 h-3.5 mr-1" />{lesson.duration} min
                              </div>
                              <div className="text-xs font-bold text-accent">+{xp} XP</div>
                              <div className={cn(
                                "flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg transition-colors",
                                isCompleted ? "bg-green-500/10 text-green-500" : "bg-secondary text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground"
                              )}>
                                {isCompleted ? <><CheckCircle2 className="w-3.5 h-3.5" /> Review</> : <><PlayCircle className="w-3.5 h-3.5" /> Start</>}
                              </div>
                            </div>

                            <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" />
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
