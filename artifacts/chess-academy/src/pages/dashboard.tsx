import { useUser } from "@/hooks/use-auth";
import { useProgress, useLessons } from "@/hooks/use-chess";
import { Link, Redirect } from "wouter";
import { motion } from "framer-motion";
import { Trophy, Flame, Book, Shield, Activity, Star } from "lucide-react";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: user, isLoading: userLoading } = useUser();
  const { data: progress, isLoading: progressLoading } = useProgress();
  const { data: lessons, isLoading: lessonsLoading } = useLessons();

  if (userLoading || progressLoading || lessonsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Activity className="w-8 h-8 text-primary animate-pulse" />
      </div>
    );
  }

  if (!user) return <Redirect href="/login" />;

  const completedCount = progress?.completedLessons?.length || 0;
  const totalLessons = lessons?.length || 1;
  const completionPercentage = Math.round((completedCount / totalLessons) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header Profile */}
      <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-12 gap-6">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 rounded-full glass-panel flex items-center justify-center border-2 border-primary">
            <Trophy className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold gold-gradient-text">
              {user.displayName || user.username}
            </h1>
            <p className="text-muted-foreground">Level: {user.level} • Joined {user.joinedAt ? format(new Date(user.joinedAt), 'MMM yyyy') : 'Recently'}</p>
          </div>
        </div>
        <Link 
          href="/lessons"
          className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:-translate-y-1 transition-transform shadow-lg shadow-primary/20"
        >
          Resume Learning
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { icon: Star, label: "Total Points", value: progress?.totalPoints || 0, color: "text-yellow-400" },
          { icon: Flame, label: "Day Streak", value: progress?.streak || 0, color: "text-orange-500" },
          { icon: Book, label: "Lessons Done", value: completedCount, color: "text-blue-400" },
          { icon: Shield, label: "Openings Studied", value: progress?.completedOpenings?.length || 0, color: "text-green-400" }
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label} 
            className="glass-panel p-6 rounded-2xl flex items-center space-x-4"
          >
            <div className={`p-3 rounded-xl bg-secondary ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold font-display">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Course Progress */}
        <div className="lg:col-span-2 glass-panel p-8 rounded-2xl">
          <h2 className="text-xl font-display font-bold mb-6 flex items-center">
            <Book className="w-5 h-5 mr-2 text-primary" /> Course Progress
          </h2>
          
          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Overall Completion</span>
              <span className="font-bold text-primary">{completionPercentage}%</span>
            </div>
            <div className="w-full h-3 bg-secondary rounded-full overflow-hidden border border-border/50">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-primary to-accent"
              />
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-4">Recommended Next Lessons</h3>
          <div className="space-y-4">
            {lessons?.slice(0, 3).map((lesson) => {
              const isCompleted = progress?.completedLessons?.includes(lesson.id);
              return (
                <Link 
                  key={lesson.id} 
                  href={`/lessons/${lesson.id}`}
                  className="block glass-panel p-4 rounded-xl border border-border/30 hover:border-primary/50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{lesson.title}</h4>
                      <div className="text-sm text-muted-foreground">{lesson.category} • {lesson.difficulty}</div>
                    </div>
                    {isCompleted ? (
                      <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-bold border border-green-500/20">Completed</span>
                    ) : (
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold border border-primary/20">Start</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity (Placeholder for UI completeness) */}
        <div className="glass-panel p-8 rounded-2xl h-fit">
          <h2 className="text-xl font-display font-bold mb-6 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-primary" /> Activity Log
          </h2>
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
            {/* Fake activity items for visual polish */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-8 h-8 rounded-full border border-border bg-card shrink-0 z-10 text-primary">
                <Trophy className="w-4 h-4" />
              </div>
              <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl glass-panel">
                <div className="text-sm font-bold text-primary mb-1">Yesterday</div>
                <div className="text-sm text-muted-foreground">Earned 50 points from tactics</div>
              </div>
            </div>
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-8 h-8 rounded-full border border-border bg-card shrink-0 z-10 text-accent">
                <Book className="w-4 h-4" />
              </div>
              <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl glass-panel">
                <div className="text-sm font-bold text-accent mb-1">2 days ago</div>
                <div className="text-sm text-muted-foreground">Completed "The Pin"</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
