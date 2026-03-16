import { useLessons, useProgress } from "@/hooks/use-chess";
import { useUser } from "@/hooks/use-auth";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Clock, PlayCircle, CheckCircle2, Lock, ChevronRight, Loader2 } from "lucide-react";

const DIFFICULTY_ORDER = { Beginner: 0, Intermediate: 1, Advanced: 2 };

export default function Lessons() {
  const { data: lessons, isLoading } = useLessons();
  const { data: user } = useUser();
  const { data: progress } = useProgress();

  const completedIds = new Set(progress?.completedLessons ?? []);

  const sorted = lessons ? [...lessons].sort((a, b) => a.order - b.order) : [];

  const nextLesson = sorted.find((l) => !completedIds.has(l.id));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">
          Masterclasses
        </h1>
        <p className="text-lg text-muted-foreground">
          Structured learning paths from fundamental rules to grandmaster concepts.
        </p>
        {user && progress && (
          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.round((completedIds.size / Math.max(sorted.length, 1)) * 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-primary to-amber-400 rounded-full"
              />
            </div>
            <span className="text-sm font-bold text-primary whitespace-nowrap">
              {completedIds.size} / {sorted.length} complete
            </span>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((lesson, i) => {
            const isCompleted = completedIds.has(lesson.id);
            const isNext = lesson.id === nextLesson?.id;

            return (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                key={lesson.id}
              >
                <Link href={`/lessons/${lesson.id}`}>
                  <div className={`relative flex items-center gap-5 p-5 rounded-2xl border transition-all cursor-pointer group
                    ${isCompleted
                      ? "border-green-500/20 bg-green-500/5 hover:border-green-500/40"
                      : isNext
                      ? "border-primary/40 bg-primary/5 hover:border-primary/70 ring-1 ring-primary/20"
                      : "border-border bg-card hover:border-primary/30 hover:bg-card/80"
                    }`}
                  >
                    {/* Status circle */}
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors font-bold text-lg
                      ${isCompleted
                        ? "border-green-500 bg-green-500/10 text-green-500"
                        : isNext
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-secondary text-muted-foreground group-hover:border-primary/40"
                      }`}
                    >
                      {isCompleted
                        ? <CheckCircle2 className="w-7 h-7" />
                        : lesson.order}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary">
                          {lesson.category}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span className={`text-xs font-bold uppercase tracking-wider
                          ${lesson.difficulty === "Beginner" ? "text-green-400"
                          : lesson.difficulty === "Intermediate" ? "text-yellow-400"
                          : "text-red-400"}`}
                        >
                          {lesson.difficulty}
                        </span>
                        {isNext && !isCompleted && (
                          <span className="ml-1 text-xs font-bold bg-primary/15 text-primary border border-primary/30 px-2 py-0.5 rounded-full">
                            ▶ Up Next
                          </span>
                        )}
                        {isCompleted && (
                          <span className="ml-1 text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-0.5 rounded-full">
                            ✓ Completed
                          </span>
                        )}
                      </div>
                      <h2 className={`text-lg font-bold truncate transition-colors
                        ${isCompleted ? "text-foreground/70" : "text-foreground group-hover:text-primary"}`}
                      >
                        {lesson.title}
                      </h2>
                      <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                        {lesson.description}
                      </p>
                    </div>

                    {/* Right side */}
                    <div className="shrink-0 flex flex-col items-end gap-2">
                      <div className="flex items-center text-muted-foreground text-xs font-medium">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        {lesson.duration} min
                      </div>
                      <div className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors
                        ${isCompleted
                          ? "bg-green-500/10 text-green-500"
                          : "bg-secondary text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground"
                        }`}
                      >
                        {isCompleted ? (
                          <><CheckCircle2 className="w-3.5 h-3.5" /> Review</>
                        ) : (
                          <><PlayCircle className="w-3.5 h-3.5" /> Start</>
                        )}
                      </div>
                    </div>

                    {/* Arrow */}
                    <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
