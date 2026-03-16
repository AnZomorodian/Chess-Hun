import { useOpenings, useProgress } from "@/hooks/use-chess";
import { useUser } from "@/hooks/use-auth";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Search, Loader2, BookOpen, CheckCircle2, ChevronDown } from "lucide-react";
import { useState, useMemo } from "react";

const DIFFICULTY_ORDER: Record<string, number> = {
  Beginner: 0,
  Intermediate: 1,
  Advanced: 2,
};

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: "text-green-400 bg-green-400/10 border-green-400/20",
  Intermediate: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  Advanced: "text-red-400 bg-red-400/10 border-red-400/20",
};

export default function Openings() {
  const { data: openings, isLoading } = useOpenings();
  const { data: user } = useUser();
  const { data: progress } = useProgress();
  const [search, setSearch] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("All");

  const completedIds = new Set(progress?.completedOpenings ?? []);

  const filtered = useMemo(() => {
    if (!openings) return [];
    return openings
      .filter((o) => {
        const matchesSearch =
          o.name.toLowerCase().includes(search.toLowerCase()) ||
          o.eco.toLowerCase().includes(search.toLowerCase()) ||
          o.category.toLowerCase().includes(search.toLowerCase());
        const matchesDifficulty =
          filterDifficulty === "All" || o.difficulty === filterDifficulty;
        return matchesSearch && matchesDifficulty;
      })
      .sort(
        (a, b) =>
          (DIFFICULTY_ORDER[a.difficulty] ?? 99) -
          (DIFFICULTY_ORDER[b.difficulty] ?? 99)
      );
  }, [openings, search, filterDifficulty]);

  const grouped = useMemo(() => {
    const groups: Record<string, typeof filtered> = {};
    filtered.forEach((o) => {
      const key = o.difficulty;
      if (!groups[key]) groups[key] = [];
      groups[key].push(o);
    });
    return groups;
  }, [filtered]);

  const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Openings Library
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Study the foundational sequences of chess — from solid beginners' setups to razor-sharp gambits.
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto mb-10">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, ECO code, or category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/50 text-foreground"
          />
        </div>
        <div className="flex gap-2 shrink-0">
          {difficulties.map((d) => (
            <button
              key={d}
              onClick={() => setFilterDifficulty(d)}
              className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                filterDifficulty === d
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border text-muted-foreground hover:border-primary/40"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          No openings found matching your search.
        </div>
      ) : (
        <div className="space-y-12">
          {Object.entries(grouped).map(([difficulty, items]) => (
            <section key={difficulty}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`px-4 py-1.5 rounded-full text-sm font-bold border ${DIFFICULTY_COLORS[difficulty] || "text-muted-foreground bg-secondary border-border"}`}>
                  {difficulty}
                </div>
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">{items.length} opening{items.length !== 1 ? "s" : ""}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {items.map((opening, i) => {
                  const isCompleted = completedIds.has(opening.id);
                  return (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.04 }}
                      key={opening.id}
                    >
                      <Link href={`/openings/${opening.id}`}>
                        <div className={`relative p-6 rounded-2xl border h-full flex flex-col cursor-pointer group transition-all
                          ${isCompleted
                            ? "border-green-500/20 bg-green-500/5 hover:border-green-500/40"
                            : "border-border bg-card hover:border-primary/40 hover:bg-card/60"
                          }`}
                        >
                          {isCompleted && (
                            <div className="absolute top-4 right-4">
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            </div>
                          )}

                          <div className="flex justify-between items-start mb-4">
                            <div className="px-2.5 py-1 rounded-lg bg-secondary border border-border text-xs font-bold font-mono text-muted-foreground">
                              {opening.eco}
                            </div>
                            <div className="flex gap-1">
                              {opening.moves.slice(0, 3).map((m, mi) => (
                                <span key={mi} className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono">
                                  {m}
                                </span>
                              ))}
                              {opening.moves.length > 3 && (
                                <span className="text-xs text-muted-foreground">…</span>
                              )}
                            </div>
                          </div>

                          <h2 className={`text-lg font-bold mb-2 transition-colors leading-snug
                            ${isCompleted ? "text-foreground/70" : "group-hover:text-primary"}`}
                          >
                            {opening.name}
                          </h2>
                          <p className="text-muted-foreground text-sm line-clamp-2 mb-5 flex-grow">
                            {opening.description}
                          </p>

                          <div className="mt-auto pt-4 border-t border-border/40 flex justify-between items-center text-xs">
                            <span className="text-muted-foreground">{opening.category}</span>
                            <span className="flex items-center gap-1 text-muted-foreground group-hover:text-primary transition-colors font-medium">
                              Study <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
