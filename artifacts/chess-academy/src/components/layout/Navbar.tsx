import { Link, useLocation } from "wouter";
import { useAuthStore, useUser } from "@/hooks/use-auth";
import { Crown, LogOut, Menu, X, Trophy, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation as useWouterLocation } from "wouter";

const AVATAR_COLORS: Record<string, { from: string; to: string }> = {
  gold: { from: "from-yellow-500", to: "to-amber-400" },
  royal: { from: "from-violet-600", to: "to-purple-500" },
  emerald: { from: "from-emerald-500", to: "to-teal-400" },
  crimson: { from: "from-rose-600", to: "to-red-500" },
  ocean: { from: "from-blue-600", to: "to-cyan-500" },
  midnight: { from: "from-slate-700", to: "to-slate-500" },
};

export function Navbar() {
  const [location] = useLocation();
  const { data: user } = useUser();
  const logout = useAuthStore(state => state.logout);
  const [, setLocation] = useWouterLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/openings", label: "Openings" },
    { href: "/lessons", label: "Lessons" },
    { href: "/traps", label: "Traps" },
    { href: "/leaderboard", label: "Leaderboard" },
    ...(user ? [{ href: "/dashboard", label: "Dashboard" }] : []),
  ];

  const avatarInitial = (user?.displayName || user?.username)?.[0]?.toUpperCase() ?? "?";
  const avatarColor = (user as any)?.avatarColor ?? "gold";
  const colors = AVATAR_COLORS[avatarColor] ?? AVATAR_COLORS["gold"];

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b-0 border-x-0 rounded-none bg-background/80 backdrop-blur-xl border-b border-border/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18 py-3">

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors border border-primary/20">
              <Crown className="w-5 h-5 text-primary" />
            </div>
            <span className="font-display font-bold text-lg tracking-wider text-foreground group-hover:text-primary transition-colors">
              CHESS ACADEMY
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  location === link.href
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-2">
                <Link href="/profile"
                  className="flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-secondary/60 transition-colors group">
                  <div className={cn(
                    "w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold text-xs shadow-md transition-all group-hover:ring-2 group-hover:ring-primary/40",
                    colors.from, colors.to
                  )}>
                    {avatarInitial}
                  </div>
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-sm font-semibold text-foreground leading-snug">{user.displayName || user.username}</span>
                    <span className="text-xs text-primary font-medium">{user.rating} ELO</span>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors">
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
                >
                  Start Playing
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground rounded-lg hover:bg-secondary/60 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/30 bg-background/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    location === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-3 border-t border-border/30 mt-3">
                {user ? (
                  <>
                    <Link href="/profile" onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary/60 transition-colors mb-1">
                      <div className={cn("w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold shadow-md", colors.from, colors.to)}>
                        {avatarInitial}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-foreground">{user.displayName || user.username}</div>
                        <div className="text-xs text-primary">{user.rating} ELO · View Profile</div>
                      </div>
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-destructive font-medium rounded-xl hover:bg-destructive/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Log Out
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-3 text-sm font-medium text-center text-foreground rounded-xl hover:bg-secondary transition-colors">
                      Log In
                    </Link>
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-3 rounded-xl text-center text-sm font-bold bg-gradient-to-r from-primary to-accent text-primary-foreground">
                      Start Playing
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
