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
import Admin from "./pages/admin";
import Leaderboard from "./pages/leaderboard";
import { Navbar } from "./components/layout/Navbar";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";

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
          <Route component={NotFound} />
        </Switch>
      </main>

      <footer className="border-t border-border/40 bg-card/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-primary text-lg">♔</span>
                <span className="font-display font-bold text-foreground tracking-wider">CHESS ACADEMY</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Master the royal game through structured lessons, famous openings, and deadly traps.
              </p>
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
                {[["Log In", "/login"], ["Register", "/register"], ["Profile", "/profile"]].map(([label, href]) => (
                  <a key={href} href={href} className="text-sm text-muted-foreground hover:text-primary transition-colors w-fit">{label}</a>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-border/40 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground/60">© {new Date().getFullYear()} Chess Academy. All rights reserved.</p>
            <p className="text-xs text-muted-foreground/60">The Royal Game Mastered.</p>
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
