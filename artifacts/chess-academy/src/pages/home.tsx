import { Link } from "wouter";
import { motion } from "framer-motion";
import { ChevronRight, Award, BookOpen, Swords, Zap, Target, Users, Star, AlertTriangle, PlayCircle } from "lucide-react";
import { ChessBoard } from "@/components/chess/ChessBoard";
import { useUser } from "@/hooks/use-auth";
import { useProgress, useLessons } from "@/hooks/use-chess";

const QUOTES = [
  { text: "Chess is not about who makes the last mistake.", author: "Savielly Tartakower" },
  { text: "Every chess master was once a beginner.", author: "Irving Chernev" },
  { text: "Chess is life in miniature. Chess is a struggle, chess is battles.", author: "Garry Kasparov" },
  { text: "The pin is mightier than the sword.", author: "Fred Reinfeld" },
  { text: "When you see a good move, look for a better one.", author: "Emanuel Lasker" },
  { text: "Chess is the art of analysis.", author: "Mikhail Botvinnik" },
  { text: "Play the opening like a book, the middlegame like a magician, and the endgame like a machine.", author: "Rudolf Spielmann" },
];

const todayQuote = QUOTES[new Date().getDay() % QUOTES.length];

export default function Home() {
  const { data: user } = useUser();
  const { data: progress } = useProgress();
  const { data: lessons } = useLessons();

  const completedIds = new Set(progress?.completedLessons ?? []);
  const sortedLessons = lessons ? [...lessons].sort((a, b) => a.order - b.order) : [];
  const nextLesson = sortedLessons.find((l) => !completedIds.has(l.id));
  const completedCount = completedIds.size;
  const completionPct = sortedLessons.length > 0 ? Math.round((completedCount / sortedLessons.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
            alt="Luxurious chess background"
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>
        {/* ambient glows */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/8 blur-[180px] rounded-full pointer-events-none z-0" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-accent/6 blur-[150px] rounded-full pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-panel mb-6 border border-primary/20">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">Master the Royal Game</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6">
                Elevate Your <br />
                <span className="gold-gradient-text">Chess Strategy</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
                Join the most exclusive chess academy. Learn grandmaster openings, master complex tactics, and track your journey to chess mastery.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                {user ? (
                  <>
                    <Link
                      href={nextLesson ? `/lessons/${nextLesson.id}` : "/lessons"}
                      className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-primary-foreground bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group"
                    >
                      <PlayCircle className="mr-2 w-5 h-5" />
                      {nextLesson ? "Continue Learning" : "Review Lessons"}
                      <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      href="/dashboard"
                      className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-foreground glass-panel hover:bg-secondary transition-all duration-300 flex items-center justify-center border border-border/60"
                    >
                      View Dashboard
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/register"
                      className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-primary-foreground bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group"
                    >
                      Start Your Journey
                      <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      href="/openings"
                      className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-foreground glass-panel hover:bg-secondary transition-all duration-300 flex items-center justify-center border border-border/60"
                    >
                      Explore Openings
                    </Link>
                  </>
                )}
              </div>

              {/* Logged-in progress bar */}
              {user && lessons && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                  className="mt-8 glass-panel rounded-2xl p-4 border border-primary/15 max-w-md mx-auto lg:mx-0">
                  <div className="flex justify-between text-xs text-muted-foreground mb-2">
                    <span>Course Progress</span>
                    <span className="font-bold text-primary">{completionPct}% complete</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${completionPct}%` }}
                      transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-primary to-amber-400 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {completedCount} of {sortedLessons.length} lessons complete
                    {nextLesson && <span className="text-primary ml-1">· Next: {nextLesson.title}</span>}
                  </p>
                </motion.div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="relative"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/15 blur-[100px] rounded-full pointer-events-none" />
              <div className="relative transform rotate-3 hover:rotate-0 transition-transform duration-700 ease-out">
                <ChessBoard
                  interactive={false}
                  fen="r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3"
                />
                <div className="absolute -bottom-6 -left-6 glass-panel p-4 rounded-2xl animate-bounce border border-border/40" style={{ animationDuration: "3s" }}>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-foreground">Ruy Lopez</div>
                      <div className="text-xs text-muted-foreground">Excellent Move</div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 glass-panel px-3 py-2 rounded-xl border border-primary/20 animate-bounce" style={{ animationDuration: "4s", animationDelay: "1s" }}>
                  <div className="text-xs font-bold text-primary">+80 XP</div>
                  <div className="text-xs text-muted-foreground">Lesson complete!</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quote of the Day */}
      <section className="py-10 border-y border-border/30 bg-primary/3">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <p className="text-xl md:text-2xl font-display italic text-foreground/80 mb-3">
              "{todayQuote.text}"
            </p>
            <p className="text-sm text-primary font-semibold">— {todayQuote.author}</p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-secondary/50 relative border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel mb-5 border border-primary/20">
              <Star className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Why Chess Academy</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">A Premium Learning Experience</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Designed for players who appreciate the beauty and depth of chess.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: BookOpen, title: "Curated Openings", desc: "Deep explorations of 30+ openings with key ideas, common lines, and historical context.", badge: "30+ Openings" },
              { icon: Swords, title: "Structured Lessons", desc: "Step-by-step masterclasses from basic checkmates to advanced positional play with quizzes.", badge: "20 Lessons" },
              { icon: Award, title: "Progress Tracking", desc: "Earn XP, maintain streaks, unlock achievements and watch your ELO rating climb.", badge: "Track Progress" },
            ].map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-panel p-8 rounded-2xl premium-hover border border-border/50 relative overflow-hidden group"
              >
                <div className="absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{feat.badge}</div>
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary border border-primary/20 group-hover:bg-primary/20 transition-colors">
                  <feat.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-display font-bold mb-3">{feat.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: BookOpen, value: "20+", label: "Lessons", color: "text-blue-400" },
              { icon: Target, value: "30+", label: "Openings", color: "text-primary" },
              { icon: AlertTriangle, value: "10+", label: "Deadly Traps", color: "text-red-400" },
              { icon: Users, value: "ELO", label: "Rating System", color: "text-accent" },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass-panel p-5 rounded-2xl text-center border border-border/40">
                <s.icon className={`w-6 h-6 ${s.color} mx-auto mb-2`} />
                <div className={`text-3xl font-bold ${s.color} mb-1`}>{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background pointer-events-none" />
          <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="text-6xl mb-6">♔</div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Ready to Master <span className="gold-gradient-text">Chess?</span>
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Join Chess Academy and start your journey from beginner to grandmaster-level thinking.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register"
                  className="px-8 py-4 rounded-xl font-bold text-primary-foreground bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                  <Zap className="w-5 h-5" /> Create Free Account
                </Link>
                <Link href="/lessons"
                  className="px-8 py-4 rounded-xl font-bold text-foreground glass-panel hover:bg-secondary transition-all border border-border/60 flex items-center justify-center">
                  Browse Lessons
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
}
