import { useLesson, useUpdateProgress, useLessons } from "@/hooks/use-chess";
import { useUser } from "@/hooks/use-auth";
import { useParams, Link, useLocation } from "wouter";
import { ArrowLeft, CheckCircle2, ChevronRight, Loader2, XCircle, Trophy, ArrowRight, Lock } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";

export default function LessonDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { data: lesson, isLoading } = useLesson(id || "");
  const { data: lessons } = useLessons();
  const { data: user } = useUser();
  const updateProgress = useUpdateProgress();

  const [currentStep, setCurrentStep] = useState<"content" | "exercises" | "complete">("content");
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [saved, setSaved] = useState(false);

  if (isLoading)
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  if (!lesson)
    return (
      <div className="text-center py-20 text-xl text-muted-foreground">
        Lesson not found.
      </div>
    );

  // ELO gate
  const minElo = (lesson as any).minElo;
  const userRating = user?.rating ?? 0;
  if (minElo && userRating < minElo) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-6">
          <Lock className="w-10 h-10 text-amber-400" />
        </div>
        <h1 className="text-3xl font-display font-bold mb-3 text-amber-400">Elite Lesson Locked</h1>
        <p className="text-muted-foreground mb-2 text-lg">
          <span className="font-semibold text-foreground">{lesson.title}</span> requires a rating of{" "}
          <span className="text-amber-400 font-bold">{minElo}+ ELO</span> to access.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Your current rating: <span className="font-bold text-foreground">{userRating}</span> — keep playing and studying to unlock this masterclass!
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/lessons">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
              <ArrowLeft className="w-4 h-4" /> Back to Lessons
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Find the next lesson in order
  const sortedLessons = lessons ? [...lessons].sort((a, b) => a.order - b.order) : [];
  const currentIdx = sortedLessons.findIndex((l) => l.id === lesson.id);
  const nextLesson = sortedLessons[currentIdx + 1] ?? null;

  const handleComplete = () => {
    if (saved) return;
    setSaved(true);
    if (user) {
      updateProgress.mutate(
        { lessonId: lesson.id, pointsEarned: 50 + correctCount * 10 },
        {
          onSuccess: () => {
            toast({
              title: "🏆 Lesson Complete!",
              description: `Earned ${50 + correctCount * 10} points!`,
            });
          },
        }
      );
    }
  };

  const currentExercise = lesson.exercises?.[currentExerciseIdx];

  const handleAnswerSubmit = () => {
    setShowAnswer(true);
    if (selectedOption === currentExercise?.answer) {
      setCorrectCount((c) => c + 1);
    }
  };

  const handleNextExercise = () => {
    if (currentExerciseIdx < (lesson.exercises?.length || 0) - 1) {
      setCurrentExerciseIdx((prev) => prev + 1);
      setSelectedOption(null);
      setShowAnswer(false);
    } else {
      setCurrentStep("complete");
      handleComplete();
    }
  };

  const progressPct =
    currentStep === "content"
      ? 10
      : currentStep === "exercises"
      ? 33 + (currentExerciseIdx / (lesson.exercises?.length || 1)) * 60
      : 100;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Link
        href="/lessons"
        className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Lessons
      </Link>

      <div className="rounded-3xl border border-border bg-card relative overflow-hidden shadow-xl">
        {/* Progress bar */}
        <div className="h-1.5 bg-secondary">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-amber-400"
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        <div className="p-8 sm:p-12">
          <AnimatePresence mode="wait">

            {/* CONTENT STEP */}
            {currentStep === "content" && (
              <motion.div
                key="content"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {lesson.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{lesson.duration} min read</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-3">{lesson.title}</h1>
                <p className="text-lg text-muted-foreground mb-10 border-b border-border pb-8">
                  {lesson.description}
                </p>

                <div className="prose prose-invert max-w-none
                  prose-headings:font-bold prose-headings:text-foreground
                  prose-h1:text-2xl prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3
                  prose-h3:text-lg prose-h3:text-primary prose-h3:mt-6 prose-h3:mb-2
                  prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:my-3
                  prose-strong:text-foreground prose-strong:font-semibold
                  prose-ul:list-disc prose-ul:pl-6 prose-ul:my-3
                  prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-3
                  prose-li:text-muted-foreground prose-li:my-1
                  prose-table:border-collapse prose-table:w-full prose-table:my-6
                  prose-th:bg-primary/10 prose-th:text-foreground prose-th:p-3 prose-th:text-left prose-th:border prose-th:border-border
                  prose-td:p-3 prose-td:border prose-td:border-border prose-td:text-muted-foreground
                  prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground prose-blockquote:my-4
                  prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-primary prose-code:text-sm
                ">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{lesson.content}</ReactMarkdown>
                </div>

                <div className="flex justify-end pt-10 border-t border-border/50 mt-10">
                  <button
                    onClick={() =>
                      lesson.exercises?.length
                        ? setCurrentStep("exercises")
                        : setCurrentStep("complete")
                    }
                    className="px-8 py-3 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:-translate-y-0.5 shadow-lg flex items-center gap-2"
                  >
                    Continue to Exercises <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* EXERCISES STEP */}
            {currentStep === "exercises" && currentExercise && (
              <motion.div
                key={`exercise-${currentExerciseIdx}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
                    Question {currentExerciseIdx + 1} / {lesson.exercises?.length}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {correctCount} correct
                  </span>
                </div>

                <h2 className="text-2xl font-bold mb-8 leading-snug">
                  {currentExercise.question}
                </h2>

                {currentExercise.options && currentExercise.options.length > 0 && (
                  <div className="space-y-3 mb-8">
                    {currentExercise.options.map((opt, i) => {
                      const isCorrect = opt === currentExercise.answer;
                      const isSelected = selectedOption === opt;
                      return (
                        <motion.button
                          key={i}
                          whileHover={!showAnswer ? { scale: 1.01 } : {}}
                          whileTap={!showAnswer ? { scale: 0.99 } : {}}
                          disabled={showAnswer}
                          onClick={() => setSelectedOption(opt)}
                          className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all font-medium ${
                            showAnswer && isCorrect
                              ? "border-green-500 bg-green-500/10 text-green-400"
                              : showAnswer && isSelected && !isCorrect
                              ? "border-red-500 bg-red-500/10 text-red-400"
                              : isSelected && !showAnswer
                              ? "border-primary bg-primary/10 text-foreground"
                              : "border-border bg-secondary hover:border-primary/40 text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <span className="inline-flex items-center gap-3">
                            <span className="w-7 h-7 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold shrink-0">
                              {String.fromCharCode(65 + i)}
                            </span>
                            {opt}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                )}

                {!showAnswer ? (
                  <button
                    disabled={!selectedOption}
                    onClick={handleAnswerSubmit}
                    className="w-full py-4 rounded-xl font-bold bg-primary text-primary-foreground disabled:opacity-40 transition-all hover:bg-primary/90 hover:-translate-y-0.5"
                  >
                    Check Answer
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className={`p-5 rounded-xl border ${
                      selectedOption === currentExercise.answer
                        ? "bg-green-500/10 border-green-500/30"
                        : "bg-red-500/10 border-red-500/30"
                    }`}>
                      <h4 className="font-bold mb-2 flex items-center gap-2 text-lg">
                        {selectedOption === currentExercise.answer ? (
                          <><CheckCircle2 className="w-5 h-5 text-green-500" /> Correct!</>
                        ) : (
                          <><XCircle className="w-5 h-5 text-red-500" /> Incorrect</>
                        )}
                      </h4>
                      <p className="text-muted-foreground leading-relaxed">{currentExercise.explanation}</p>
                    </div>
                    <button
                      onClick={handleNextExercise}
                      className="w-full py-4 rounded-xl font-bold bg-foreground text-background hover:bg-foreground/90 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    >
                      {currentExerciseIdx < (lesson.exercises?.length || 0) - 1
                        ? "Next Question"
                        : "Finish Lesson"}
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* COMPLETE STEP */}
            {currentStep === "complete" && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                {/* Celebration */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
                  className="w-28 h-28 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-primary/10"
                >
                  <Trophy className="w-14 h-14 text-primary" />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <h2 className="text-4xl font-bold mb-2">Lesson Complete!</h2>
                  <p className="text-muted-foreground text-lg mb-1">
                    You've mastered <span className="text-foreground font-semibold">"{lesson.title}"</span>
                  </p>
                  <div className="flex items-center justify-center gap-4 my-6">
                    <div className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20">
                      <div className="text-2xl font-bold text-primary">+{50 + correctCount * 10}</div>
                      <div className="text-xs text-muted-foreground">points earned</div>
                    </div>
                    <div className="px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
                      <div className="text-2xl font-bold text-green-400">{correctCount}/{lesson.exercises?.length ?? 0}</div>
                      <div className="text-xs text-muted-foreground">correct answers</div>
                    </div>
                  </div>
                </motion.div>

                {/* Next lesson CTA */}
                {nextLesson && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-4 p-5 rounded-2xl bg-card border border-primary/20 text-left mb-6"
                  >
                    <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Up Next</p>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-bold text-foreground">{nextLesson.title}</p>
                        <p className="text-sm text-muted-foreground">{nextLesson.category} · {nextLesson.duration} min</p>
                      </div>
                      <Link href={`/lessons/${nextLesson.id}`}>
                        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:-translate-y-0.5 whitespace-nowrap shadow-lg">
                          Continue <ArrowRight className="w-4 h-4" />
                        </button>
                      </Link>
                    </div>
                  </motion.div>
                )}

                <div className="flex gap-3 justify-center flex-wrap">
                  <Link href="/lessons">
                    <button className="px-6 py-3 rounded-xl font-bold border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all">
                      All Lessons
                    </button>
                  </Link>
                  <Link href="/dashboard">
                    <button className="px-6 py-3 rounded-xl font-bold border border-primary/30 text-primary hover:bg-primary/10 transition-all">
                      View Progress
                    </button>
                  </Link>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
