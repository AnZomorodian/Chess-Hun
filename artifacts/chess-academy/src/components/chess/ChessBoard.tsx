import React, { useState, useEffect, useCallback } from 'react';
import { Chess, Square } from 'chess.js';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// High-quality Unicode representations for a luxury feel
const PIECE_SYMBOLS: Record<string, string> = {
  'p': '♙', 'n': '♘', 'b': '♗', 'r': '♖', 'q': '♕', 'k': '♔',
  'P': '♙', 'N': '♘', 'B': '♗', 'R': '♖', 'Q': '♕', 'K': '♔'
};

interface ChessBoardProps {
  fen?: string;
  onMove?: (move: { from: string; to: string; promotion?: string }) => boolean;
  interactive?: boolean;
  orientation?: 'w' | 'b';
  className?: string;
}

export function ChessBoard({ 
  fen = 'start', 
  onMove, 
  interactive = true,
  orientation = 'w',
  className 
}: ChessBoardProps) {
  const [game, setGame] = useState(new Chess());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [validMoves, setValidMoves] = useState<string[]>([]);
  const [lastMove, setLastMove] = useState<{from: string, to: string} | null>(null);

  useEffect(() => {
    try {
      const newGame = new Chess();
      if (fen !== 'start') {
        newGame.load(fen);
      }
      setGame(newGame);
      setSelectedSquare(null);
      setValidMoves([]);
    } catch (e) {
      console.error("Invalid FEN provided to ChessBoard");
    }
  }, [fen]);

  const handleSquareClick = useCallback((square: Square) => {
    if (!interactive) return;

    // If a square is already selected, try to make a move
    if (selectedSquare) {
      const moves = game.moves({ square: selectedSquare, verbose: true });
      const move = moves.find(m => m.to === square);

      if (move) {
        // Valid move
        const moveDetails = {
          from: selectedSquare,
          to: square,
          promotion: move.promotion ? 'q' : undefined // Auto-queen for simplicity in this demo
        };

        const success = onMove ? onMove(moveDetails) : true;
        
        if (success) {
          const gameCopy = new Chess(game.fen());
          gameCopy.move(moveDetails);
          setGame(gameCopy);
          setLastMove({ from: selectedSquare, to: square });
        }
        
        setSelectedSquare(null);
        setValidMoves([]);
        return;
      }
    }

    // Select a piece to move
    const piece = game.get(square);
    if (piece && piece.color === game.turn()) {
      setSelectedSquare(square);
      const moves = game.moves({ square, verbose: true });
      setValidMoves(moves.map(m => m.to));
    } else {
      setSelectedSquare(null);
      setValidMoves([]);
    }
  }, [game, interactive, onMove, selectedSquare]);

  const board = game.board();
  const ranks = orientation === 'w' ? [8,7,6,5,4,3,2,1] : [1,2,3,4,5,6,7,8];
  const files = orientation === 'w' ? ['a','b','c','d','e','f','g','h'] : ['h','g','f','e','d','c','b','a'];

  return (
    <div className={cn("relative aspect-square w-full max-w-2xl mx-auto rounded-xl overflow-hidden border-4 border-border/80 shadow-2xl shadow-black/50", className)}>
      <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
        {ranks.map((rank, i) => (
          files.map((file, j) => {
            const square = `${file}${rank}` as Square;
            const piece = game.get(square);
            const isDark = (i + j) % 2 !== 0;
            const isSelected = selectedSquare === square;
            const isValidMove = validMoves.includes(square);
            const isLastMove = lastMove?.from === square || lastMove?.to === square;
            
            return (
              <div 
                key={square}
                onClick={() => handleSquareClick(square)}
                className={cn(
                  "relative flex items-center justify-center w-full h-full",
                  isDark ? "bg-[#35403C]" : "bg-[#E3D9C9]", // Custom premium board colors
                  interactive && "cursor-pointer",
                  isSelected && "bg-primary/40",
                  isLastMove && !isSelected && "bg-accent/20"
                )}
              >
                {/* Notation */}
                {j === 0 && (
                  <span className={cn(
                    "absolute top-1 left-1 text-[0.6rem] font-bold opacity-60",
                    isDark ? "text-[#E3D9C9]" : "text-[#35403C]"
                  )}>
                    {rank}
                  </span>
                )}
                {i === 7 && (
                  <span className={cn(
                    "absolute bottom-1 right-1 text-[0.6rem] font-bold opacity-60",
                    isDark ? "text-[#E3D9C9]" : "text-[#35403C]"
                  )}>
                    {file}
                  </span>
                )}

                {/* Valid Move Indicator */}
                {isValidMove && !piece && (
                  <div className="w-1/4 h-1/4 rounded-full bg-black/20" />
                )}
                {isValidMove && piece && (
                  <div className="absolute inset-0 border-4 border-black/20 rounded-full" />
                )}

                {/* Piece */}
                <AnimatePresence>
                  {piece && (
                    <motion.div
                      layoutId={`piece-${piece.type}-${piece.color}-${square}`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className={cn(
                        "w-[80%] h-[80%] flex items-center justify-center text-[min(5vw,4rem)] leading-none select-none drop-shadow-md",
                        piece.color === 'w' 
                          ? "text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]" 
                          : "text-black drop-shadow-[0_2px_0px_rgba(255,255,255,0.3)]"
                      )}
                    >
                      {PIECE_SYMBOLS[piece.type]}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        ))}
      </div>
    </div>
  );
}
