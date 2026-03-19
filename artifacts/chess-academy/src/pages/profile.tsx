import { useUser, useAuthStore, useUpdateProfile, useChangePassword } from "@/hooks/use-auth";
import { useProgress, useLessons, useOpenings } from "@/hooks/use-chess";
import { Link, Redirect, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Flame, Book, Shield, Star, Crown, Check, X,
  LogOut, Calendar, Target, Award, TrendingUp, Loader2, ChevronRight,
  User, Lock, Palette, Globe, BookOpen, Swords, Save, Eye, EyeOff,
  Edit3, AlertCircle, CheckCircle2, Plus, Trash2,
  ExternalLink, Clock,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type Tab = "overview" | "edit" | "security";

const AVATAR_COLORS = [
  { id: "gold", label: "Gold", from: "from-yellow-500", to: "to-amber-400" },
  { id: "royal", label: "Royal", from: "from-violet-600", to: "to-purple-500" },
  { id: "emerald", label: "Emerald", from: "from-emerald-500", to: "to-teal-400" },
  { id: "crimson", label: "Crimson", from: "from-rose-600", to: "to-red-500" },
  { id: "ocean", label: "Ocean", from: "from-blue-600", to: "to-cyan-500" },
  { id: "midnight", label: "Midnight", from: "from-slate-700", to: "to-slate-500" },
];

const COLOR_MAP: Record<string, { from: string; to: string }> = Object.fromEntries(
  AVATAR_COLORS.map((c) => [c.id, { from: c.from, to: c.to }])
);

const COUNTRIES = [
  "", "United States", "United Kingdom", "Germany", "France", "Russia",
  "India", "China", "Brazil", "Canada", "Australia", "Japan", "South Korea",
  "Netherlands", "Spain", "Italy", "Norway", "Hungary", "Argentina",
  "Ukraine", "Poland", "Czech Republic", "Georgia", "Azerbaijan", "Iran",
  "Turkey", "Mexico", "Colombia", "Nigeria", "Egypt", "Other",
];

const OPENINGS_LIST = [
  "Italian Game", "Ruy López", "Queen's Gambit", "Sicilian Defense", "French Defense",
  "Caro-Kann", "King's Indian Defense", "Nimzo-Indian", "English Opening", "London System",
  "Grünfeld Defense", "King's Gambit", "Catalan Opening", "Dutch Defense", "Slav Defense",
  "Sicilian Najdorf", "Sicilian Dragon", "Réti Opening", "Alekhine's Defense", "Modern Benoni",
];

const LEVEL_COLORS: Record<string, string> = {
  Beginner: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  Intermediate: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  Advanced: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  Expert: "text-red-400 bg-red-400/10 border-red-400/20",
  Master: "text-purple-400 bg-purple-400/10 border-purple-400/20",
};

export default function Profile() {
  const { data: user, isLoading: userLoading } = useUser();
  const { data: progress, isLoading: progressLoading } = useProgress();
  const { data: lessons } = useLessons();
  const { data: openings } = useOpenings();
  const logout = useAuthStore((s) => s.logout);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();

  const [activeTab, setActiveTab] = useState<Tab>("overview");

  // Edit profile form
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [country, setCountry] = useState("");
  const [favoriteOpening, setFavoriteOpening] = useState("");
  const [preferredSide, setPreferredSide] = useState<"White" | "Black" | "Both">("Both");
  const [avatarColor, setAvatarColor] = useState("gold");
  const [hideLeaderboard, setHideLeaderboard] = useState(false);
  const [chessAccounts, setChessAccounts] = useState<{ platform: string; username: string }[]>([]);

  // Password form
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || user.username);
      setBio((user as any).bio || "");
      setCountry((user as any).country || "");
      setFavoriteOpening((user as any).favoriteOpening || "");
      setPreferredSide((user as any).preferredSide || "Both");
      setAvatarColor((user as any).avatarColor || "gold");
      setHideLeaderboard((user as any).hideFromLeaderboard ?? false);
      setChessAccounts((user as any).chessAccounts ?? []);
    }
  }, [user]);

  if (userLoading || progressLoading) {
    return <div className="flex justify-center items-center min-h-[60vh]"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  }
  if (!user) return <Redirect href="/login" />;

  const completedLessons = lessons?.filter((l) => progress?.completedLessons?.includes(l.id)) ?? [];
  const completedOpenings = openings?.filter((o) => progress?.completedOpenings?.includes(o.id)) ?? [];
  const totalLessons = lessons?.length ?? 1;
  const completionPct = Math.round((completedLessons.length / totalLessons) * 100);
  const totalXP = completedLessons.reduce((s, l) => s + (l.difficulty === "Advanced" ? 120 : l.difficulty === "Intermediate" ? 80 : 50), 0);

  const avatarColors = COLOR_MAP[(user as any).avatarColor || "gold"] || COLOR_MAP["gold"];

  const handleSaveProfile = () => {
    updateProfile.mutate(
      { displayName, bio, country, favoriteOpening, preferredSide, avatarColor, hideFromLeaderboard: hideLeaderboard, chessAccounts } as any,
      {
        onSuccess: () => toast({ title: "Profile Updated", description: "Your changes have been saved." }),
        onError: (e: any) => {
          const msg = e?.response?.data?.error || e.message || "Something went wrong.";
          toast({ variant: "destructive", title: "Error", description: msg });
        },
      }
    );
  };

  const addChessAccount = () => {
    if (chessAccounts.length < 4) {
      setChessAccounts([...chessAccounts, { platform: "Chess.com", username: "" }]);
    }
  };

  const removeChessAccount = (i: number) => {
    setChessAccounts(chessAccounts.filter((_, idx) => idx !== i));
  };

  const updateChessAccount = (i: number, field: "platform" | "username", value: string) => {
    setChessAccounts(chessAccounts.map((a, idx) => idx === i ? { ...a, [field]: value } : a));
  };

  const canChangeName = (user as any).canChangeName ?? true;
  const nextNameChangeAt = (user as any).nextNameChangeAt as string | null;

  const handleChangePassword = () => {
    if (newPw !== confirmPw) {
      toast({ variant: "destructive", title: "Passwords don't match", description: "New password and confirmation must match." });
      return;
    }
    if (newPw.length < 6) {
      toast({ variant: "destructive", title: "Too short", description: "Password must be at least 6 characters." });
      return;
    }
    changePassword.mutate({ currentPassword: currentPw, newPassword: newPw }, {
      onSuccess: () => {
        toast({ title: "Password Changed", description: "Your password has been updated." });
        setCurrentPw(""); setNewPw(""); setConfirmPw("");
      },
      onError: (e) => toast({ variant: "destructive", title: "Error", description: e.message }),
    });
  };

  const achievements = [
    { icon: "♟", label: "First Move", desc: "Complete your first lesson", unlocked: completedLessons.length >= 1 },
    { icon: "🎯", label: "On a Roll", desc: "Complete 3 lessons", unlocked: completedLessons.length >= 3 },
    { icon: "🧠", label: "Tactician", desc: "Complete 5 lessons", unlocked: completedLessons.length >= 5 },
    { icon: "📚", label: "Bookworm", desc: "Complete 10 lessons", unlocked: completedLessons.length >= 10 },
    { icon: "🎓", label: "Dedicated", desc: "Complete 15 lessons", unlocked: completedLessons.length >= 15 },
    { icon: "📖", label: "Opening Fan", desc: "Study 3 openings", unlocked: completedOpenings.length >= 3 },
    { icon: "🌟", label: "Theory Buff", desc: "Study 10 openings", unlocked: completedOpenings.length >= 10 },
    { icon: "♛", label: "Opening Master", desc: "Study 20 openings", unlocked: completedOpenings.length >= 20 },
    { icon: "🔥", label: "Streak Starter", desc: "3-day learning streak", unlocked: (progress?.streak ?? 0) >= 3 },
    { icon: "⚡", label: "Streak Master", desc: "7-day streak", unlocked: (progress?.streak ?? 0) >= 7 },
    { icon: "💫", label: "Inferno", desc: "14-day streak", unlocked: (progress?.streak ?? 0) >= 14 },
    { icon: "⭐", label: "Point Starter", desc: "Earn 200 XP", unlocked: totalXP >= 200 },
    { icon: "💎", label: "XP Hunter", desc: "Earn 500 XP", unlocked: totalXP >= 500 },
    { icon: "🏅", label: "Point Hoarder", desc: "Earn 1000 XP", unlocked: totalXP >= 1000 },
    { icon: "👑", label: "Halfway There", desc: "50% of all lessons done", unlocked: completionPct >= 50 },
    { icon: "🏆", label: "Champion", desc: "Complete all lessons", unlocked: completionPct >= 100 },
    { icon: "📈", label: "Rated Player", desc: "Reach 1000 ELO", unlocked: user.rating >= 1000 },
    { icon: "♜", label: "Strong Player", desc: "Reach 1200 ELO", unlocked: user.rating >= 1200 },
    { icon: "🥊", label: "Expert", desc: "Reach 1500 ELO", unlocked: user.rating >= 1500 },
    { icon: "🎖️", label: "Master", desc: "Reach 2000 ELO", unlocked: user.rating >= 2000 },
  ];

  const tabs: { id: Tab; label: string; icon: typeof User }[] = [
    { id: "overview", label: "Overview", icon: User },
    { id: "edit", label: "Edit Profile", icon: Edit3 },
    { id: "security", label: "Security", icon: Lock },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

      {/* Profile Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl border border-border bg-card overflow-hidden mb-6 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-amber-500/5 pointer-events-none" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative p-7 sm:p-9">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${avatarColors.from} ${avatarColors.to} flex items-center justify-center text-4xl font-bold text-white shadow-xl ring-4 ring-white/10`}>
                {(user.displayName || user.username)[0]?.toUpperCase()}
              </div>
              <div className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full border text-xs font-bold ${LEVEL_COLORS[user.level] ?? "text-primary bg-primary/10 border-primary/20"}`}>
                {user.level}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left min-w-0">
              <h1 className="text-3xl sm:text-4xl font-display font-bold mb-1 bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
                {user.displayName || user.username}
              </h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
                  @{user.username}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary border border-border text-muted-foreground text-xs">
                  {user.email}
                </span>
              </div>
              {(user as any).bio && <p className="text-sm text-muted-foreground/80 italic mb-2 line-clamp-2">"{(user as any).bio}"</p>}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary border border-border text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3 text-primary" />
                  Joined {new Date(user.joinedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </span>
                {(user as any).country && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary border border-border text-xs text-muted-foreground">
                    <Globe className="w-3 h-3 text-primary" />
                    {(user as any).country}
                  </span>
                )}
                {(user as any).favoriteOpening && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400">
                    <BookOpen className="w-3 h-3" />
                    {(user as any).favoriteOpening}
                  </span>
                )}
                {(user as any).preferredSide && (user as any).preferredSide !== "Both" && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary border border-border text-xs text-muted-foreground">
                    <Swords className="w-3 h-3 text-primary" />
                    Plays {(user as any).preferredSide}
                  </span>
                )}
              </div>
            </div>

            {/* Rating + Logout */}
            <div className="flex flex-col items-center gap-3 shrink-0">
              <div className="text-center px-6 py-3 rounded-2xl bg-primary/10 border border-primary/20">
                <div className="text-3xl font-bold text-primary">{user.rating}</div>
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">ELO Rating</div>
              </div>
              <button onClick={() => { logout(); setLocation("/"); }}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors px-3 py-1.5 rounded-lg hover:bg-destructive/10">
                <LogOut className="w-4 h-4" /> Log out
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-7 pt-5 border-t border-border/50">
            <div className="flex justify-between items-center mb-2 text-sm">
              <span className="text-muted-foreground font-medium">Course Progress</span>
              <span className="font-bold text-primary">{completionPct}%</span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${completionPct}%` }} transition={{ duration: 1.2, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-primary to-amber-400 rounded-full" />
            </div>
            <div className="text-xs text-muted-foreground mt-1">{completedLessons.length} of {totalLessons} lessons complete</div>
          </div>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { icon: Star, label: "Total XP", value: totalXP, color: "text-primary", bg: "bg-primary/10 border-primary/20" },
          { icon: Flame, label: "Day Streak", value: progress?.streak ?? 0, color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/20" },
          { icon: Book, label: "Lessons", value: `${completedLessons.length}/${totalLessons}`, color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
          { icon: Shield, label: "Openings", value: `${completedOpenings.length}/${openings?.length ?? 0}`, color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className={`glass-panel p-4 rounded-2xl border ${s.bg} text-center`}>
            <s.icon className={`w-5 h-5 ${s.color} mx-auto mb-1.5`} />
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 glass-panel rounded-2xl border border-border/50 mb-6">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}>
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <motion.div key="overview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Completed Lessons */}
              <div className="glass-panel rounded-2xl border border-border/50 p-6">
                <h2 className="text-base font-bold mb-4 flex items-center gap-2">
                  <Book className="w-5 h-5 text-primary" /> Completed Lessons
                  <span className="ml-auto text-sm text-muted-foreground font-normal">{completedLessons.length}/{totalLessons}</span>
                </h2>
                {completedLessons.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Target className="w-10 h-10 mx-auto mb-3 opacity-40" />
                    <p className="text-sm">No lessons completed yet.</p>
                    <Link href="/lessons" className="text-primary text-sm font-medium hover:underline mt-1 inline-block">Start learning →</Link>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1 custom-scroll">
                    {completedLessons.map((lesson) => (
                      <Link key={lesson.id} href={`/lessons/${lesson.id}`}>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/5 border border-green-500/15 hover:border-green-500/30 transition-colors cursor-pointer group">
                          <div className="w-7 h-7 rounded-full bg-green-500/15 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
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
              </div>

              {/* Studied Openings */}
              <div className="glass-panel rounded-2xl border border-border/50 p-6">
                <h2 className="text-base font-bold mb-4 flex items-center gap-2">
                  <Crown className="w-5 h-5 text-primary" /> Studied Openings
                  <span className="ml-auto text-sm text-muted-foreground font-normal">{completedOpenings.length}/{openings?.length ?? 0}</span>
                </h2>
                {completedOpenings.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Crown className="w-10 h-10 mx-auto mb-3 opacity-40" />
                    <p className="text-sm">No openings studied yet.</p>
                    <Link href="/openings" className="text-primary text-sm font-medium hover:underline mt-1 inline-block">Explore openings →</Link>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {completedOpenings.map((opening) => (
                      <Link key={opening.id} href={`/openings/${opening.id}`}>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/15 hover:border-primary/30 transition-colors cursor-pointer group">
                          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 font-mono text-xs font-bold text-primary">{opening.eco}</div>
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
              </div>
            </div>

            {/* XP Breakdown */}
            <div className="glass-panel rounded-2xl border border-border/50 p-6">
              <h2 className="text-base font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" /> XP Breakdown
                <span className="ml-auto text-2xl font-bold text-primary">{totalXP} XP</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Beginner", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20", xp: completedLessons.filter(l => l.difficulty === "Beginner").length * 50 },
                  { label: "Intermediate", color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20", xp: completedLessons.filter(l => l.difficulty === "Intermediate").length * 80 },
                  { label: "Advanced", color: "text-red-400", bg: "bg-red-400/10 border-red-400/20", xp: completedLessons.filter(l => l.difficulty === "Advanced").length * 120 },
                  { label: "Study Time", color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/20", xp: completedLessons.reduce((s, l) => s + l.duration, 0), unit: "min" },
                ].map((item) => (
                  <div key={item.label} className={`p-3 rounded-xl border ${item.bg} text-center`}>
                    <div className={`text-xl font-bold ${item.color}`}>{item.xp}{item.unit ?? " XP"}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{item.label}</div>
                  </div>
                ))}
              </div>
              {completedLessons.length === 0 && (
                <p className="text-center text-sm text-muted-foreground mt-3">Complete lessons to start earning XP!</p>
              )}
            </div>

            {/* Chess Platform Accounts */}
            {((user as any).chessAccounts?.length ?? 0) > 0 && (
              <div className="glass-panel rounded-2xl border border-border/50 p-6">
                <h2 className="text-base font-bold mb-4 flex items-center gap-2">
                  ♟ Chess Platform Accounts
                </h2>
                <div className="flex flex-wrap gap-3">
                  {((user as any).chessAccounts as { platform: string; username: string }[]).map((acc, i) => {
                    const platformUrls: Record<string, string> = {
                      "Chess.com": `https://www.chess.com/member/${acc.username}`,
                      "Lichess": `https://lichess.org/@/${acc.username}`,
                      "ChessKid": `https://www.chesskid.com/member/${acc.username}`,
                      "Chess24": `https://chess24.com/en/profile/${acc.username}`,
                      "Chess Tempo": `https://chesstempo.com/chess-players/${acc.username}`,
                      "ChessBase": `https://en.chessbase.com/search?q=${acc.username}`,
                      "ICC": `https://www.chessclub.com/user/profile/${acc.username}`,
                      "Playchess": `https://play.chessbase.com/`,
                      "FIDE": `https://ratings.fide.com/search.phtml?search=${acc.username}`,
                    };
                    const url = platformUrls[acc.platform];
                    const platformColors: Record<string, string> = {
                      "Chess.com": "bg-green-500/10 border-green-500/20 text-green-400",
                      "Lichess": "bg-blue-500/10 border-blue-500/20 text-blue-400",
                      "ChessKid": "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
                      "Chess24": "bg-sky-500/10 border-sky-500/20 text-sky-400",
                      "Chess Tempo": "bg-violet-500/10 border-violet-500/20 text-violet-400",
                      "ChessBase": "bg-red-500/10 border-red-500/20 text-red-400",
                      "ICC": "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
                      "Playchess": "bg-rose-500/10 border-rose-500/20 text-rose-400",
                      "FIDE": "bg-orange-500/10 border-orange-500/20 text-orange-400",
                    };
                    const colorClass = platformColors[acc.platform] || "bg-secondary/40 border-border text-muted-foreground";
                    return (
                      <a key={i} href={url || "#"} target="_blank" rel="noopener noreferrer"
                        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border font-medium text-sm transition-all hover:scale-105 cursor-pointer ${colorClass}`}>
                        <span className="font-bold text-xs opacity-70">{acc.platform}</span>
                        <span className="font-mono">{acc.username}</span>
                        {url && <ExternalLink className="w-3 h-3 opacity-60" />}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Achievements */}
            <div className="glass-panel rounded-2xl border border-border/50 p-6">
              <h2 className="text-base font-bold mb-5 flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" /> Achievements
                <span className="ml-auto text-sm text-muted-foreground font-normal">{achievements.filter(a => a.unlocked).length}/{achievements.length} unlocked</span>
              </h2>
              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                {achievements.map((ach) => (
                  <motion.div key={ach.label} whileHover={ach.unlocked ? { scale: 1.04 } : {}}
                    className={`p-3 sm:p-4 rounded-2xl border text-center transition-all ${ach.unlocked ? "border-primary/30 bg-primary/5 shadow-sm shadow-primary/10" : "border-border bg-secondary/20 opacity-35 grayscale"}`}>
                    <div className="text-2xl sm:text-3xl mb-1.5">{ach.icon}</div>
                    <div className={`font-bold text-xs mb-0.5 ${ach.unlocked ? "text-foreground" : "text-muted-foreground"}`}>{ach.label}</div>
                    <div className="text-xs text-muted-foreground leading-tight hidden sm:block">{ach.desc}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── EDIT PROFILE TAB ── */}
        {activeTab === "edit" && (
          <motion.div key="edit" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="glass-panel rounded-2xl border border-border/50 p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2 mb-1"><Edit3 className="w-5 h-5 text-primary" /> Edit Profile</h2>
              <p className="text-sm text-muted-foreground">Update your public profile information.</p>
            </div>

            {/* Avatar Color */}
            <div>
              <label className="text-sm font-semibold text-foreground/80 block mb-3">Avatar Color</label>
              <div className="flex flex-wrap gap-3">
                {AVATAR_COLORS.map((c) => (
                  <button key={c.id} onClick={() => setAvatarColor(c.id)}
                    className={cn("w-10 h-10 rounded-full bg-gradient-to-br transition-all relative", c.from, c.to,
                      avatarColor === c.id ? "ring-2 ring-offset-2 ring-offset-background ring-white scale-110" : "hover:scale-105")}>
                    {avatarColor === c.id && <Check className="w-4 h-4 text-white absolute inset-0 m-auto" />}
                  </button>
                ))}
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${COLOR_MAP[avatarColor]?.from} ${COLOR_MAP[avatarColor]?.to} flex items-center justify-center text-white font-bold text-sm ml-2 ring-1 ring-white/20`}>
                  {(user.displayName || user.username)[0]?.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Display Name */}
            <div>
              <label className="text-sm font-semibold text-foreground/80 block mb-1.5">Display Name</label>
              <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} maxLength={40}
                disabled={!canChangeName}
                className={cn("w-full px-4 py-3 rounded-xl bg-secondary/40 border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-sm",
                  !canChangeName && "opacity-60 cursor-not-allowed")}
                placeholder="Your display name" />
              {!canChangeName && nextNameChangeAt && (
                <p className="text-xs text-amber-400 mt-1.5 flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  Name change available on {new Date(nextNameChangeAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>
              )}
              {canChangeName && (
                <p className="text-xs text-muted-foreground mt-1">You can change your display name once every 3 days.</p>
              )}
            </div>

            {/* Bio */}
            <div>
              <label className="text-sm font-semibold text-foreground/80 block mb-1.5">Bio <span className="text-muted-foreground font-normal">({bio.length}/300)</span></label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} maxLength={300} rows={3}
                className="w-full px-4 py-3 rounded-xl bg-secondary/40 border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-sm resize-none"
                placeholder="Tell others about yourself and your chess journey..." />
            </div>

            {/* Country + Preferred Side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-foreground/80 block mb-1.5 flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Country</label>
                <select value={country} onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-secondary/40 border border-border focus:outline-none focus:border-primary text-sm appearance-none cursor-pointer">
                  {COUNTRIES.map((c) => <option key={c} value={c}>{c || "Select country..."}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground/80 block mb-1.5 flex items-center gap-1.5"><Swords className="w-3.5 h-3.5" /> Preferred Side</label>
                <div className="flex gap-2">
                  {(["White", "Black", "Both"] as const).map((side) => (
                    <button key={side} onClick={() => setPreferredSide(side)}
                      className={cn("flex-1 py-3 rounded-xl text-sm font-semibold border transition-all",
                        preferredSide === side ? "border-primary bg-primary/15 text-primary" : "border-border bg-secondary/40 text-muted-foreground hover:border-primary/30")}>
                      {side === "White" ? "♔" : side === "Black" ? "♚" : "♙"} {side}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Favorite Opening */}
            <div>
              <label className="text-sm font-semibold text-foreground/80 block mb-1.5 flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> Favorite Opening</label>
              <select value={favoriteOpening} onChange={(e) => setFavoriteOpening(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-secondary/40 border border-border focus:outline-none focus:border-primary text-sm appearance-none cursor-pointer">
                <option value="">Select your favorite opening...</option>
                {OPENINGS_LIST.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            {/* Chess Accounts */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-foreground/80 flex items-center gap-1.5">
                  ♟ Chess Platform Accounts
                </label>
                {chessAccounts.length < 4 && (
                  <button onClick={addChessAccount}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-colors font-semibold">
                    <Plus className="w-3 h-3" /> Add Account
                  </button>
                )}
              </div>
              {chessAccounts.length === 0 && (
                <p className="text-sm text-muted-foreground italic py-2">No chess accounts linked yet. Add your chess.com or lichess username!</p>
              )}
              <div className="space-y-2.5">
                {chessAccounts.map((acc, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <select value={acc.platform} onChange={(e) => updateChessAccount(i, "platform", e.target.value)}
                      className="px-3 py-2.5 rounded-xl bg-secondary/40 border border-border focus:outline-none focus:border-primary text-sm appearance-none cursor-pointer shrink-0 w-36">
                      {["Chess.com", "Lichess", "ChessKid", "Chess24", "Chess Tempo", "ChessBase", "ICC", "Playchess", "FIDE", "Other"].map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <input value={acc.username} onChange={(e) => updateChessAccount(i, "username", e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-secondary/40 border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-sm"
                      placeholder="Your username on that platform" maxLength={50} />
                    <button onClick={() => removeChessAccount(i)}
                      className="p-2.5 rounded-xl text-muted-foreground hover:text-red-400 hover:bg-red-400/10 border border-border hover:border-red-400/20 transition-all shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">These will be shown on your profile and the leaderboard for other players to see.</p>
            </div>

            {/* Leaderboard Privacy */}
            <div className="p-4 rounded-2xl bg-secondary/30 border border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">Hide from Leaderboard</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Your profile won't appear in the public rankings</p>
                </div>
                <button onClick={() => setHideLeaderboard(!hideLeaderboard)}
                  className={cn(
                    "relative w-12 h-6 rounded-full border-2 transition-all duration-300 focus:outline-none",
                    hideLeaderboard
                      ? "bg-primary border-primary"
                      : "bg-secondary border-border"
                  )}>
                  <span className={cn(
                    "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300",
                    hideLeaderboard ? "translate-x-6" : "translate-x-0"
                  )} />
                </button>
              </div>
              {hideLeaderboard && (
                <p className="text-xs text-amber-400 mt-2 flex items-center gap-1.5">
                  <EyeOff className="w-3 h-3" /> You are hidden from the leaderboard. Only you can still see your own entry.
                </p>
              )}
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-2 border-t border-border/40">
              <button onClick={handleSaveProfile} disabled={updateProfile.isPending}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                {updateProfile.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </button>
            </div>
          </motion.div>
        )}

        {/* ── SECURITY TAB ── */}
        {activeTab === "security" && (
          <motion.div key="security" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="space-y-5">

            {/* Account Info */}
            <div className="glass-panel rounded-2xl border border-border/50 p-6">
              <h2 className="text-base font-bold flex items-center gap-2 mb-4"><User className="w-5 h-5 text-primary" /> Account Details</h2>
              <div className="space-y-3 text-sm">
                {[
                  { label: "Username", value: `@${user.username}` },
                  { label: "Email", value: user.email },
                  { label: "Member Since", value: new Date(user.joinedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) },
                  { label: "Account Level", value: user.level },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center py-2.5 border-b border-border/30 last:border-0">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Change Password */}
            <div className="glass-panel rounded-2xl border border-border/50 p-6">
              <h2 className="text-base font-bold flex items-center gap-2 mb-1"><Lock className="w-5 h-5 text-primary" /> Change Password</h2>
              <p className="text-sm text-muted-foreground mb-5">Use a strong password that you don't use elsewhere.</p>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-foreground/80 block mb-1.5">Current Password</label>
                  <div className="relative">
                    <input type={showCurrent ? "text" : "password"} value={currentPw} onChange={(e) => setCurrentPw(e.target.value)}
                      className="w-full px-4 py-3 pr-11 rounded-xl bg-secondary/40 border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-sm"
                      placeholder="Enter current password" />
                    <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground/80 block mb-1.5">New Password</label>
                  <div className="relative">
                    <input type={showNew ? "text" : "password"} value={newPw} onChange={(e) => setNewPw(e.target.value)}
                      className="w-full px-4 py-3 pr-11 rounded-xl bg-secondary/40 border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-sm"
                      placeholder="Minimum 6 characters" />
                    <button type="button" onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {newPw && newPw.length < 6 && (
                    <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> At least 6 characters required</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground/80 block mb-1.5">Confirm New Password</label>
                  <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-secondary/40 border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-sm"
                    placeholder="Repeat new password" />
                  {confirmPw && newPw !== confirmPw && (
                    <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Passwords don't match</p>
                  )}
                  {confirmPw && newPw === confirmPw && newPw.length >= 6 && (
                    <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Passwords match</p>
                  )}
                </div>

                <div className="flex justify-end pt-2 border-t border-border/40">
                  <button onClick={handleChangePassword} disabled={changePassword.isPending || !currentPw || !newPw || !confirmPw}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                    {changePassword.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                    Update Password
                  </button>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="glass-panel rounded-2xl border border-red-500/20 p-6">
              <h2 className="text-base font-bold flex items-center gap-2 mb-1 text-red-400"><AlertCircle className="w-5 h-5" /> Danger Zone</h2>
              <p className="text-sm text-muted-foreground mb-4">Permanently log out from all sessions.</p>
              <button onClick={() => { logout(); setLocation("/"); }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium">
                <LogOut className="w-4 h-4" /> Log Out of Account
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
