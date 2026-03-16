import { Link, useLocation } from "wouter";
import { useAuthStore, useUser } from "@/hooks/use-auth";
import { Crown, LogOut, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [location] = useLocation();
  const { data: user } = useUser();
  const logout = useAuthStore(state => state.logout);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/openings", label: "Openings" },
    { href: "/lessons", label: "Lessons" },
    ...(user ? [{ href: "/dashboard", label: "Dashboard" }] : []),
  ];

  const avatarInitial = (user?.displayName || user?.username)?.[0]?.toUpperCase() ?? "?";

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b-0 border-x-0 rounded-none bg-background/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Crown className="w-6 h-6 text-primary" />
            </div>
            <span className="font-display font-bold text-xl tracking-wider text-foreground group-hover:gold-gradient-text transition-all">
              CHESS ACADEMY
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location === link.href ? "text-primary gold-gradient-text" : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/profile" className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-amber-400 border border-primary/30 flex items-center justify-center text-black font-bold text-xs group-hover:ring-2 group-hover:ring-primary/30 transition-all">
                    {avatarInitial}
                  </div>
                  <span className="font-medium text-foreground">{user.username}</span>
                  <span className="px-2 py-0.5 rounded-full bg-secondary text-xs text-primary border border-primary/20">
                    {user.rating} ELO
                  </span>
                </Link>
                <button
                  onClick={() => logout()}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                  Log In
                </Link>
                <Link 
                  href="/register" 
                  className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
                >
                  Start Playing
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-foreground"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-panel border-t border-border/50"
          >
            <div className="px-4 pt-2 pb-6 space-y-4 flex flex-col">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium",
                    location === link.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-border/50 flex flex-col space-y-3">
                {user ? (
                  <>
                    <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-amber-400 flex items-center justify-center text-black font-bold">
                        {avatarInitial}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{user.displayName || user.username}</div>
                        <div className="text-sm text-primary">{user.rating} ELO · View Profile</div>
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 px-3 py-2 text-destructive font-medium"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Log Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/login" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 text-base font-medium text-foreground"
                    >
                      Log In
                    </Link>
                    <Link 
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-center font-semibold bg-gradient-to-r from-primary to-accent text-primary-foreground"
                    >
                      Start Playing
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
