import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "@/lib/query-client";

import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Openings from "./pages/openings";
import OpeningDetail from "./pages/opening-detail";
import Lessons from "./pages/lessons";
import LessonDetail from "./pages/lesson-detail";
import Traps from "./pages/traps";
import TrapDetail from "./pages/trap-detail";
import NotFound from "./pages/not-found";
import Profile from "./pages/profile";
import PublicProfile from "./pages/public-profile";
import Admin from "./pages/admin";
import Leaderboard from "./pages/leaderboard";
import { Navbar } from "./components/layout/Navbar";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.8 13.9l-2.956-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.95l.35-.29z"/>
    </svg>
  );
}

function Router() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/admin" component={Admin} />
          <Route path="/dashboard">
            <ProtectedRoute component={Dashboard} />
          </Route>
          <Route path="/openings">
            <ProtectedRoute component={Openings} />
          </Route>
          <Route path="/openings/:id">
            <ProtectedRoute component={OpeningDetail} />
          </Route>
          <Route path="/lessons">
            <ProtectedRoute component={Lessons} />
          </Route>
          <Route path="/lessons/:id">
            <ProtectedRoute component={LessonDetail} />
          </Route>
          <Route path="/profile">
            <ProtectedRoute component={Profile} />
          </Route>
          <Route path="/traps">
            <ProtectedRoute component={Traps} />
          </Route>
          <Route path="/traps/:id">
            <ProtectedRoute component={TrapDetail} />
          </Route>
          <Route path="/leaderboard" component={Leaderboard} />
          <Route path="/users/:id" component={PublicProfile} />
          <Route component={NotFound} />
        </Switch>
      </main>

      <footer className="border-t border-border/40 bg-card/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="sm:col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-primary text-lg">♔</span>
                <span className="font-display font-bold text-foreground tracking-wider">CHESS ACADEMY</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Master the royal game through structured lessons, famous openings, and deadly traps.
              </p>
              <div className="flex items-center gap-3">
                <a href="https://t.me/ArtinZomorodian" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#229ED9]/10 border border-[#229ED9]/20 text-[#229ED9] hover:bg-[#229ED9]/20 transition-colors text-xs font-medium">
                  <TelegramIcon className="w-4 h-4" />
                  Telegram
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Learn</h4>
              <div className="flex flex-col gap-2">
                {[["Lessons", "/lessons"], ["Openings", "/openings"], ["Traps", "/traps"], ["Dashboard", "/dashboard"]].map(([label, href]) => (
                  <a key={href} href={href} className="text-sm text-muted-foreground hover:text-primary transition-colors w-fit">{label}</a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Account</h4>
              <div className="flex flex-col gap-2">
                {[["Log In", "/login"], ["Register", "/register"], ["Profile", "/profile"], ["Leaderboard", "/leaderboard"]].map(([label, href]) => (
                  <a key={href} href={href} className="text-sm text-muted-foreground hover:text-primary transition-colors w-fit">{label}</a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">About</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Designed & developed by
              </p>
              <p className="text-sm font-semibold text-primary mt-1">Artin Zomorodian</p>
            </div>
          </div>
          <div className="border-t border-border/40 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground/60">© {new Date().getFullYear()} Chess Academy. All rights reserved.</p>
            <p className="text-xs text-muted-foreground/60">Design By <span className="text-primary font-medium">Artin Zomorodian</span></p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
