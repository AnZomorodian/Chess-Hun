import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Loader2, Eye, EyeOff, Users, BookOpen,
  ChevronUp, ChevronDown, LogOut, Crown, Star, Award,
  BarChart2, Trash2, Ban, CheckCircle2, RotateCcw,
  AlertTriangle, X, StickyNote, Search,
} from "lucide-react";
import {
  useAdminLogin, useAdminStore, useAdminUsers, useAdminStats,
  useAdminDeleteUser, useAdminBanUser, useAdminUnbanUser, useAdminResetProgress,
} from "@/hooks/use-admin";
import { useToast } from "@/hooks/use-toast";

type SortKey = "username" | "rating" | "lessonsCompleted" | "openingsStudied" | "joinedAt" | "level";
type SortDir = "asc" | "desc";

const LEVEL_COLORS: Record<string, string> = {
  Beginner: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  Intermediate: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  Advanced: "text-purple-400 bg-purple-400/10 border-purple-400/30",
  Expert: "text-primary bg-primary/10 border-primary/30",
  Master: "text-accent bg-accent/10 border-accent/30",
};

interface ConfirmModal {
  type: "ban" | "delete" | "reset";
  userId: string;
  username: string;
}

export default function Admin() {
  const { token, logout } = useAdminStore();
  const { toast } = useToast();
  const loginMutation = useAdminLogin();
  const { data: usersData, isLoading: usersLoading } = useAdminUsers();
  const { data: stats } = useAdminStats();

  const deleteMutation = useAdminDeleteUser();
  const banMutation = useAdminBanUser();
  const unbanMutation = useAdminUnbanUser();
  const resetMutation = useAdminResetProgress();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("joinedAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [confirmModal, setConfirmModal] = useState<ConfirmModal | null>(null);
  const [banReason, setBanReason] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ username, password }, {
      onSuccess: () => toast({ title: "Admin Access Granted", description: "Welcome to the control panel." }),
      onError: (err) => toast({ variant: "destructive", title: "Access Denied", description: err.message }),
    });
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronUp className="w-3 h-3 opacity-20" />;
    return sortDir === "asc" ? <ChevronUp className="w-3 h-3 text-primary" /> : <ChevronDown className="w-3 h-3 text-primary" />;
  };

  const filteredUsers = (usersData?.users ?? [])
    .filter((u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.displayName.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const av = a[sortKey as keyof typeof a];
      const bv = b[sortKey as keyof typeof b];
      const cmp = typeof av === "number" && typeof bv === "number"
        ? av - bv
        : String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });

  const handleConfirm = () => {
    if (!confirmModal) return;
    const { type, userId, username: uname } = confirmModal;
    if (type === "delete") {
      deleteMutation.mutate(userId, {
        onSuccess: () => { toast({ title: "User Deleted", description: `"${uname}" has been permanently removed.` }); setConfirmModal(null); },
        onError: () => toast({ variant: "destructive", title: "Error", description: "Failed to delete user." }),
      });
    } else if (type === "ban") {
      banMutation.mutate({ userId, reason: banReason || "Violated community guidelines" }, {
        onSuccess: () => { toast({ title: "User Banned", description: `"${uname}" has been banned.` }); setConfirmModal(null); setBanReason(""); },
        onError: () => toast({ variant: "destructive", title: "Error", description: "Failed to ban user." }),
      });
    } else if (type === "reset") {
      resetMutation.mutate(userId, {
        onSuccess: () => { toast({ title: "Progress Reset", description: `"${uname}"'s progress has been reset.` }); setConfirmModal(null); },
        onError: () => toast({ variant: "destructive", title: "Error", description: "Failed to reset progress." }),
      });
    }
  };

  const handleUnban = (userId: string, uname: string) => {
    unbanMutation.mutate(userId, {
      onSuccess: () => toast({ title: "User Unbanned", description: `"${uname}" can now access the academy.` }),
      onError: () => toast({ variant: "destructive", title: "Error", description: "Failed to unban user." }),
    });
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 blur-[150px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-accent/5 blur-[150px] rounded-full" />
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm relative z-10">
          <div className="glass-panel rounded-3xl p-8 border border-primary/10 shadow-2xl shadow-black/50">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/30 flex items-center justify-center mb-4 shadow-lg shadow-primary/10">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-display font-bold mb-1">Admin Panel</h1>
              <p className="text-sm text-muted-foreground">Restricted access only</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground/80">Username</label>
                <input value={username} onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-secondary/40 border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-sm placeholder:text-muted-foreground/40"
                  placeholder="Admin username" autoComplete="off" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground/80">Password</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-11 rounded-xl bg-secondary/40 border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-sm placeholder:text-muted-foreground/40"
                    placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loginMutation.isPending}
                className="w-full py-3.5 mt-2 rounded-xl font-bold text-primary-foreground bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2 text-sm">
                {loginMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Shield className="w-4 h-4" /> Enter Control Panel</>}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/30 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold">Admin Control Panel</h1>
              <p className="text-sm text-muted-foreground">Chess Academy Management</p>
            </div>
          </div>
          <button onClick={logout} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors text-sm font-medium">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </motion.div>

        {/* Stats Cards */}
        {stats && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {[
              { icon: Users, label: "Total Members", value: stats.totalUsers, color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
              { icon: Star, label: "Avg Rating", value: stats.avgRating, color: "text-primary", bg: "bg-primary/10 border-primary/20" },
              { icon: BookOpen, label: "Lessons Done", value: stats.totalLessonsCompleted, color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/20" },
              { icon: Award, label: "Openings Studied", value: stats.totalOpeningsStudied, color: "text-accent", bg: "bg-accent/10 border-accent/20" },
              { icon: Ban, label: "Banned Users", value: stats.bannedUsers, color: "text-red-400", bg: "bg-red-400/10 border-red-400/20" },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.05 }}
                className={`glass-panel rounded-2xl p-5 border ${stat.bg}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.bg}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className={`text-3xl font-bold mb-1 ${stat.color}`}>{stat.value.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Level Distribution */}
        {stats && Object.keys(stats.levelCounts).length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="glass-panel rounded-2xl p-6 border border-border/50 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground">Player Level Distribution</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {Object.entries(stats.levelCounts).map(([level, count]) => (
                <div key={level} className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium ${LEVEL_COLORS[level] ?? "text-muted-foreground bg-secondary border-border"}`}>
                  <Crown className="w-3.5 h-3.5" />{level}: <span className="font-bold">{count}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Users Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="glass-panel rounded-2xl border border-border/50 overflow-hidden">
          <div className="p-6 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground">
                Registered Members
                {usersData && <span className="ml-2 text-sm text-muted-foreground font-normal">({usersData.total})</span>}
              </h2>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search members..."
                className="pl-9 pr-4 py-2 rounded-xl bg-secondary/50 border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 text-sm transition-all w-full sm:w-64 placeholder:text-muted-foreground/50" />
            </div>
          </div>

          {usersLoading ? (
            <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Users className="w-12 h-12 mb-3 opacity-30" />
              <p>{search ? "No users match your search." : "No users registered yet."}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-secondary/20">
                    {[
                      { key: "username" as SortKey, label: "Member" },
                      { key: "level" as SortKey, label: "Level" },
                      { key: "rating" as SortKey, label: "Rating" },
                      { key: "lessonsCompleted" as SortKey, label: "Lessons" },
                      { key: "openingsStudied" as SortKey, label: "Openings" },
                      { key: "joinedAt" as SortKey, label: "Joined" },
                    ].map((col) => (
                      <th key={col.key} onClick={() => handleSort(col.key)}
                        className="px-4 py-3.5 text-left font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors select-none">
                        <div className="flex items-center gap-1.5">{col.label}<SortIcon col={col.key} /></div>
                      </th>
                    ))}
                    <th className="px-4 py-3.5 text-left font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredUsers.map((user, i) => (
                      <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                        className={`border-b border-border/30 hover:bg-secondary/20 transition-colors ${user.isBanned ? "opacity-60" : ""}`}>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-black font-bold text-xs flex-shrink-0
                              ${user.isBanned ? "bg-red-400/50" : "bg-gradient-to-br from-primary to-amber-400"}`}>
                              {(user.displayName || user.username)[0]?.toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-medium text-foreground">{user.displayName || user.username}</span>
                                {user.isBanned && (
                                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20 font-medium">Banned</span>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${LEVEL_COLORS[user.level] ?? "text-muted-foreground bg-secondary border-border"}`}>
                            {user.level}
                          </span>
                        </td>
                        <td className="px-4 py-3.5"><span className="font-mono font-semibold text-primary">{user.rating}</span></td>
                        <td className="px-4 py-3.5 text-muted-foreground">{user.lessonsCompleted}</td>
                        <td className="px-4 py-3.5 text-muted-foreground">{user.openingsStudied}</td>
                        <td className="px-4 py-3.5 text-muted-foreground text-xs">
                          {new Date(user.joinedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            {user.isBanned ? (
                              <button onClick={() => handleUnban(user.id, user.username)} title="Unban user"
                                className="p-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors" disabled={unbanMutation.isPending}>
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            ) : (
                              <button onClick={() => { setConfirmModal({ type: "ban", userId: user.id, username: user.username }); setBanReason(""); }}
                                title="Ban user" className="p-1.5 rounded-lg bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition-colors">
                                <Ban className="w-4 h-4" />
                              </button>
                            )}
                            <button onClick={() => setConfirmModal({ type: "reset", userId: user.id, username: user.username })}
                              title="Reset progress" className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors">
                              <RotateCcw className="w-4 h-4" />
                            </button>
                            <button onClick={() => setConfirmModal({ type: "delete", userId: user.id, username: user.username })}
                              title="Delete user" className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      {/* Confirm Modal */}
      <AnimatePresence>
        {confirmModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setConfirmModal(null); }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                    ${confirmModal.type === "delete" ? "bg-red-500/15 text-red-400"
                      : confirmModal.type === "ban" ? "bg-yellow-500/15 text-yellow-400"
                      : "bg-blue-500/15 text-blue-400"}`}>
                    {confirmModal.type === "delete" ? <Trash2 className="w-5 h-5" />
                      : confirmModal.type === "ban" ? <Ban className="w-5 h-5" />
                      : <RotateCcw className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">
                      {confirmModal.type === "delete" ? "Delete User"
                        : confirmModal.type === "ban" ? "Ban User"
                        : "Reset Progress"}
                    </h3>
                    <p className="text-sm text-muted-foreground">@{confirmModal.username}</p>
                  </div>
                </div>
                <button onClick={() => setConfirmModal(null)} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                {confirmModal.type === "delete"
                  ? `This will permanently delete "${confirmModal.username}" and all their data. This action cannot be undone.`
                  : confirmModal.type === "ban"
                  ? `Ban "${confirmModal.username}" from accessing the academy. You can unban them at any time.`
                  : `Reset "${confirmModal.username}"'s rating to 800 and clear their completed lessons and openings.`}
              </p>

              {confirmModal.type === "ban" && (
                <div className="mb-4">
                  <label className="text-sm font-medium text-foreground/80 mb-1.5 block">Ban Reason (optional)</label>
                  <input value={banReason} onChange={(e) => setBanReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border focus:outline-none focus:border-primary text-sm"
                    placeholder="Violated community guidelines..." />
                </div>
              )}

              {confirmModal.type === "delete" && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-4">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <p className="text-xs text-red-400">This action is permanent and irreversible.</p>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setConfirmModal(null)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors text-sm font-medium">
                  Cancel
                </button>
                <button onClick={handleConfirm} disabled={deleteMutation.isPending || banMutation.isPending || resetMutation.isPending}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50
                    ${confirmModal.type === "delete" ? "bg-red-500 hover:bg-red-600 text-white"
                      : confirmModal.type === "ban" ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                      : "bg-blue-500 hover:bg-blue-600 text-white"}`}>
                  {(deleteMutation.isPending || banMutation.isPending || resetMutation.isPending) && <Loader2 className="w-4 h-4 animate-spin" />}
                  {confirmModal.type === "delete" ? "Delete" : confirmModal.type === "ban" ? "Ban User" : "Reset Progress"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
