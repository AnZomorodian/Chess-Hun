import { Link } from "wouter";
import { motion } from "framer-motion";
import { ChevronRight, Award, BookOpen, Swords } from "lucide-react";
import { ChessBoard } from "@/components/chess/ChessBoard";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
            alt="Luxurious chess background" 
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-panel mb-6">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">Master the Royal Game</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6">
                Elevate Your <br />
                <span className="gold-gradient-text">Chess Strategy</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
                Join the most exclusive chess academy. Learn grandmaster openings, master complex tactics, and track your elegant journey to chess mastery.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                <Link 
                  href="/register"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-primary-foreground bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group"
                >
                  Start Your Journey
                  <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/openings"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-foreground glass-panel hover:bg-secondary transition-all duration-300 flex items-center justify-center"
                >
                  Explore Openings
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="relative"
            >
              {/* Decorative glows behind board */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
              
              <div className="relative transform rotate-3 hover:rotate-0 transition-transform duration-700 ease-out">
                <ChessBoard 
                  interactive={false} 
                  fen="r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3" 
                />
                
                {/* Floating UI elements */}
                <div className="absolute -bottom-6 -left-6 glass-panel p-4 rounded-2xl animate-bounce" style={{ animationDuration: '3s' }}>
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
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-secondary/50 relative border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">A Premium Learning Experience</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Designed for players who appreciate the beauty and depth of chess.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: "Curated Openings", desc: "Interactive database of openings with deep explanations of key ideas." },
              { icon: Swords, title: "Tactical Lessons", desc: "Step-by-step masterclasses from basic checkmates to advanced positional play." },
              { icon: Award, title: "Progress Tracking", desc: "Earn points, maintain streaks, and watch your elegant profile level up." }
            ].map((feat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="glass-panel p-8 rounded-2xl premium-hover"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary border border-primary/20">
                  <feat.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-display font-bold mb-3">{feat.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
