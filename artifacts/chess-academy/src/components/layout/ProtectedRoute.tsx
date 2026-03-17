import { useEffect } from "react";
import { useLocation } from "wouter";
import { useUser, useAuthStore } from "@/hooks/use-auth";
import { Loader2, Lock, Crown } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

interface ProtectedRouteProps {
  component: React.ComponentType;
}

export function ProtectedRoute({ component: Component }: ProtectedRouteProps) {
  const token = useAuthStore((state) => state.token);
  const { data: user, isLoading } = useUser();
  const [, setLocation] = useLocation();

  if (!token) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-primary/20">
            <Lock className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-display font-bold mb-3">Members Only</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            This content is exclusive to Chess Academy members. Log in or create a free account to continue your journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/login"
              className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="px-6 py-3 rounded-xl font-semibold glass-panel border border-primary/20 text-foreground hover:bg-secondary transition-all"
            >
              Create Account
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return <Component />;
}
