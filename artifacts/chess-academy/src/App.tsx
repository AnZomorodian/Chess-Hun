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
import NotFound from "./pages/not-found";
import Profile from "./pages/profile";
import { Navbar } from "./components/layout/Navbar";

function Router() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/openings" component={Openings} />
          <Route path="/openings/:id" component={OpeningDetail} />
          <Route path="/lessons" component={Lessons} />
          <Route path="/lessons/:id" component={LessonDetail} />
          <Route path="/profile" component={Profile} />
          <Route component={NotFound} />
        </Switch>
      </main>
      
      {/* Simple elegant footer */}
      <footer className="border-t border-border bg-card/50 py-8 text-center text-sm text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} Chess Academy. The Royal Game Mastered.</p>
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
