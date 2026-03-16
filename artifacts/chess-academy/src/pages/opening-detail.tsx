import { useOpening } from "@/hooks/use-chess";
import { useParams, Link } from "wouter";
import { ChessBoard } from "@/components/chess/ChessBoard";
import { ArrowLeft, BookOpen, Info, ShieldAlert } from "lucide-react";
import { Chess } from "chess.js";
import { useState, useEffect, useMemo } from "react";

export default function OpeningDetail() {
  const { id } = useParams();
  const { data: opening, isLoading } = useOpening(id || "");
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);

  // Generate FEN sequence based on moves
  const fens = useMemo(() => {
    if (!opening?.moves) return ['start'];
    const game = new Chess();
    const positions = ['start'];
    
    opening.moves.forEach(moveStr => {
      try {
        // Handle moves like "1. e4" vs just "e4"
        const cleanMove = moveStr.replace(/^\d+\.\s*/, '');
        game.move(cleanMove);
        positions.push(game.fen());
      } catch (e) {
        console.warn(`Invalid move in sequence: ${moveStr}`);
      }
    });
    return positions;
  }, [opening]);

  useEffect(() => {
    setCurrentMoveIndex(0);
  }, [opening]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-primary">Loading...</div>;
  }

  if (!opening) {
    return <div className="text-center py-20 text-xl text-muted-foreground">Opening not found.</div>;
  }

  const handleNext = () => {
    if (currentMoveIndex < fens.length - 1) setCurrentMoveIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentMoveIndex > 0) setCurrentMoveIndex(prev => prev - 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/openings" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Library
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Col: Info */}
        <div>
          <div className="flex items-center space-x-4 mb-4">
            <span className="px-3 py-1 rounded-md bg-secondary border border-border text-sm font-bold font-mono">
              {opening.eco}
            </span>
            <span className="px-3 py-1 rounded-md bg-primary/10 text-primary text-sm font-semibold border border-primary/20">
              {opening.category}
            </span>
          </div>
          
          <h1 className="text-4xl font-display font-bold mb-6 gold-gradient-text">{opening.name}</h1>
          
          <div className="glass-panel p-6 rounded-2xl mb-8">
            <h3 className="text-lg font-bold mb-2 flex items-center text-foreground">
              <Info className="w-5 h-5 mr-2 text-primary" /> Description
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {opening.description}
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-lg font-bold mb-4 flex items-center text-foreground">
              <BookOpen className="w-5 h-5 mr-2 text-primary" /> Key Ideas
            </h3>
            <ul className="space-y-3">
              {opening.keyIdeas?.map((idea, i) => (
                <li key={i} className="flex items-start">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0 mr-3" />
                  <span className="text-muted-foreground">{idea}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Col: Board */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-md mb-6">
            <ChessBoard 
              fen={fens[currentMoveIndex]} 
              interactive={false} 
            />
          </div>

          {/* Controls */}
          <div className="w-full max-w-md glass-panel p-4 rounded-xl flex flex-col items-center">
            <div className="flex justify-between items-center w-full mb-4 px-4">
              <span className="text-sm font-medium text-muted-foreground">
                Move {Math.floor(currentMoveIndex / 2) + 1}
              </span>
              <span className="text-sm font-bold font-mono text-primary">
                {currentMoveIndex > 0 ? opening.moves[currentMoveIndex - 1] : "Start Position"}
              </span>
            </div>
            
            <div className="flex space-x-4 w-full">
              <button 
                onClick={() => setCurrentMoveIndex(0)}
                disabled={currentMoveIndex === 0}
                className="flex-1 py-2 rounded-lg bg-secondary text-foreground hover:bg-secondary/80 disabled:opacity-50 transition-colors"
              >
                Reset
              </button>
              <button 
                onClick={handlePrev}
                disabled={currentMoveIndex === 0}
                className="flex-1 py-2 rounded-lg bg-secondary text-foreground hover:bg-secondary/80 disabled:opacity-50 transition-colors"
              >
                Prev
              </button>
              <button 
                onClick={handleNext}
                disabled={currentMoveIndex === fens.length - 1}
                className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 font-bold transition-colors"
              >
                Next
              </button>
            </div>
          </div>

          {/* Sequence Tape */}
          <div className="w-full max-w-md mt-6 flex flex-wrap gap-2">
            {opening.moves?.map((move, i) => (
              <button
                key={i}
                onClick={() => setCurrentMoveIndex(i + 1)}
                className={`px-2 py-1 text-sm rounded font-mono transition-colors ${
                  i + 1 === currentMoveIndex 
                    ? 'bg-primary text-primary-foreground font-bold' 
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                {i % 2 === 0 ? `${Math.floor(i/2) + 1}. ` : ''}{move}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
